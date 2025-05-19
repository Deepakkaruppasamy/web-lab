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
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-edit-modal',
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
  template: `
    <div class="edit-modal">
      <h2 mat-dialog-title>Edit Appointment</h2>
      
      <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Appointment Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="appointmentDate" [min]="today">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="editForm.get('appointmentDate')?.hasError('required')">
              Appointment date is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Appointment Time</mat-label>
            <mat-select formControlName="timeSlot">
              <mat-option *ngFor="let slot of availableTimeSlots" [value]="slot">
                {{ slot }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="editForm.get('timeSlot')?.hasError('required')">
              Appointment time is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Appointment Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="in-person">In-Person</mat-option>
              <mat-option value="teleconsultation">Teleconsultation</mat-option>
            </mat-select>
            <mat-error *ngIf="editForm.get('type')?.hasError('required')">
              Appointment type is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Reason for Visit</mat-label>
            <textarea matInput formControlName="reasonForVisit" rows="2"></textarea>
            <mat-error *ngIf="editForm.get('reasonForVisit')?.hasError('required')">
              Reason for visit is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Additional Notes</mat-label>
            <textarea matInput formControlName="symptoms" rows="2"></textarea>
          </mat-form-field>
          
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </mat-dialog-content>
        
        <mat-dialog-actions align="end">
          <button type="button" mat-button (click)="onCancel()">Cancel</button>
          <button type="submit" mat-raised-button color="primary" [disabled]="loading || !editForm.valid">
            <span *ngIf="!loading">Update Appointment</span>
            <span *ngIf="loading">Updating...</span>
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .edit-modal {
      padding: 0 16px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .error-message {
      color: #f44336;
      background-color: rgba(244, 67, 54, 0.1);
      padding: 8px 12px;
      border-radius: 4px;
      margin-top: 8px;
    }
    
    mat-dialog-content {
      min-width: 400px;
    }
    
    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class AppointmentEditModalComponent implements OnInit {
  editForm: FormGroup;
  loading = false;
  error: string | null = null;
  
  availableTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  today = new Date();

  constructor(
    private dialogRef: MatDialogRef<AppointmentEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment },
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) {
    this.editForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      type: ['', Validators.required],
      reasonForVisit: ['', Validators.required],
      symptoms: ['']
    });
  }

  ngOnInit(): void {
    // Populate form with existing appointment data
    const appointment = this.data.appointment;
    
    this.editForm.patchValue({
      appointmentDate: new Date(appointment.date),
      timeSlot: appointment.timeSlot,
      type: appointment.type,
      reasonForVisit: appointment.reasonForVisit,
      symptoms: appointment.symptoms || ''
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.loading = true;
      this.error = null;
      
      const formData = this.editForm.value;
      const appointmentId = this.data.appointment._id;
      
      if (!appointmentId) {
        this.error = 'Appointment ID is missing.';
        this.loading = false;
        return;
      }
      
      // Create updated appointment data
      const updatedData: Partial<Appointment> = {
        date: this.formatDateForApi(formData.appointmentDate),
        timeSlot: formData.timeSlot,
        type: formData.type as 'in-person' | 'teleconsultation',
        reasonForVisit: formData.reasonForVisit,
        symptoms: formData.symptoms
      };
      
      this.appointmentService.updateAppointment(appointmentId, updatedData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          this.loading = false;
          this.error = 'Failed to update appointment. ' + (error.error?.message || error.message || 'Please try again.');
        }
      });
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  // Helper method to format date for the API
  formatDateForApi(date: Date): string {
    if (!date) return '';
    return new Date(date).toISOString();
  }
} 