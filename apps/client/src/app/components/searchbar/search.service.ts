import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

type ISearchPatientResult = {
  type: 'Patient';
  name: string;
  handle: string;
};

type ISearchHospitalResult = {
  type: 'Hospital';
  name: string;
  handle: string;
  location: string;
};
type ISearchDoctorResult = {
  type: 'Doctor';
  name: string;
  handle: string;
};

type SearchResult =
  | ISearchPatientResult
  | ISearchHospitalResult
  | ISearchDoctorResult;

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  queryResult(query: string) {
    return this.http.get<SearchResult[]>(`/search?query=${query}`);
  }
}
