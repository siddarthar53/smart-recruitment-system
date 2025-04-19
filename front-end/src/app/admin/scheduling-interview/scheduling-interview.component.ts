import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { Router } from '@angular/router';
import { DataHandlingService } from 'src/app/Services/data-handling.service';

@Component({
  selector: 'app-scheduling-interview',
  templateUrl: './scheduling-interview.component.html',
  styleUrls: ['./scheduling-interview.component.css']
})
export class SchedulingInterviewComponent implements OnInit {

  jobTitle: string = '';
  shortlistedApplicants: any[] = [];
  emailSubject: string = '';
  googleMeetLink: string = '';
  interviewDate: string = '';
  timeSlot: string = '';

  timeSlots: string[] = [
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  constructor(private route: ActivatedRoute,private router: Router,private dataHandlingService:DataHandlingService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.jobTitle = params['jobTitle'];
      this.shortlistedApplicants = JSON.parse(params['applicants']);
    });
  }

  sendInvites() {
    if (!this.emailSubject || !this.googleMeetLink || !this.timeSlot) {
      alert('Please fill in all the fields.');
      return;
    }
  
    if (!this.shortlistedApplicants || this.shortlistedApplicants.length === 0) {
      alert('No applicants to send emails to.');
      return;
    }
  
    let emailsSent = 0;
  
    this.shortlistedApplicants.forEach(applicant => {
      const templateParams = {
        email: applicant.email,
        applicant_name: applicant.name,
        job_position: this.jobTitle,
        company_name: 'XYZ Technologies',
        status: 'Shortlisted',
        hr: 'HR',
        subject: this.emailSubject,
        meet_link: this.googleMeetLink,
        time_slot: this.timeSlot,
        interview_date: this.interviewDate,
      };
  
      emailjs.send(
        'service_athrxm5',
        'template_0uzx4vt',
        templateParams,
        'JJqhyf8-QM5aOlne0'
      ).then((response: EmailJSResponseStatus) => {
        console.log(`Email sent successfully to ${applicant.name} (${applicant.email})`, response);
        emailsSent++;
  
        // After all emails are sent
        if (emailsSent === this.shortlistedApplicants.length) {          
          const interviewData = {
            jobTitle: this.jobTitle,  // assuming jobTitle is acting as jobId
            applicantIds: this.shortlistedApplicants.map(a => a.id), // or a.id, depending on your backend
            interviewDate: this.interviewDate,
            emailSubject: this.emailSubject,
            googleMeetLink: this.googleMeetLink,
            timeSlot: this.timeSlot
          };

          this.dataHandlingService.saveInterview(interviewData).subscribe({
            next: (response) => {
              console.log('Interview data saved successfully:', response);
              alert('Interview invitations have been sent!');

              // Clear the form fields
              this.emailSubject = '';
              this.googleMeetLink = '';
              this.timeSlot = '';
              this.interviewDate = '';

              // Redirect to admin dashboard
              this.router.navigate(['/admin/dashboard']);
            },
            error: (error) => {
              console.error('Error saving interview data:', error);
              alert('Error scheduling interview. Please try again.');
            }
          });
        }
  
      }).catch((error: any) => {
        console.error(`Failed to send email to ${applicant.name} (${applicant.email})`, error);
      });
    });
  }
  
  

}
