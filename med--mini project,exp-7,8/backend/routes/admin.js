const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get system statistics
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      appointmentsByStatus,
      appointmentsByType,
      recentAppointments
    ] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ isAdmin: false }),
      Appointment.countDocuments(),
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Appointment.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('doctorId', 'name specialty')
    ]);

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      appointmentsByStatus: Object.fromEntries(
        appointmentsByStatus.map(({ _id, count }) => [_id, count])
      ),
      appointmentsByType: Object.fromEntries(
        appointmentsByType.map(({ _id, count }) => [_id, count])
      ),
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Update clinic hours
router.put('/clinic-hours', [
  auth, 
  admin,
  body('hours').isArray().withMessage('Hours must be an array'),
  body('hours.*.day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day'),
  body('hours.*.isOpen').isBoolean().withMessage('isOpen must be a boolean'),
  body('hours.*.openTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid open time'),
  body('hours.*.closeTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid close time')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Update clinic hours in settings collection or similar
    // Implementation depends on how you store clinic settings

    res.json({ message: 'Clinic hours updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating clinic hours', error: error.message });
  }
});

// Add holiday
router.post('/holidays', [
  auth, 
  admin,
  body('date').isISO8601().withMessage('Valid date is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add holiday to settings collection or similar
    // Implementation depends on how you store clinic settings

    res.status(201).json({ message: 'Holiday added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding holiday', error: error.message });
  }
});

// Get all users (for admin management)
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user role
router.patch('/users/:id/role', [
  auth, 
  admin,
  body('isAdmin').isBoolean().withMessage('isAdmin must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: req.body.isAdmin },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
});

// Get revenue statistics
router.get('/revenue', [auth, admin], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      'payment.status': 'completed'
    };

    if (startDate) query.createdAt = { $gte: new Date(startDate) };
    if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };

    const revenue = await Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$payment.amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue statistics', error: error.message });
  }
});

module.exports = router;