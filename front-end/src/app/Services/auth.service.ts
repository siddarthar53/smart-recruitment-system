import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';  // Update with your backend URL

  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user'); // Check if user data exists in localStorage
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || ''; // Return role (admin/user)
  }

  // Helper function to add Authorization headers
  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  signUp(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear session
  }


  // Fetch Admin Page (Protected Route)
  getAdminPage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`, { headers: this.getHeaders() });
  }
}
