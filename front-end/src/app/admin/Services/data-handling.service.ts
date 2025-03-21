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

  getJobs(): Observable<{ jobs: Job[] }> {
    return this.httpClient.get<{ jobs: Job[] }>(`${this.apiURL}/viewJobs`);
  }

  deleteJob(id: string): Observable<Job> {
    return this.httpClient.delete<Job>(`${this.apiURL}/deleteJob/${id}`);
  }
}