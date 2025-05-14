const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Twilio configuration (optional)
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Email templates
const emailTemplates = {
  appointment_confirmation: (appointment) => ({
    subject: 'Appointment Confirmation',
    html: `
      <h2>Your appointment has been confirmed</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Your appointment has been scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}.</p>
      <p>Doctor: Dr. ${appointment.doctorId.name}</p>
      <p>Type: ${appointment.type}</p>
      <p>Please arrive 10 minutes before your scheduled time.</p>
      ${appointment.type === 'teleconsultation' ? '<p>Video call link will be sent 30 minutes before the appointment.</p>' : ''}
      <p>Thank you for choosing our service!</p>
    `
  }),
  
  appointment_update: (appointment) => ({
    subject: 'Appointment Updated',
    html: `
      <h2>Your appointment has been updated</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Your appointment details have been updated:</p>
      <p>New Date: ${new Date(appointment.date).toLocaleDateString()}</p>
      <p>New Time: ${appointment.timeSlot}</p>
      <p>Doctor: Dr. ${appointment.doctorId.name}</p>
      <p>Type: ${appointment.type}</p>
      <p>Please make note of these changes.</p>
    `
  }),

  appointment_cancellation: (appointment) => ({
    subject: 'Appointment Cancellation Notice',
    html: `
      <h2>Appointment Cancellation Notice</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot} has been cancelled.</p>
      <p>If you did not request this cancellation, please contact us immediately.</p>
    `
  }),

  appointment_reminder: (appointment) => ({
    subject: 'Appointment Reminder',
    html: `
      <h2>Appointment Reminder</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
      <p>Time: ${appointment.timeSlot}</p>
      <p>Doctor: Dr. ${appointment.doctorId.name}</p>
      <p>Type: ${appointment.type}</p>
      ${appointment.type === 'teleconsultation' ? '<p>Video call link will be sent 30 minutes before the appointment.</p>' : ''}
    `
  }),

  new_prescription: (appointment) => ({
    subject: 'New Prescription Available',
    html: `
      <h2>New Prescription</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>A new prescription has been issued for your recent appointment on ${new Date(appointment.date).toLocaleDateString()}.</p>
      <p>Please log in to your account to view the complete prescription details.</p>
      <p>Doctor: Dr. ${appointment.doctorId.name}</p>
    `
  })
};

// SMS templates
const smsTemplates = {
  appointment_confirmation: (appointment) => 
    `Appointment confirmed for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot} with Dr. ${appointment.doctorId.name}`,
  
  appointment_reminder: (appointment) =>
    `Reminder: Your appointment is tomorrow at ${appointment.timeSlot} with Dr. ${appointment.doctorId.name}`,
  
  appointment_cancellation: (appointment) =>
    `Your appointment for ${new Date(appointment.date).toLocaleDateString()} has been cancelled`
};

// Send email
const sendEmail = async (to, subject, { type, appointment }) => {
  try {
    console.log(`[Email Notification] Would send ${subject} email to ${to}`);
    // Mock successful email sending without actually sending
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to prevent breaking the main flow
    return false;
  }
};

// Send SMS
const sendSMS = async (to, { type, appointment }) => {
  try {
    console.log(`[SMS Notification] Would send ${type} SMS to ${to}`);
    // Mock successful SMS sending without actually sending
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    // Don't throw error to prevent breaking the main flow
    return false;
  }
};

module.exports = {
  sendEmail,
  sendSMS
}; 