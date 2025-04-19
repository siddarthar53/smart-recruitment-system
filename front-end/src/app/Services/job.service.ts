import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Job {
  title: string;
  location: string;
  jobType: string;
  salary: string;
  eligibility: string;
  skillsRequired: string;
  jobDescription: string;
  jobFile: File;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiURL = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  addJob(job: Job): Observable<any> {
    const formData = new FormData();
    formData.append('jobTitle', job.title);
    formData.append('location', job.location);
    formData.append('jobType', job.jobType);
    formData.append('salary', job.salary);
    formData.append('eligibility', job.eligibility);
    formData.append('skillsRequired', job.skillsRequired);
    formData.append('jobDescription', job.jobDescription);
    // Ensure jobFile is correctly set
    if (job.jobFile) {
      formData.append("jobFile", job.jobFile, job.jobFile.name);
    }
    return this.http.post(`${this.apiURL}/addJob`, formData);
  }

  // getJobTitles(): Observable<any> {
  //   return this.http.get<any>(`${this.apiURL}/viewJobs`);
  // }
}
