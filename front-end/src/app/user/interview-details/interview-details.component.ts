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
  
      console.log('Interview Details:', this.interview);
  
      this.updateProgressBar();
      this.generateGoogleCalendarLink();
      this.calculateCountdown();
  
      // Refresh countdown & progress every second
      setInterval(() => {
        this.calculateCountdown();
        this.updateProgressBar();
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

  /** Update Progress Bar Based on Time Until Interview */
updateProgressBar() {
  const interviewStart = new Date(`${this.interview.date} ${this.interview.timeSlot.split(' - ')[0]}`).getTime();
  const interviewEnd = new Date(`${this.interview.date} ${this.interview.timeSlot.split(' - ')[1]}`).getTime();
  const now = new Date().getTime();

  const totalDuration = interviewStart - now > 0 ? interviewStart - now : 1; // Avoid division by 0
  const fullSpan = interviewStart - (new Date().setHours(0, 0, 0, 0)); // Midnight to interview start
  const elapsed = fullSpan - totalDuration;

  const progress = Math.min(100, Math.max(0, (elapsed / fullSpan) * 100));
  this.progressWidth = `${progress.toFixed(2)}%`;

  if (progress < 50) {
    this.progressClass = 'bg-warning';
  } else if (progress < 90) {
    this.progressClass = 'bg-info';
  } else {
    this.progressClass = 'bg-success';
  }

  console.log('Progress Width:', this.progressWidth, 'Class:', this.progressClass);
}

}
