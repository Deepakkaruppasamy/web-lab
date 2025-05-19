import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentSimpleBookingComponent } from './components/appointment-simple-booking/appointment-simple-booking.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/appointments', pathMatch: 'full' },
  { 
    path: 'appointments', 
    component: AppointmentListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'appointments/book', 
    component: AppointmentSimpleBookingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 