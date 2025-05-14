const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Patient Details
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { 
    type: String, 
    enum: ['male', 'female', 'other'], 
    required: true 
  },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  medicalHistory: { type: String },

  // Doctor Selection
  doctorId: { 
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
    required: true 
  },
  specialty: { type: String, required: true },

  // Appointment Details
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // Format: "HH:mm"
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'], 
    default: 'pending' 
  },
  type: { 
    type: String, 
    enum: ['in-person', 'teleconsultation'], 
    required: true 
  },
  reasonForVisit: { type: String, required: true },
  symptoms: { type: String },

  // Additional Features
  prescription: {
    medications: [{ 
      name: String, 
      dosage: String, 
      duration: String,
      instructions: String 
    }],
    notes: String,
    issuedAt: Date
  },
  
  payment: {
    amount: { type: Number },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },

  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: Date
  },

  // Notifications
  reminders: [{
    type: { 
      type: String, 
      enum: ['email', 'sms', 'in-app'] 
    },
    sentAt: Date,
    status: String
  }],

  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ createdBy: 1 });
appointmentSchema.index({ status: 1 });

// Prevent double bookings
appointmentSchema.pre('save', async function(next) {
  if ((this.isModified('date') || this.isModified('timeSlot') || this.isModified('doctorId')) && 
      typeof this.doctorId !== 'string') {
    const existingAppointment = await this.constructor.findOne({
      doctorId: this.doctorId,
      date: this.date,
      timeSlot: this.timeSlot,
      status: { $nin: ['cancelled', 'completed'] },
      _id: { $ne: this._id }
    });

    if (existingAppointment) {
      throw new Error('This time slot is already booked');
    }
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 