const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const DemoRequest = require('../models/DemoRequest');

// Create new demo request
router.post('/', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
  body('healthInstitutionSize').isIn(['1-25 Beds/day', '26-50 Beds/day', '51-100 Beds/day', '101-200 Beds/day', 'Above 200 Beds/day'])
    .withMessage('Valid health institution size is required'),
  body('hospitalType').trim().notEmpty().withMessage('Hospital type is required')
], async (req, res) => {
  try {
    console.log('Demo request received:', {
      body: req.body,
      headers: req.headers,
      method: req.method,
      url: req.url
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Demo request validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const demoRequest = new DemoRequest(req.body);
    await demoRequest.save();

    console.log('Demo request created successfully:', {
      id: demoRequest._id,
      email: demoRequest.email,
      organizationName: demoRequest.organizationName
    });

    res.status(201).json({
      message: 'Demo request submitted successfully',
      demoRequest
    });
  } catch (error) {
    console.error('Error creating demo request:', error);
    res.status(500).json({ 
      message: 'Error submitting demo request', 
      error: error.message 
    });
  }
});

module.exports = router; 