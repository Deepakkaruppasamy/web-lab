const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const { sendEmail, sendSMS } = require('../utils/notifications');

// Validation middleware
const appointmentValidation = [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientAge').isInt({ min: 0 }).withMessage('Valid age is required'),
  body('patientGender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('contactPhone').trim().notEmpty().withMessage('Contact phone is required'),
  body('contactEmail').isEmail().withMessage('Valid email is required'),
  body('doctorId').trim().notEmpty().withMessage('Doctor ID is required'),
  body('specialty').trim().notEmpty().withMessage('Specialty is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('timeSlot').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time slot is required (HH:mm)'),
  body('type').isIn(['in-person', 'teleconsultation']).withMessage('Valid appointment type is required'),
  body('reasonForVisit').trim().notEmpty().withMessage('Reason for visit is required')
];

// Get all appointments for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ createdBy: req.user._id })
      .populate('doctorId', 'name specialty rating')
      .sort({ date: 1, timeSlot: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Get single appointment
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received appointment creation request with data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    // For mock data with string IDs
    const isDemoDoctor = typeof req.body.doctorId === 'string' && !req.body.doctorId.match(/^[0-9a-fA-F]{24}$/);
    console.log('Is demo doctor:', isDemoDoctor);
    
    let doctor = null;
    if (!isDemoDoctor) {
      doctor = await Doctor.findById(req.body.doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
    }

    // Create the appointment data with defaults for any missing required fields
    const appointmentData = {
      ...req.body,
      createdBy: req.user._id,
      status: req.body.status || 'pending',
      patientAge: req.body.patientAge || 30,
      patientGender: req.body.patientGender || 'male',
      medicalHistory: req.body.medicalHistory || ''
    };

    console.log('Creating appointment with data:', appointmentData);

    const appointment = new Appointment(appointmentData);

    const savedAppointment = await appointment.save();
    console.log('Appointment created successfully:', savedAppointment._id);
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: 'Error creating appointment', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Received appointment update request for ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Don't allow updates to completed or cancelled appointments
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Cannot update a completed or cancelled appointment' 
      });
    }

    // Update only allowed fields
    const allowedFields = ['date', 'timeSlot', 'type', 'reasonForVisit', 'symptoms'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field];
      }
    }
    
    // Update the updatedBy field
    appointment.updatedBy = req.user._id;

    const updatedAppointment = await appointment.save();
    console.log('Appointment updated successfully:', updatedAppointment._id);
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      message: 'Error updating appointment', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Delete appointment permanently (Admin or emergency operation)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Received appointment delete request for ID:', req.params.id);
    
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow deletion of pending or confirmed appointments
    if (appointment.status !== 'pending' && appointment.status !== 'confirmed') {
      return res.status(400).json({ 
        message: 'Only pending or confirmed appointments can be deleted' 
      });
    }

    await Appointment.deleteOne({ _id: req.params.id });
    console.log('Appointment deleted successfully:', req.params.id);
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      message: 'Error deleting appointment', 
      error: error.message 
    });
  }
});

// Cancel appointment
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
        status: { $nin: ['completed', 'cancelled'] }
      },
      {
        status: 'cancelled',
        updatedBy: req.user._id
      },
      { new: true }
    ).populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or cannot be cancelled' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
});

// Add feedback
router.post('/:id/feedback', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').trim().notEmpty().withMessage('Review is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
        status: 'completed',
        'feedback.rating': { $exists: false }
      },
      {
        feedback: {
          rating: req.body.rating,
          review: req.body.review,
          createdAt: new Date()
        }
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or feedback already submitted' });
    }

    // Update doctor's rating
    const doctor = await Doctor.findById(appointment.doctorId);
    doctor.updateRating(req.body.rating);
    await doctor.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding feedback', error: error.message });
  }
});

// Get doctor's available slots
router.get('/doctor/:doctorId/slots', auth, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get doctor's availability for the date
    const dayOfWeek = new Date(date).toLocaleLowerCase();
    const availability = doctor.availability.find(a => a.day === dayOfWeek);

    // Get booked appointments for the date
    const bookedAppointments = await Appointment.find({
      doctorId: req.params.doctorId,
      date: new Date(date),
      status: { $nin: ['cancelled', 'no-show'] }
    });

    // Filter out booked slots
    const availableSlots = availability?.slots.filter(slot => {
      return !bookedAppointments.some(apt => apt.timeSlot === slot.startTime);
    }) || [];

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error: error.message });
  }
});

module.exports = router; 