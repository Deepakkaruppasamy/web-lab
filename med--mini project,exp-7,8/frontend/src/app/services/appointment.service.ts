import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  // Get all appointments for logged-in user
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  // Get single appointment
  getAppointment(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  // Create new appointment
  createAppointment(appointmentData: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointmentData);
  }

  // Update appointment
  updateAppointment(id: string, appointmentData: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointmentData);
  }

  // Cancel appointment
  cancelAppointment(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Delete appointment
  deleteAppointment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Add feedback
  addFeedback(id: string, feedback: { rating: number; review: string }): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/feedback`, feedback);
  }

  // Get doctor's available slots
  getDoctorSlots(doctorId: string, date: string): Observable<{ startTime: string }[]> {
    return this.http.get<{ startTime: string }[]>(`${this.apiUrl}/doctor/${doctorId}/slots`, {
      params: { date }
    });
  }
} 