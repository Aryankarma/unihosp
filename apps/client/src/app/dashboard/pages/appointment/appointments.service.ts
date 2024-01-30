import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from '../../../services/profile.service';
import { Appointments } from '@prisma/client';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments$ = new BehaviorSubject<Appointments[]>([]);

  constructor(
    private profileService: ProfileService,
    private http: HttpClient
  ) {}

  get appointments() {
    return this.appointments$;
  }

  requestAppointments() {
    this.profileService.current.subscribe((profile) => {
      if (profile && profile.Appointments) {
        this.appointments$.next(profile.Appointments);
      }
    });
  }
}
