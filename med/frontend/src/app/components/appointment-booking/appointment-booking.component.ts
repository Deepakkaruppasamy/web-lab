import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.scss']
})
export class AppointmentBookingComponent implements OnInit {
  bookingForm: FormGroup;
  doctors: any[] = [];
  specialties: string[] = [];
  availableSlots: any[] = [];
  loading = false;
  selectedDoctor: any = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      patientName: ['', Validators.required],
      patientAge: ['', [Validators.required, Validators.min(0)]],
      patientGender: ['', Validators.required],
      contactPhone: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      medicalHistory: [''],
      specialty: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      type: ['in-person', Validators.required],
      reasonForVisit: ['', Validators.required],
      symptoms: ['']
    });
  }

  ngOnInit() {
    this.loadSpecialties();
    this.setupFormListeners();
  }

  private loadSpecialties() {
    this.doctorService.getSpecialties().subscribe({
      next: (specialties) => {
        this.specialties = specialties;
      },
      error: (error) => {
        this.notificationService.error('Error loading specialties');
        console.error('Error:', error);
      }
    });
  }

  private setupFormListeners() {
    // Load doctors when specialty changes
    this.bookingForm.get('specialty')?.valueChanges.subscribe(specialty => {
      if (specialty) {
        this.loadDoctors(specialty);
      }
    });

    // Load available slots when doctor or date changes
    this.bookingForm.get('doctorId')?.valueChanges.subscribe(doctorId => {
      if (doctorId) {
        this.loadDoctorDetails(doctorId);
        this.checkAvailability();
      }
    });

    this.bookingForm.get('date')?.valueChanges.subscribe(() => {
      this.checkAvailability();
    });
  }

  private loadDoctors(specialty: string) {
    this.doctorService.getDoctorsBySpecialty(specialty).subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },
      error: (error) => {
        this.notificationService.error('Error loading doctors');
        console.error('Error:', error);
      }
    });
  }

  private loadDoctorDetails(doctorId: string) {
    this.doctorService.getDoctor(doctorId).subscribe({
      next: (doctor) => {
        this.selectedDoctor = doctor;
        // Update consultation fee based on appointment type
        this.updateConsultationFee();
      },
      error: (error) => {
        this.notificationService.error('Error loading doctor details');
        console.error('Error:', error);
      }
    });
  }

  private checkAvailability() {
    const doctorId = this.bookingForm.get('doctorId')?.value;
    const date = this.bookingForm.get('date')?.value;

    if (doctorId && date) {
      this.appointmentService.getDoctorSlots(doctorId, date).subscribe({
        next: (slots) => {
          this.availableSlots = slots;
          if (slots.length === 0) {
            this.notificationService.warning('No available slots for selected date');
          }
        },
        error: (error) => {
          this.notificationService.error('Error checking availability');
          console.error('Error:', error);
        }
      });
    }
  }

  private updateConsultationFee() {
    if (this.selectedDoctor) {
      const appointmentType = this.bookingForm.get('type')?.value;
      const fee = appointmentType === 'in-person' 
        ? this.selectedDoctor.consultationFees.inPerson 
        : this.selectedDoctor.consultationFees.teleconsultation;
      
      this.bookingForm.patchValue({ consultationFee: fee });
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.loading = true;
      this.appointmentService.createAppointment(this.bookingForm.value).subscribe({
        next: (response) => {
          this.notificationService.success('Appointment booked successfully');
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          this.notificationService.error(error.error.message || 'Error booking appointment');
          console.error('Error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.notificationService.error('Please fill all required fields correctly');
    }
  }
} 