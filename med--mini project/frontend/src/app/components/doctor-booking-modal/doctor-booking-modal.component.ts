import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Doctor } from '../../models/doctor.model';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-doctor-booking-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './doctor-booking-modal.component.html',
  styleUrls: ['./doctor-booking-modal.component.scss']
})
export class DoctorBookingModalComponent implements OnInit {
  bookingForm: FormGroup;
  loading = false;
  error: string | null = null;

  availableTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];

  appointmentTypes = [
    { value: 'in-person', label: 'In-Person' },
    { value: 'teleconsultation', label: 'Teleconsultation' }
  ];

  today = new Date();
  maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 3, this.today.getDate());

  constructor(
    private dialogRef: MatDialogRef<DoctorBookingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor },
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      patientName: ['', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      patientGender: ['male', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      type: ['in-person', [Validators.required]],
      reasonForVisit: ['', [Validators.required]],
      additionalNotes: ['']
    });
  }

  ngOnInit(): void {
    // Get user info for pre-filling form
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.bookingForm.patchValue({
        patientName: currentUser.name || '',
        contactEmail: currentUser.email || '',
        contactPhone: currentUser.phone || ''
      });
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      this.error = null;

      // Format the date for the API
      const appointmentDate = this.formatDateForApi(this.bookingForm.value.appointmentDate);

      const formData = this.bookingForm.value;
      
      // Create a properly typed appointment object
      const appointmentData: Partial<Appointment> = {
        patientName: formData.patientName,
        patientAge: 30, // Default age since not collected in the form
        patientGender: formData.patientGender as 'male' | 'female' | 'other',
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        doctorId: this.data.doctor._id,
        specialty: this.data.doctor.specialty,
        // Make sure we're sending a proper ISO date string
        date: appointmentDate,
        timeSlot: formData.appointmentTime,
        type: formData.type as 'in-person' | 'teleconsultation',
        reasonForVisit: formData.reasonForVisit,
        symptoms: formData.additionalNotes || '',
        // Add necessary default fields required by the backend
        medicalHistory: '',
        status: 'pending' as const
      };

      console.log('Submitting appointment data:', appointmentData);

      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (response) => {
          console.log('Appointment created successfully:', response);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          this.loading = false;
          this.error = 'Failed to book appointment. Please try again. Error: ' + (error.error?.message || error.message || 'Unknown error');
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  // Helper method to format date for the API
  formatDateForApi(date: Date): string {
    if (!date) return '';
    return new Date(date).toISOString();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
