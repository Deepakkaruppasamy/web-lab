import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DemoRequestService } from '../../services/demo-request.service';

@Component({
  selector: 'app-appointment-simple-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="page-container">
      <div class="header-section">
        <h1>Thank you for your Interest!</h1>
        <p>We would be delighted to learn more about your practice and provide you with comprehensive information about our medical services.</p>
      </div>

      <div class="form-container">
        <h2>Schedule a demo</h2>
        <p class="subtitle">Kindly complete this form, and our dedicated team will contact you within the next 24 hours</p>

        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" required>
              <mat-error *ngIf="bookingForm.get('firstName')?.hasError('required')">First name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required>
              <mat-error *ngIf="bookingForm.get('lastName')?.hasError('required')">Last name is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Email address</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="bookingForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="bookingForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input matInput type="tel" formControlName="phone" required>
              <mat-error *ngIf="bookingForm.get('phone')?.hasError('required')">Phone number is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Country</mat-label>
              <mat-select formControlName="country" required>
                <mat-option value="United States">United States</mat-option>
                <mat-option value="Canada">Canada</mat-option>
                <mat-option value="United Kingdom">United Kingdom</mat-option>
                <mat-option value="Australia">Australia</mat-option>
                <mat-option value="Other">Other</mat-option>
              </mat-select>
              <mat-error *ngIf="bookingForm.get('country')?.hasError('required')">Country is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Address</mat-label>
              <input matInput formControlName="address" required>
              <mat-error *ngIf="bookingForm.get('address')?.hasError('required')">Address is required</mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Organization Name</mat-label>
            <input matInput formControlName="organizationName" required>
            <mat-error *ngIf="bookingForm.get('organizationName')?.hasError('required')">Organization name is required</mat-error>
          </mat-form-field>

          <div class="size-options">
            <label>Health Institution Size</label>
            <div class="size-buttons">
              <button type="button" mat-stroked-button 
                      [class.selected]="bookingForm.get('healthInstitutionSize')?.value === '1-25 Beds/day'"
                      (click)="selectSize('1-25 Beds/day')">1-25 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="bookingForm.get('healthInstitutionSize')?.value === '26-50 Beds/day'"
                      (click)="selectSize('26-50 Beds/day')">26-50 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="bookingForm.get('healthInstitutionSize')?.value === '51-100 Beds/day'"
                      (click)="selectSize('51-100 Beds/day')">51-100 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="bookingForm.get('healthInstitutionSize')?.value === '101-200 Beds/day'"
                      (click)="selectSize('101-200 Beds/day')">101-200 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="bookingForm.get('healthInstitutionSize')?.value === 'Above 200 Beds/day'"
                      (click)="selectSize('Above 200 Beds/day')">Above 200 Beds/day</button>
            </div>
            <mat-error *ngIf="bookingForm.get('healthInstitutionSize')?.hasError('required') && bookingForm.get('healthInstitutionSize')?.touched">
              Please select an institution size
            </mat-error>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Hospital Type</mat-label>
            <mat-select formControlName="hospitalType" required>
              <mat-option value="General Hospital">General Hospital</mat-option>
              <mat-option value="Specialty Hospital">Specialty Hospital</mat-option>
              <mat-option value="Clinic">Clinic</mat-option>
              <mat-option value="Diagnostic Center">Diagnostic Center</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
            <mat-error *ngIf="bookingForm.get('hospitalType')?.hasError('required')">Hospital type is required</mat-error>
          </mat-form-field>

          <div class="terms">
            <p>By clicking "Submit", I agree to the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Use</a></p>
          </div>

          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="!bookingForm.valid || loading">
            {{ loading ? 'Submitting...' : 'Request Now' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/assets/images/medical-bg.jpg');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 4rem 2rem;
      border-radius: 8px;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.1rem;
        max-width: 800px;
        margin: 0 auto;
      }
    }

    .form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);

      h2 {
        font-size: 1.8rem;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: #666;
        margin-bottom: 2rem;
      }
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;

      mat-form-field {
        flex: 1;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .size-options {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: rgba(0,0,0,0.6);
      }

      .size-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        button {
          flex: 1;
          min-width: 120px;
          padding: 0.5rem;

          &.selected {
            background-color: #e3f2fd;
            color: #1976d2;
            border-color: #1976d2;
          }
        }
      }
    }

    .terms {
      margin: 1.5rem 0;
      font-size: 0.9rem;
      color: #666;

      a {
        color: #1976d2;
        text-decoration: none;
      }
    }

    button[type="submit"] {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
      background-color: #1976d2;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .size-buttons button {
        width: 100%;
      }
    }
  `]
})
export class AppointmentSimpleBookingComponent {
  bookingForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private demoRequestService: DemoRequestService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      organizationName: ['', Validators.required],
      healthInstitutionSize: ['', Validators.required],
      hospitalType: ['', Validators.required]
    });
  }

  selectSize(size: string) {
    this.bookingForm.patchValue({ healthInstitutionSize: size });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.loading = true;
      const formData = {
        firstName: this.bookingForm.value.firstName,
        lastName: this.bookingForm.value.lastName,
        email: this.bookingForm.value.email,
        phone: this.bookingForm.value.phone,
        country: this.bookingForm.value.country,
        address: this.bookingForm.value.address,
        organizationName: this.bookingForm.value.organizationName,
        healthInstitutionSize: this.bookingForm.value.healthInstitutionSize,
        hospitalType: this.bookingForm.value.hospitalType
      };
      
      this.demoRequestService.createDemoRequest(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Demo request submitted successfully! We will contact you shortly.', 'Close', {
            duration: 5000
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error submitting demo request:', error);
          this.snackBar.open(error.error?.message || 'Error submitting demo request. Please try again.', 'Close', {
            duration: 5000
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.bookingForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}