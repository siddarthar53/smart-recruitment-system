import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from 'src/app/models/job.model';
@Injectable({
  providedIn: 'root'
})
export class DataHandlingService {
  constructor(private httpClient:HttpClient) { }

  private apiURL = 'http://localhost:3000/api/admin';

  getJob(id:string):Observable<Job> {
    return this.httpClient.get<Job>(`${this.apiURL}/viewJob/${id}`);
  }

  getJobs(): Observable<Job[]> {
    return this.httpClient.get<Job[]>(`${this.apiURL}/viewJobs`);
  }

  deleteJob(id: string): Observable<Job> {
    return this.httpClient.delete<Job>(`${this.apiURL}/deleteJob/${id}`);
  }

  getRankedApplicants(jobId: string) {
    return this.httpClient.post<any>(`${this.apiURL}/get-applicants/${jobId}`, {});
  }

  // data-handling.service.ts
  shortlistApplicants(payload: { jobId: string, applicantIds: string[] }) {
    return this.httpClient.post<any>(`${this.apiURL}/shortlist`, payload);
  }

  saveInterview(data: any) {
    return this.httpClient.post(`${this.apiURL}/save-interview`, data);
  }

  
}