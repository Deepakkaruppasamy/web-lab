const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Validation middleware
const doctorValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('specialty').trim().notEmpty().withMessage('Specialty is required'),
  body('experience').isInt({ min: 0 }).withMessage('Valid experience is required'),
  body('consultationFees.inPerson').isFloat({ min: 0 }).withMessage('Valid in-person consultation fee is required'),
  body('consultationFees.teleconsultation').isFloat({ min: 0 }).withMessage('Valid teleconsultation fee is required')
];

// Get all doctors (public route)
router.get('/', async (req, res) => {
  try {
    const query = { status: 'active' };
    
    // Apply filters
    if (req.query.specialty) query.specialty = req.query.specialty;
    if (req.query.minRating) query['rating.average'] = { $gte: parseFloat(req.query.minRating) };
    
    const doctors = await Doctor.find(query)
      .select('-videoCallCredentials')
      .sort({ 'rating.average': -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// Get doctor by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-videoCallCredentials');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
});

// Get doctor's availability
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const dayOfWeek = new Date(date).toLocaleLowerCase();
    const availability = doctor.availability.find(a => a.day === dayOfWeek);

    res.json(availability?.slots || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability', error: error.message });
  }
});

// Create doctor (admin only)
router.post('/', [auth, admin, doctorValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingDoctor = await Doctor.findOne({ email: req.body.email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    const doctor = new Doctor(req.body);
    await doctor.save();

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor', error: error.message });
  }
});

// Update doctor (admin only)
router.put('/:id', [auth, admin, doctorValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
});

// Update doctor's availability (doctor or admin)
router.put('/:id/availability', [auth], async (req, res) => {
  try {
    const { availability } = req.body;
    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'Availability must be an array' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Only allow if user is admin or the doctor themselves
    if (!req.user.isAdmin && req.user._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    doctor.availability = availability;
    await doctor.save();

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
});

// Delete doctor (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
});

module.exports = router; 