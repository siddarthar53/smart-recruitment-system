import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {

  jobApplications = [
    { jobTitle: 'Software Engineer', resumeTitle: 'John_Resume.pdf', status: 'Under Review' },
    { jobTitle: 'Data Scientist', resumeTitle: 'John_DataResume.pdf', status: 'Rejected' },
    { jobTitle: 'Product Manager', resumeTitle: 'John_PMResume.pdf', status: 'Shortlisted', interview: {
        date: 'March 25, 2025',
        timeSlot: '3:00 PM - 4:00 PM',
        meetLink: 'https://meet.google.com/xyz-123'
      }
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  getStatusClass(status: string) {
    return {
      'text-under-review': status === 'Under Review',
      'text-rejected': status === 'Rejected',
      'text-shortlisted': status === 'Shortlisted'
    };
  }

  viewInterviewDetails(application: any) {
    this.router.navigate(['/interview-details'], {
      queryParams: {
        interview: JSON.stringify({
          jobTitle: application.jobTitle,
          salary: application.salary,
          date: application.interview.date,
          timeSlot: application.interview.timeSlot,
          meetLink: application.interview.meetLink,
          bannerImage: application.bannerImage,
          status: application.status
        })
      }
    });
  }
  
}
