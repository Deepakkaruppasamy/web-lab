const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialty: { type: String, required: true },
  qualifications: [String],
  experience: { type: Number, default: 0 }, // years
  bio: String,
  profileImage: String,
  rating: { 
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  consultationFees: {
    inPerson: { type: Number, required: true },
    teleconsultation: { type: Number, required: true }
  },
  // Availability slots by day of week
  availability: [{
    day: { 
      type: String, 
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
    },
    slots: [{
      start: String, // Format: "HH:mm"
      end: String // Format: "HH:mm"
    }]
  }],
  hospital: { 
    name: String,
    address: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Indexes
doctorSchema.index({ 'hospital.location': '2dsphere' });
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ name: 'text' });

// Check if a doctor is available for a specific time slot
doctorSchema.methods.isAvailable = function(date, timeSlot) {
  // Simple mock implementation - in a real scenario this would check against
  // the doctor's availability schedule and existing appointments
  
  // Convert date to day of week
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
  
  // Find the day's availability
  const dayAvailability = this.availability.find(a => a.day === dayOfWeek);
  if (!dayAvailability) return false;
  
  // Check if the time slot falls within any available slot
  return dayAvailability.slots.some(slot => {
    return timeSlot >= slot.start && timeSlot <= slot.end;
  });
};

// Update doctor's rating
doctorSchema.methods.updateRating = function(newRating) {
  this.rating.total += newRating;
  this.rating.count += 1;
  this.rating.average = this.rating.total / this.rating.count;
};

// Pre-save middleware to update the updatedAt field
doctorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;