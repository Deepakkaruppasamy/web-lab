const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Appointment = require("./Appointment");

const app = express();
const PORT = 2006;

mongoose
  .connect("mongodb://localhost:27017/medconsult", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error(" Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); 

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public/signup.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public/login.html")));

// Book Appointment
app.post("/appointments", async (req, res) => {
  try {
    const {
      doctor,
      patient,
      appointmentDate,
      appointmentTime,
      bookingDate,
      bookingTime,
    } = req.body;

    if (!doctor || !patient || !appointmentDate || !appointmentTime || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// Get Appointments
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "The requested route does not exist. Please check the URL." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
