import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { DoctorBookingModalComponent } from '../doctor-booking-modal/doctor-booking-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss']
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = false;
  error: string | null = null;

  // Mock data for demonstration
  mockDoctors: Doctor[] = [
    {
      _id: '1',
      name: 'Dr. Lawrence Espinoza',
      specialty: 'Heart',
      experience: 10,
      phone: '145234562',
      email: 'lawrence@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 100,
        teleconsultation: 80
      }
    },
    {
      _id: '2',
      name: 'Dr. Lynda Pearson',
      specialty: 'Eye',
      experience: 7,
      phone: '123123123',
      email: 'lynda@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 80,
        teleconsultation: 60
      }
    },
    {
      _id: '3',
      name: 'Dr. John Powers',
      specialty: 'Orthopedics',
      experience: 5,
      phone: '1234567890',
      email: 'john@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 120,
        teleconsultation: 90
      }
    },
    {
      _id: '4',
      name: 'Dr. Vishal Kumar',
      specialty: 'Heart',
      experience: 5,
      phone: '',
      email: 'vishal@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 10,
        teleconsultation: 8
      }
    },
    {
      _id: '5',
      name: 'Dr. ARUN PRANESHS',
      specialty: 'MBBS',
      experience: 10,
      phone: '9488113232',
      email: 'arun@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 700,
        teleconsultation: 550
      }
    },
    {
      _id: '6',
      name: 'Dr. Tejas Tejas',
      specialty: 'Tejas',
      experience: 10,
      phone: '',
      email: 'tejas@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 100,
        teleconsultation: 80
      }
    },
    {
      _id: '7',
      name: 'Dr. Abdul aagariya',
      specialty: 'MBBS',
      experience: 5,
      phone: '8758438254',
      email: 'abdul@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 50,
        teleconsultation: 40
      }
    },
    {
      _id: '8',
      name: 'Dr. Tosib Aagariya',
      specialty: 'MBBS,MD',
      experience: 7,
      phone: '',
      email: 'tosib@example.com',
      profileImage: 'assets/images/default-doctor.png',
      consultationFees: {
        inPerson: 55,
        teleconsultation: 45
      }
    },
    {
      _id: '9',
      name: 'Dr. Nasir sherasiya',
      specialty: 'MBBS,MD',
      experience: 8,
      phone: '',
      email: 'nasir@example.com',
      profileImage: '/assets/images/doctor9.png',
      consultationFees: {
        inPerson: 89,
        teleconsultation: 70
      }
    }
  ];

  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    
    // For demo purposes, use mock data instead of API
    setTimeout(() => {
      this.doctors = this.mockDoctors;
      this.loading = false;
    }, 500);
    
    // In production, use this:
    /*
    this.doctorService.getDoctors().subscribe({
      next: (response) => {
        this.doctors = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load doctors. Please try again.';
        this.loading = false;
        console.error('Error loading doctors:', error);
      }
    });
    */
  }

  bookAppointment(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorBookingModalComponent, {
      width: '500px',
      data: { doctor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Appointment booked successfully!', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
