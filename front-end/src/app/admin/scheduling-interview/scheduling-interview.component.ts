import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  timeSlot: string = '';

  timeSlots: string[] = [
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  constructor(private route: ActivatedRoute) {}

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

    console.log('Sending interview invites...');
    console.log('Job Title:', this.jobTitle);
    console.log('Google Meet Link:', this.googleMeetLink);
    console.log('Time Slot:', this.timeSlot);
    console.log('Applicants:', this.shortlistedApplicants);
  }

}
