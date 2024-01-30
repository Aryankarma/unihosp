import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoctorDetails, HospitalDetials } from '../interfaces/publicProfile.interface';

@Injectable({
  providedIn: 'root'
})
export class PublicProfileService {

  constructor(private http: HttpClient) { }

  getHospitalById(id: string) {
    return this.http.get<HospitalDetials>(`/e/h/${id}`);
  }


  getPatientById(id: string) {
    return this.http.get(`/e/p/${id}`);
  }

  getDoctorById(id: string) {
    return this.http.get<DoctorDetails>(`/e/d/${id}`);
  }
}
