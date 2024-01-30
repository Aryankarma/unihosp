import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AppointmentService } from '../appointment/appointments.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { Patient } from '@prisma/client';

@Component({
  selector: 'uni-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss', '../../common.style.scss'],
  standalone: true,
  imports: [CommonModule, LoadingComponent],
})
export class HomeComponent implements OnInit {
  dt = new Date();

  userService$ = this.userService.currentUser;

  lastTwoAppointments$ = this.appointmentService.appointments.pipe(
    catchError(() => {
      // console.log(err);
      return of([]);
    })
  );

  paitentProfile$!: Observable<Patient>;

  constructor(
    private profileService: ProfileService,
    private appointmentService: AppointmentService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.paitentProfile$ = this.profileService.current;
      this.appointmentService.requestAppointments();
    }
  }
}
