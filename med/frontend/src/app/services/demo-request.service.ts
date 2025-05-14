import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemoRequestService {
  private apiUrl = `${environment.apiUrl}/demo-requests`;

  constructor(private http: HttpClient) {}

  createDemoRequest(demoRequest: any): Observable<any> {
    return this.http.post(this.apiUrl, demoRequest);
  }

  getDemoRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
} 