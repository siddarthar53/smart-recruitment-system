import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  constructor(private http: HttpClient,private router: Router) {}
  ngOnInit(): void {
  }

  /** Handles navigation to different modules */
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
