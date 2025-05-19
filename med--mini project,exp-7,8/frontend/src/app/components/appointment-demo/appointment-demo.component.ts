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
  selector: 'app-appointment-demo',
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
    <div class="schedule-demo-container">
      <div class="header">
        <h1>Thank you for your Interest!</h1>
        <p>We would be delighted to learn more about your practice and provide you with comprehensive information about our medical services.</p>
      </div>

      <div class="form-container">
        <h2>Schedule a demo</h2>
        <p class="subtitle">Kindly complete this form, and our dedicated team will contact you within the next 24 hours</p>

        <form [formGroup]="demoForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Email address</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input matInput type="tel" formControlName="phone" required>
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
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Address</mat-label>
              <input matInput formControlName="address" required>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Organization Name</mat-label>
            <input matInput formControlName="organizationName" required>
          </mat-form-field>

          <div class="size-options">
            <label>Health Institution Size</label>
            <div class="size-buttons">
              <button type="button" mat-stroked-button 
                      [class.selected]="demoForm.get('institutionSize')?.value === '1-25 Beds/day'"
                      (click)="selectSize('1-25 Beds/day')">1-25 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="demoForm.get('institutionSize')?.value === '26-50 Beds/day'"
                      (click)="selectSize('26-50 Beds/day')">26-50 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="demoForm.get('institutionSize')?.value === '51-100 Beds/day'"
                      (click)="selectSize('51-100 Beds/day')">51-100 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="demoForm.get('institutionSize')?.value === '101-200 Beds/day'"
                      (click)="selectSize('101-200 Beds/day')">101-200 Beds/day</button>
              <button type="button" mat-stroked-button 
                      [class.selected]="demoForm.get('institutionSize')?.value === 'Above 200 Beds/day'"
                      (click)="selectSize('Above 200 Beds/day')">Above 200 Beds/day</button>
            </div>
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
          </mat-form-field>

          <div class="terms">
            <p>By clicking "Submit", I agree to the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Use</a></p>
          </div>

          <button mat-raised-button color="primary" type="submit" [disabled]="!demoForm.valid || loading">
            {{ loading ? 'Submitting...' : 'Request Now' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .schedule-demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #ffffff;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/assets/images/medical-bg.jpg');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 4rem 2rem;
      border-radius: 8px;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h2 {
      font-size: 1.8rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    mat-form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .size-options {
      margin-bottom: 1.5rem;
    }

    .size-options label {
      display: block;
      margin-bottom: 0.5rem;
      color: rgba(0,0,0,0.6);
    }

    .size-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .size-buttons button {
      flex: 1;
      min-width: 120px;
      padding: 0.5rem;
    }

    .size-buttons button.selected {
      background-color: #e3f2fd;
      color: #1976d2;
      border-color: #1976d2;
    }

    .terms {
      margin: 1.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }

    .terms a {
      color: #1976d2;
      text-decoration: none;
    }

    button[type="submit"] {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
      background-color: #1976d2;
    }

    @media (max-width: 768px) {
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
export class AppointmentDemoComponent {
  demoForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private demoRequestService: DemoRequestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.demoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      organizationName: ['', Validators.required],
      institutionSize: ['', Validators.required],
      hospitalType: ['', Validators.required]
    });
  }

  selectSize(size: string) {
    this.demoForm.patchValue({ institutionSize: size });
  }

  onSubmit() {
    if (this.demoForm.valid) {
      this.loading = true;
      const formData = {
        firstName: this.demoForm.value.firstName,
        lastName: this.demoForm.value.lastName,
        email: this.demoForm.value.email,
        phone: this.demoForm.value.phone,
        country: this.demoForm.value.country,
        address: this.demoForm.value.address,
        organizationName: this.demoForm.value.organizationName,
        healthInstitutionSize: this.demoForm.value.institutionSize,
        hospitalType: this.demoForm.value.hospitalType
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
    }
  }
} 