import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentTime=new Date()
  userRole: string = '';
  isSun = true;

  constructor(private authService: AuthService, private router: Router) {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

  }

  ngOnInit(): void {
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
    });
  }

  
  showHeader(): boolean {
    return this.authService.isAuthenticated() && 
           !this.router.url.includes('login') && 
           !this.router.url.includes('sign-up');
  }

  toggleIcon() {
    this.isSun = !this.isSun; // Toggle between sun and moon
    // const newColor = this.isSun ? '#111' : '#ccc'; // dark ↔ light
    // const divBgColor = this.isSun ? '#f0f0f0' : '#333'; 
    // document.documentElement.style.setProperty('--label-color', newColor); // dark
    // document.documentElement.style.setProperty('--div-bg', divBgColor);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
