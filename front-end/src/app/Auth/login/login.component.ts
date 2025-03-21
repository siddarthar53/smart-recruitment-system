import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.redirectIfLoggedIn();
  }

  ngOnInit(): void {}

  getValue(): boolean {
    return !(this.email && this.password);
  }

  redirectIfLoggedIn() {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      this.router.navigate([role === 'admin' ? '/admin/dashboard' : '/user/dashboard']);
    }
  }

  onLogin() {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('user',JSON.stringify(response.user));
        localStorage.setItem('token', response.token);  // Store JWT if applicable
        alert('Login successful');
        this.router.navigate([`/${response.user.role}`]);  // Navigate to dashboard or home page
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Invalid credentials');
      }
    );
  }
}
