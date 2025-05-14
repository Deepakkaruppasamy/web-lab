import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../models/appointment.model';
import { MatDialogModule } from '@angular/material/dialog';
import { AppointmentEditModalComponent } from '../appointment-edit-modal/appointment-edit-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="appointments-container">
      <div class="appointments-header">
        <h2>My Appointments</h2>
        <button mat-raised-button color="primary" routerLink="/doctors">
          Book New Appointment
        </button>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="no-appointments" *ngIf="!loading && appointments.length === 0">
        <mat-card>
          <mat-card-content>
            <p>You have no appointments scheduled.</p>
            <button mat-raised-button color="primary" routerLink="/doctors">
              Book Your First Appointment
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="appointments-list" *ngIf="!loading && appointments.length > 0">
        <mat-card class="appointment-card" *ngFor="let appointment of appointments">
          <mat-card-header [ngClass]="getStatusClass(appointment.status)">
            <mat-card-title>{{ getDoctorName(appointment) }}</mat-card-title>
            <mat-card-subtitle>
              <span class="status-badge">{{appointment.status | titlecase}}</span>
              <span class="appointment-date">{{formatDate(appointment.date)}}</span>
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="appointment-details">
              <p><strong>Type:</strong> {{appointment.type === 'in-person' ? 'In-Person Visit' : 'Teleconsultation'}}</p>
              <p><strong>Specialty:</strong> {{appointment.specialty}}</p>
              <p><strong>Date:</strong> {{formatDate(appointment.date)}}</p>
              <p><strong>Time:</strong> {{appointment.timeSlot}}</p>
              <p><strong>Reason:</strong> {{appointment.reasonForVisit}}</p>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button 
              *ngIf="appointment.status === 'pending' || appointment.status === 'confirmed'"
              mat-icon-button 
              color="primary"
              matTooltip="Edit Appointment"
              (click)="editAppointment(appointment)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button 
              *ngIf="appointment.status === 'pending' || appointment.status === 'confirmed'"
              mat-icon-button 
              color="warn"
              matTooltip="Cancel Appointment"
              (click)="deleteAppointment(appointment._id!)"
            >
              <mat-icon>delete</mat-icon>
            </button>
            <button 
              *ngIf="appointment.status === 'pending' || appointment.status === 'confirmed'"
              mat-raised-button 
              color="warn"
              (click)="cancelAppointment(appointment._id!)"
            >
              Cancel Appointment
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .appointments-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #f9f9f9;
      min-height: calc(100vh - 64px);
    }

    .appointments-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .appointments-header h2 {
      font-size: 2rem;
      margin: 0;
      color: #333;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .no-appointments {
      text-align: center;
      padding: 2rem;
    }

    .no-appointments p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1.5rem;
    }

    .appointments-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .appointment-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-header {
      padding: 1rem;
    }

    mat-card-header.status-pending {
      background-color: #fff8e1;
      color: #ff8f00;
    }

    mat-card-header.status-confirmed {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    mat-card-header.status-completed {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    mat-card-header.status-cancelled {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-badge {
      font-size: 0.9rem;
      font-weight: 500;
      margin-right: 1rem;
    }

    .appointment-date {
      font-size: 0.9rem;
    }

    mat-card-content {
      padding: 1rem;
      flex-grow: 1;
    }

    .appointment-details p {
      margin: 0.5rem 0;
    }

    mat-card-actions {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .appointments-container {
        padding: 1rem;
      }

      .appointments-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .appointments-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
        this.snackBar.open('Failed to load appointments', 'Close', {
          duration: 3000
        });
      }
    });
  }

  getDoctorName(appointment: Appointment): string {
    // Handle when doctorName might not be in the model but it's used in the template
    return typeof appointment.doctorId === 'object' && 'name' in appointment.doctorId 
      ? (appointment.doctorId as any).name 
      : 'Dr. ' + appointment.doctorId;
  }

  editAppointment(appointment: Appointment) {
    const dialogRef = this.dialog.open(AppointmentEditModalComponent, {
      width: '500px',
      data: { appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
        this.snackBar.open('Appointment updated successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteAppointment(appointmentId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Appointment',
        message: 'Are you sure you want to delete this appointment permanently? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.deleteAppointment(appointmentId).subscribe({
          next: () => {
            this.snackBar.open('Appointment deleted permanently', 'Close', {
              duration: 3000
            });
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Error deleting appointment:', error);
            this.snackBar.open('Failed to delete appointment', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  cancelAppointment(appointmentId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Cancel Appointment',
        message: 'Are you sure you want to cancel this appointment?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.cancelAppointment(appointmentId).subscribe({
          next: () => {
            this.snackBar.open('Appointment cancelled successfully', 'Close', {
              duration: 3000
            });
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Error cancelling appointment:', error);
            this.snackBar.open('Failed to cancel appointment', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}