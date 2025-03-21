import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  features = [
    {
      title: 'Job Description',
      items: [
        { name: 'View Job Descriptions', route: 'admin/view-jobs' },
        { name: 'Add Job Description', route: 'admin/add-job' }
      ]
    },
    {
      title: 'Resume Ranking',
      items:[
        { name: 'View no of applicants.', route: '/admin/view-applicants' },
        { name: 'Rank the candidates.', route: 'admin/rank-applicants' },
        { name: 'Shortlist and schedule interviews.', route: 'admin/schedule-interview' }
      ]
    },
    {
      title: 'Analysis',
      items: [ { name: 'View the Analytics.', route: 'admin/analytics' }]
    }
  ];

   // Initially, show sun icon

  
  constructor(private authService:AuthService,private router: Router) { }

  ngOnInit(): void {
    

  }


  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  
  
}
