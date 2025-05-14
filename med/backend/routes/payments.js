const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      createdBy: req.user._id
    }).populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Calculate amount based on appointment type
    const amount = appointment.type === 'in-person' 
      ? appointment.doctorId.consultationFees.inPerson 
      : appointment.doctorId.consultationFees.teleconsultation;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        appointmentId: appointment._id.toString(),
        patientId: req.user._id.toString(),
        doctorId: appointment.doctorId._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: 'Webhook error', error: error.message });
  }
});

// Process refund
router.post('/refund', [
  auth,
  body('appointmentId').isMongoId().withMessage('Valid appointment ID is required'),
  body('reason').trim().notEmpty().withMessage('Refund reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await Appointment.findOne({
      _id: req.body.appointmentId,
      createdBy: req.user._id,
      'payment.status': 'completed'
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or payment not completed' });
    }

    // Check refund eligibility (e.g., time before appointment)
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      return res.status(400).json({ message: 'Refund not available within 24 hours of appointment' });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: appointment.payment.transactionId,
      reason: 'requested_by_customer'
    });

    // Update appointment payment status
    appointment.payment.status = 'refunded';
    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    res.status(500).json({ message: 'Error processing refund', error: error.message });
  }
});

// Helper functions
async function handlePaymentSuccess(paymentIntent) {
  const { appointmentId } = paymentIntent.metadata;
  
  await Appointment.findByIdAndUpdate(appointmentId, {
    'payment.status': 'completed',
    'payment.transactionId': paymentIntent.id,
    'payment.amount': paymentIntent.amount / 100,
    'payment.paidAt': new Date(),
    status: 'confirmed'
  });
}

async function handlePaymentFailure(paymentIntent) {
  const { appointmentId } = paymentIntent.metadata;
  
  await Appointment.findByIdAndUpdate(appointmentId, {
    'payment.status': 'failed',
    status: 'cancelled'
  });
}

module.exports = router; 