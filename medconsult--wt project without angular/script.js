let selectedDoctor = "";

function openModal(doctorName) {
  selectedDoctor = doctorName;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function bookAppointment() {
  const appointmentDate = document.getElementById("appointmentDate").value;
  const appointmentTime = document.getElementById("appointmentTime").value;
  const patientName = document.getElementById("patientName").value;
  const bookingDate = new Date().toISOString().split("T")[0];
  const bookingTime = new Date().toTimeString().split(" ")[0];

  fetch("/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doctor: selectedDoctor,
      patient: patientName,
      appointmentDate,
      appointmentTime,
      bookingDate,
      bookingTime
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Appointment Booked!");
      closeModal();
    })
    .catch(err => alert("Error booking appointment"));
}
