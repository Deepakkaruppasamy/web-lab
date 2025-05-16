import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorBookingModalComponent } from './doctor-booking-modal.component';

describe('DoctorBookingModalComponent', () => {
  let component: DoctorBookingModalComponent;
  let fixture: ComponentFixture<DoctorBookingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorBookingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorBookingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
