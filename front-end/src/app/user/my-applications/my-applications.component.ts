import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from 'src/app/Services/resume.service';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {

  // jobApplications = [
  //   { jobTitle: 'Software Engineer', resumeTitle: 'John_Resume.pdf', status: 'Under Review' },
  //   { jobTitle: 'Data Scientist', resumeTitle: 'John_DataResume.pdf', status: 'Rejected' },
  //   { jobTitle: 'Product Manager', resumeTitle: 'John_PMResume.pdf', status: 'Shortlisted', interview: {
  //       date: 'March 25, 2025',
  //       timeSlot: '3:00 PM - 4:00 PM',
  //       meetLink: 'https://meet.google.com/xyz-123'
  //     }
  //   }
  // ];

  jobApplications: any[] = [];

  constructor(private router: Router,private resumeService:ResumeService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user._id) {
      this.resumeService.getApplicationsByUserId(user._id).subscribe({
        next: (applications) => {
          this.jobApplications = applications;
        },
        error: (error) => {
          console.error('Failed to load applications:', error);
        }
      });
    }
  }

  getStatusClass(status: string) {
    return {
      'text-under-review': status === 'under review',
      'text-rejected': status === 'rejected',
      'text-shortlisted': status === 'shortlisted'
    };
  }

  viewInterviewDetails(application: any) {
    this.router.navigate(['/interview-details'], {
      queryParams: {
        interview: JSON.stringify({
          jobTitle: application.jobTitle,
          // salary: application.salary,
          date: application.interview.interview_date,
          timeSlot: application.interview.time_slot,
          meetLink: application.interview.meet_link,
          // bannerImage: application.bannerImage,
          status: application.status
        })
      }
    });
  }
  
}
