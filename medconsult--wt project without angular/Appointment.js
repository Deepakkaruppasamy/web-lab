const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: String,
  patient: String,
  appointmentDate: String,
  appointmentTime: String,
  bookingDate: String,
  bookingTime: String,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
