import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="hero-section">
      <h1>Welcome to MedConsult Online</h1>
      <p class="subtitle">Professional Healthcare at Your Fingertips</p>
      <button mat-raised-button color="primary" (click)="goToAppointments()">
        Book Consultation
      </button>
    </div>

    <div class="services-section">
      <h2>Our Services</h2>
      <div class="services-grid">
        <mat-card>
          <mat-icon>medical_services</mat-icon>
          <h3>General Consultation</h3>
          <p>Comprehensive medical consultations with experienced doctors</p>
        </mat-card>
        <mat-card>
          <mat-icon>psychology</mat-icon>
          <h3>Specialist Care</h3>
          <p>Access to specialized medical experts</p>
        </mat-card>
        <mat-card>
          <mat-icon>medication</mat-icon>
          <h3>Prescription Services</h3>
          <p>Digital prescription and medication guidance</p>
        </mat-card>
        <mat-card>
          <mat-icon>emergency</mat-icon>
          <h3>Emergency Support</h3>
          <p>24/7 emergency medical consultation</p>
        </mat-card>
      </div>
    </div>

    <div class="testimonials-section">
      <h2>Patient Testimonials</h2>
      <div class="testimonials-grid">
        <mat-card>
          <p>"Excellent service! The online consultation was very thorough and professional."</p>
          <div class="author">- Sarah Thompson</div>
        </mat-card>
        <mat-card>
          <p>"Quick and convenient healthcare access. The doctors are very knowledgeable."</p>
          <div class="author">- John Martinez</div>
        </mat-card>
        <mat-card>
          <p>"Life-saving service during the pandemic. Highly recommended!"</p>
          <div class="author">- Michael Chen</div>
        </mat-card>
      </div>
    </div>

    <div class="contact-section">
      <h2>Contact Us</h2>
      <div class="contact-info">
        <div class="info-item">
          <mat-icon>location_on</mat-icon>
          <p>123 Medical Center Drive, Healthcare City</p>
        </div>
        <div class="info-item">
          <mat-icon>phone</mat-icon>
          <p>(555) 123-4567</p>
        </div>
        <div class="info-item">
          <mat-icon>email</mat-icon>
          <p>contact&#64;medconsult.com</p>
        </div>
      </div>
    </div>
  `,

styles: [`
    .hero-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      background: linear-gradient(45deg, #ff0000, #ff6b6b);
      color: white;
      text-align: center;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      font-weight: 300;
    }

    .services-section, .testimonials-section, .contact-section {
      padding: 5rem 2rem;
      text-align: center;
      background-color: #ffffff;
    }

    .services-section {
      background-color: #f8f9fa;
    }

    h2 {
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #ff0000;
      font-weight: 600;
      position: relative;
      display: inline-block;
    }

    h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background-color: #ff0000;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-card {
      padding: 2.5rem;
      transition: all 0.3s ease;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    mat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    mat-icon {
      font-size: 3.5rem;
      height: 3.5rem;
      width: 3.5rem;
      margin-bottom: 1.5rem;
      color: #ff0000;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .testimonials-section mat-card {
      background-color: #fff;
      padding: 2rem;
    }

    .author {
      margin-top: 1.5rem;
      font-style: italic;
      color: #ff0000;
      font-weight: 500;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 12px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      padding: 1rem;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .info-item mat-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
      margin: 0;
      color: #ff0000;
    }

    .info-item p {
      font-size: 1.1rem;
      color: #333;
      margin: 0;
    }

    button[mat-raised-button] {
      padding: 0.8rem 2.5rem;
      font-size: 1.2rem;
      background-color: white;
      color: #ff0000;
      border: 2px solid white;
      transition: all 0.3s ease;
    }

    button[mat-raised-button]:hover {
      background-color: transparent;
      color: white;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }
      .subtitle {
        font-size: 1.3rem;
      }
      .services-grid, .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      h2 {
        font-size: 2rem;
      }
      .contact-info {
        padding: 1rem;
      }
    }
`]
})
export class HomeComponent {
  constructor(private router: Router) {}
  goToAppointments() {
    this.router.navigate(['/appointments']);
  }
} 