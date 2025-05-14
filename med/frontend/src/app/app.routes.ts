import { Routes } from '@angular/router';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { AppointmentDemoComponent } from './components/appointment-demo/appointment-demo.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentComponent, canActivate: [authGuard] },
  { path: 'demo-request', component: AppointmentDemoComponent, canActivate: [authGuard] },
  { path: 'doctors', component: DoctorsListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
