import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { BloodGroupType } from '../interfaces';
import { UserProfileResponse } from '@unihosp/api-interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  private currentProfile = new BehaviorSubject<UserProfileResponse | null>(
    null
  );

  get current() {
    return this.currentProfile.pipe(
      map((patient) => {
        if (patient !== null) return patient;
        let p: UserProfileResponse;
        const sub = this.http
          .get<UserProfileResponse>('/patient/user')
          .subscribe((patient) => {
            p = patient;
            this.profile = patient;
            sub.unsubscribe();
          });
        return p!;
      })
    );
  }

  set profile(profile: UserProfileResponse) {
    this.currentProfile.next(profile);
  }

  checkHandle(handle: string) {
    return this.http.post<{ handle: boolean }>(`/patient/exists`, {
      handle,
    });
  }

  updateAvatar(formData: FormData) {
    return this.http.post('/avatars', formData);
  }

  createPatientProfile({
    fName,
    lName,
    dateOfBirth,
    handle,
    bloodGroup,
  }: {
    fName: string;
    lName: string;
    dateOfBirth: string | Date;
    handle?: string;
    bloodGroup: BloodGroupType;
  }) {
    const patient = this.http
      .post<UserProfileResponse>(`/patient`, {
        fName,
        lName,
        dateOfBirth,
        handle,
        bloodGroup,
      })
      .pipe(
        map((patient) => {
          this.currentProfile.next(patient);
        })
      );
    return patient;
  }
}
