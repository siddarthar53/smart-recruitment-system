import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js'; // 👈 this is important

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  // // Bar Chart (Overview)
  // public barChartOptions = {
  //   responsive: true
  // };

  // public barChartLabels: string[] = ['Jobs', 'Applicants', 'Resumes'];
  // public barChartType: ChartType = 'bar';  // 👈 typed as ChartType
  // public barChartLegend = true;

  // public barChartData = [
  //   { data: [20, 45, 30], label: 'Overview' }
  // ];

  // // Pie Chart (Interview Schedule)
  // public pieChartLabels: string[] = ['April 10', 'April 11', 'April 12', 'April 13'];
  // public pieChartData: number[] = [4, 7, 3, 6];
  // public pieChartType: ChartType = 'pie'; // 👈 typed as ChartType

  applicantsData: any[] = [];

  // applicantsData: any[] = [
  //   {
  //     jobTitle: 'Frontend Developer',
  //     statusCounts: {
  //       shortlisted: ['Alice', 'Bob', 'Charlie'],
  //       underReview: ['David', 'Eve'],
  //       rejected: ['Frank']
  //     }
  //   },
  //   {
  //     jobTitle: 'Backend Developer',
  //     statusCounts: {
  //       shortlisted: ['Grace', 'Heidi'],
  //       underReview: ['Ivan'],
  //       rejected: ['Judy', 'Mallory']
  //     }
  //   }
  // ];

  // interviews: any[] = [];

  interviews: any[] = [
    {
      jobTitle: 'Fullstack Developer',
      candidate: 'Siddarth',
      date: new Date('2025-04-10T10:30:00'),
      location: 'Google Meet'
    },
    {
      jobTitle: 'Backend Developer',
      candidate: 'Jemima',
      date: new Date('2025-04-11T14:00:00'),
      location: 'Google Meet'
    }
  ];

  pieChartLabels: string[] = ['Shortlisted', 'Under Review', 'Rejected'];
  pieChartType: ChartType = 'pie';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchApplicantStats();
    // this.fetchInterviews();
  }

  fetchApplicantStats(): void {
    this.http.get<any[]>('http://localhost:3000/api/admin/applicants-status')
      .subscribe((res) => {
        this.applicantsData = res;
      });
  }

  // fetchInterviews(): void {
  //   this.http.get<any[]>('http://localhost:5000/api/admin/all-interviews')
  //     .subscribe((res) => {
  //       this.interviews = res;
  //     });
  // }

  getPieChartData(job: any): number[] {
    return [
      job.statusCounts?.shortlisted?.length || 0,
      job.statusCounts?.underReview?.length || 0,
      job.statusCounts?.rejected?.length || 0
    ];
  }
  
  getPieChartColors(): any[] {
    return [
      {
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }
    ];
  }
  
  


}
