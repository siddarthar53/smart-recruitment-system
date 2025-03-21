import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userRole: string = '';
  isSun = true;

  constructor(private authService: AuthService, private router: Router) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit(): void {
      
  }
  showHeader(): boolean {
    return this.authService.isAuthenticated() && 
           !this.router.url.includes('login') && 
           !this.router.url.includes('sign-up');
  }

  toggleIcon() {
    this.isSun = !this.isSun; // Toggle between sun and moon
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
