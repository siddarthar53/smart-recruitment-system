import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlingService } from '../../Services/data-handling.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Job } from 'src/app/models/job.model';

@Component({
  selector: 'app-view-jobs',
  templateUrl: './view-jobs.component.html',
  styleUrls: ['./view-jobs.component.css']
})
export class ViewJobsComponent implements OnInit {
  jobs: Job[] = [];
  searchText: string = '';
  userRole: string = ''; // ✅ Store role
  sortDirection: 'asc' | 'desc' = 'asc'; // toggle sort direction
  sortField: keyof Job = 'jobTitle'; // default sort field


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
      (response) => {
        this.jobs = response; // ✅ Load job list correctly
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  get filteredJobs(): Job[] {
    if (!this.jobs) return [];
  
    let filtered = this.jobs;
  
    // Filter
    if (this.searchText.trim()) {
      const lowerSearch = this.searchText.toLowerCase();
      filtered = filtered.filter(job =>
        job.jobTitle.toLowerCase().includes(lowerSearch) ||
        job.location.toLowerCase().includes(lowerSearch) ||
        job.salary.toString().includes(lowerSearch)
      );
    }
  
    // Sort
    return filtered.sort((a, b) => {
      const aValue = a[this.sortField]?.toString().toLowerCase();
      const bValue = b[this.sortField]?.toString().toLowerCase();
  
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  toggleSort(field: keyof Job) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
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
