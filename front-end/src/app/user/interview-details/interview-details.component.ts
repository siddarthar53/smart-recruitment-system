import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css']
})
export class InterviewDetailsComponent implements OnInit {
  interview: any = {};
  jobBanner: string = '../../assets/Full-Stack-banner.jpg'; // Default image
  timeRemaining: string = '';
  googleCalendarLink: string = '';
  progressWidth: string = '0%';
  progressClass: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.interview = JSON.parse(params['interview']);
      
      if (this.interview.bannerImage) {
        this.jobBanner = this.interview.bannerImage;
      }

      this.updateProgressBar();
      this.generateGoogleCalendarLink();
      this.calculateCountdown();
      
      setInterval(() => {
        this.calculateCountdown();
      }, 1000);
    });
  }

  /** Calculate Time Remaining Until Interview */
  calculateCountdown() {
    const interviewDateTime = new Date(`${this.interview.date} ${this.interview.timeSlot.split(' - ')[0]}`);
    const now = new Date();
    const diff = interviewDateTime.getTime() - now.getTime();

    if (diff <= 0) {
      this.timeRemaining = 'Interview has started!';
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      this.timeRemaining = `${hours}h ${minutes}m ${seconds}s remaining`;
    }
  }

  /** Generate Google Calendar Link */
  generateGoogleCalendarLink() {
    const title = encodeURIComponent(`Interview for ${this.interview.jobTitle}`);
    const details = encodeURIComponent(`Interview scheduled at ${this.interview.timeSlot}. Join here: ${this.interview.meetLink}`);
    const startDateTime = new Date(`${this.interview.date} ${this.interview.timeSlot.split(' - ')[0]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDateTime = new Date(`${this.interview.date} ${this.interview.timeSlot.split(' - ')[1]}`).toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    this.googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startDateTime}/${endDateTime}`;
  }

  /** Update Progress Bar Based on Status */
  updateProgressBar() {
    switch (this.interview.status) {
      case 'Under Review':
        this.progressWidth = '30%';
        this.progressClass = 'bg-warning';
        break;
      case 'Shortlisted':
        this.progressWidth = '70%';
        this.progressClass = 'bg-info';
        break;
      case 'Interview Scheduled':
        this.progressWidth = '100%';
        this.progressClass = 'bg-success';
        break;
      default:
        this.progressWidth = '0%';
        this.progressClass = 'bg-secondary';
    }
  }
}
