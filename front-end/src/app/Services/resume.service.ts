import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resume } from '../models/resume.model';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'http://localhost:3000/api/candidate';

  constructor(private http: HttpClient) {}

  uploadResume(resumeTitle: string, resumeFile: File, userId: string): Observable<Resume> {
    const formData = new FormData();
    formData.append("resumeTitle", resumeTitle);
    formData.append("userId", userId); // ✅ Now uses stored user ID
    formData.append("resumeFile", resumeFile);

    return this.http.post<Resume>(`${this.apiUrl}/save-resume`, formData);
  }

  getSavedResumes(userId: string): Observable<Resume[]> {
    return this.http.get<Resume[]>(`${this.apiUrl}/get-resumes/${userId}`);
  }

  deleteResume(resumeId: string): Observable<Resume> {
    return this.http.delete<Resume>(`${this.apiUrl}/delete-resume/${resumeId}`);
  }

  applyForJob(jobId: string, applicationData: any) {
    return this.http.post(`${this.apiUrl}/apply-job/${jobId}`, applicationData);
  }

  getApplicationsByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/track-applicants/${userId}`);
  }

}
