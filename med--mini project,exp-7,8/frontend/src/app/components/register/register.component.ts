import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Your MedConsult Account</mat-card-title>
          <mat-card-subtitle>Join our healthcare community</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput name="name" [(ngModel)]="name" required minlength="2">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.form.get('name')?.errors?.['required']">
                Name is required
              </mat-error>
              <mat-error *ngIf="registerForm.form.get('name')?.errors?.['minlength']">
                Name must be at least 2 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" name="email" [(ngModel)]="email" required email>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.form.get('email')?.errors?.['required']">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.form.get('email')?.errors?.['email']">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" 
                     name="password" [(ngModel)]="password" required minlength="6">
              <mat-icon matSuffix (click)="hidePassword = !hidePassword">
                {{hidePassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
              <mat-hint>Minimum 6 characters</mat-hint>
              <mat-error *ngIf="registerForm.form.get('password')?.errors?.['required']">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.form.get('password')?.errors?.['minlength']">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="!registerForm.form.valid || isLoading" 
                    class="submit-button">
              <mat-icon>how_to_reg</mat-icon>
              <span>{{ isLoading ? 'Registering...' : 'Register' }}</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="goToLogin()" class="login-link">
            Already have an account? Login here
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 20px;
    }
    
    .register-card {
      width: 100%;
      max-width: 450px;
      border-radius: 15px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      background-color: white;
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    mat-card-header {
      background-color: #ff0000;
      color: white;
      padding: 24px 24px 16px;
      border-radius: 15px 15px 0 0;
      margin: -16px -16px 16px !important;
    }
    
    mat-card-title {
      font-size: 24px !important;
      font-weight: 500;
      margin-bottom: 8px !important;
    }
    
    mat-card-subtitle {
      color: rgba(255, 255, 255, 0.9) !important;
      font-size: 16px;
    }
    
    mat-card-content {
      padding: 24px 24px 0;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    form {
      display: flex;
      flex-direction: column;
    }
    
    .submit-button {
      margin: 20px 0;
      padding: 12px;
      font-size: 16px;
      background-color: #ff0000;
      color: white;
      border-radius: 25px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .submit-button:hover:not([disabled]) {
      background-color: #cc0000;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .submit-button[disabled] {
      background-color: rgba(0, 0, 0, 0.12);
    }
    
    mat-card-actions {
      padding: 16px 24px 24px;
      display: flex;
      justify-content: center;
    }
    
    .login-link {
      color: #ff0000;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .login-link:hover {
      color: #cc0000;
    }
    
    mat-icon {
      cursor: pointer;
    }
    
    @media (max-width: 480px) {
      .register-card {
        max-width: 100%;
      }
    
      mat-card-title {
        font-size: 20px !important;
      }
    
      mat-card-subtitle {
        font-size: 14px;
      }
    
      .submit-button {
        font-size: 14px;
      }
    }
  `]
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    console.log('Submitting registration form with:', { name: this.name, email: this.email });
    
    this.authService.register(this.email, this.password, this.name).subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        this.isLoading = false;
        this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (error) => {
        console.error('Registration error details:', error);
        this.isLoading = false;
        let errorMessage = 'Registration failed. ';
        
        if (error.error?.message) {
          errorMessage += error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please try again later.';
        } else if (error.status === 400) {
          errorMessage += 'Email may already be registered.';
        } else {
          errorMessage += 'Please try again.';
        }
        
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}