import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Welcome to MedConsult</mat-card-title>
          <mat-card-subtitle>Access your healthcare portal</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" name="email" [(ngModel)]="email" required email>
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" 
                     name="password" [(ngModel)]="password" required>
              <mat-icon matSuffix (click)="hidePassword = !hidePassword">
                {{hidePassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
            </mat-form-field>

            <div class="forgot-password">
              <a href="javascript:void(0)">Forgot Password?</a>
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="!loginForm.form.valid" class="submit-button">
              <mat-icon>login</mat-icon>
              <span>Login</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="goToRegister()" class="register-link">
            New to MedConsult? Create an account
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 20px;
    }

    .login-card {
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

    .forgot-password {
      text-align: right;
      margin-bottom: 20px;
      a {
        color: #ff0000;
        text-decoration: none;
        font-size: 14px;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .submit-button {
      margin: 20px 0;
      padding: 8px;
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

    .register-link {
      color: #ff0000;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .register-link:hover {
      color: #cc0000;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: rgba(0, 0, 0, 0.12);
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick {
      color: #ff0000;
    }

    mat-icon {
      cursor: pointer;
    }

    @media (max-width: 480px) {
      .login-card {
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
export class LoginComponent {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    console.log('Attempting login with:', { email: this.email });
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed details:', error);
        
        let errorMessage = 'Login failed. ';
        if (error.error?.message) {
          errorMessage += error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please try again later.';
        } else if (error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else {
          errorMessage += 'Please check your credentials.';
        }
        
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}