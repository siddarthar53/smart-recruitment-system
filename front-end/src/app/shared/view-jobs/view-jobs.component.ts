import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlingService } from '../../admin/Services/data-handling.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Job } from 'src/app/models/job.model';

@Component({
  selector: 'app-view-jobs',
  templateUrl: './view-jobs.component.html',
  styleUrls: ['./view-jobs.component.css']
})
export class ViewJobsComponent implements OnInit {
  jobs: Job[] = [];
  userRole: string = ''; // ✅ Store role

  constructor(
    private dataHandling: DataHandlingService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole(); // ✅ Get user role
    this.loadJobs();
  }

  loadJobs(): void {
    this.dataHandling.getJobs().subscribe(
      (data) => {
        this.jobs = data.jobs; // ✅ Load job list correctly
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  navigateToJobDetails(jobId: string) {
    this.router.navigate(['/', this.userRole === 'admin' ? 'admin' : 'user', 'view-job', jobId]);
  }

  deleteJob(jobId: string, event: Event) {
    if (this.userRole !== 'admin') return; // ✅ Prevent Users from deleting

    event.stopPropagation();
    this.dataHandling.deleteJob(jobId).subscribe(
      () => {
        this.loadJobs(); // ✅ Reload jobs after deletion
      },
      (error) => {
        console.error('Error deleting job:', error);
      }
    );
  }
}
