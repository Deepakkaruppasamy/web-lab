import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `
    <div class="appointments-container">
      <div class="appointments-header">
        <h2>My Appointments</h2>
        <button mat-raised-button color="primary" routerLink="/appointments/book">
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
            <button mat-raised-button color="primary" routerLink="/appointments/book">
              Book Your First Appointment
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="appointments-list" *ngIf="!loading && appointments.length > 0">
        <mat-card class="appointment-card" *ngFor="let appointment of appointments">
          <mat-card-header [ngClass]="getStatusClass(appointment.status)">
            <div class="status-badge">{{appointment.status | titlecase}}</div>
            <div class="appointment-date">{{formatDate(appointment.date)}}</div>
          </mat-card-header>

          <mat-card-content>
            <div class="appointment-info">
              <h3>{{appointment.type === 'in-person' ? 'In-Person Visit' : 'Teleconsultation'}}</h3>
              <p class="doctor-info">
                <strong>Doctor:</strong> Dr. {{getDoctorName(appointment)}}
                <span class="specialty">({{appointment.specialty}})</span>
              </p>
              <p class="time-slot">
                <strong>Time:</strong> {{appointment.timeSlot}}
              </p>
              <p class="reason">
                <strong>Reason:</strong> {{appointment.reasonForVisit}}
              </p>
              <p *ngIf="appointment.symptoms" class="symptoms">
                <strong>Symptoms:</strong> {{appointment.symptoms}}
              </p>
            </div>

            <div class="appointment-actions">
              <ng-container [ngSwitch]="appointment.status">
                <div *ngSwitchCase="'scheduled'">
                  <button 
                    mat-raised-button 
                    color="warn"
                    (click)="cancelAppointment(appointment._id!)"
                  >
                    Cancel
                  </button>
                </div>
                <div *ngSwitchCase="'completed'" class="feedback-section">
                  <button 
                    *ngIf="!appointment.feedback"
                    mat-raised-button 
                    color="primary"
                    [routerLink]="['/appointments', appointment._id, 'feedback']"
                  >
                    Add Feedback
                  </button>
                  <div *ngIf="appointment.feedback" class="feedback-display">
                    <div class="rating">
                      Rating: {{appointment.feedback.rating}}/5
                    </div>
                    <div class="review">
                      "{{appointment.feedback.review}}"
                    </div>
                  </div>
                </div>
              </ng-container>
            </div>
          </mat-card-content>

          <mat-card-footer *ngIf="appointment.payment">
            <div class="payment-info">
              <span class="amount">Amount: {{appointment.payment.amount | currency}}</span>
              <span class="payment-status" [ngClass]="'payment-' + appointment.payment.status">
                {{appointment.payment.status | titlecase}}
              </span>
            </div>
          </mat-card-footer>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .appointments-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        font-size: 2rem;
        color: #2c3e50;
        margin: 0;
      }
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .no-appointments {
      text-align: center;
      padding: 2rem;

      p {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 1.5rem;
      }
    }

    .appointments-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .appointment-card {
      overflow: hidden;

      mat-card-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f8f9fa;
        margin-bottom: 0;

        &.status-scheduled {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        &.status-completed {
          background-color: #4caf50;
          color: white;
        }

        &.status-cancelled {
          background-color: #f44336;
          color: white;
        }

        .status-badge {
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .appointment-date {
          font-weight: 500;
        }
      }

      mat-card-content {
        padding: 1.5rem;

        .appointment-info {
          h3 {
            margin: 0 0 1rem;
            color: #2c3e50;
          }

          p {
            margin: 0.5rem 0;
            color: #666;

            strong {
              color: #2c3e50;
              margin-right: 0.5rem;
            }

            &.doctor-info {
              .specialty {
                color: #666;
                margin-left: 0.5rem;
              }
            }
          }
        }

        .appointment-actions {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;

          .feedback-section {
            .feedback-display {
              background-color: #f8f9fa;
              padding: 1rem;
              border-radius: 6px;

              .rating {
                font-weight: 500;
                margin-bottom: 0.5rem;
              }

              .review {
                font-style: italic;
                color: #666;
              }
            }
          }
        }
      }

      mat-card-footer {
        padding: 1rem;
        background-color: #f8f9fa;
        border-top: 1px solid #eee;

        .payment-info {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .amount {
            font-weight: 500;
          }

          .payment-status {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.9rem;

            &.payment-pending {
              background-color: #ffd54f;
              color: #2c3e50;
            }

            &.payment-completed {
              background-color: #4caf50;
              color: white;
            }

            &.payment-refunded {
              background-color: #f44336;
              color: white;
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .appointments-container {
        padding: 1rem;
      }

      .appointments-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;

  constructor(private appointmentService: AppointmentService) {}

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
      }
    });
  }

  cancelAppointment(appointmentId: string) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(appointmentId).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  getDoctorName(appointment: Appointment): string {
    return appointment.doctorId?.toString() || 'Not Assigned';
  }
} 