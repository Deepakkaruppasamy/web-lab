const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  healthInstitutionSize: {
    type: String,
    enum: ['1-25 Beds/day', '26-50 Beds/day', '51-100 Beds/day', '101-200 Beds/day', 'Above 200 Beds/day'],
    required: true
  },
  hospitalType: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);

module.exports = DemoRequest; 