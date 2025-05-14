import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  // Get all doctors
  getDoctors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get doctor by ID
  getDoctor(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Get doctors by specialty
  getDoctorsBySpecialty(specialty: string): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {
      params: { specialty }
    });
  }

  // Get all specialties
  getSpecialties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/specialties`);
  }

  // Get doctor's availability
  getDoctorAvailability(doctorId: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${doctorId}/availability`, {
      params: { date }
    });
  }

  // Update doctor's availability (for doctor/admin)
  updateAvailability(doctorId: string, availability: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${doctorId}/availability`, { availability });
  }
} 