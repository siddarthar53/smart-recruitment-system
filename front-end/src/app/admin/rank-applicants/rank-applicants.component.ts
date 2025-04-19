import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from 'src/app/Services/job.service';
import { DataHandlingService } from 'src/app/Services/data-handling.service';
import { Job } from 'src/app/models/job.model';

@Component({
  selector: 'app-rank-applicants',
  templateUrl: './rank-applicants.component.html',
  styleUrls: ['./rank-applicants.component.css']
})
export class RankApplicantsComponent implements OnInit {
  jobTitles: string[] = [];
  selectedJob: string = '';
  selectedJobId: string = '';
  applicants: any[] = [];
  loading: boolean = false;
  showRankedApplicants: boolean = false;

  constructor(
    private router: Router,
    private jobService: JobService,
    private dataHandlingService: DataHandlingService
  ) {}

  ngOnInit(): void {
    this.fetchJobTitles();
  }

  fetchJobTitles() {
    this.dataHandlingService.getJobs().subscribe(
      response => {
        if (response) {
          this.jobTitles = response.map((job: Job) => job.jobTitle);
        }
      },
      error => {
        console.error('Error fetching job titles:', error);
      }
    );
  }

  onJobSelect(event: any) {
    this.selectedJob = event.target.value;
    this.showRankedApplicants = false;

    // Fetch job ID
    this.dataHandlingService.getJobs().subscribe(jobs => {
      const selected = jobs.find((job: any) => job.jobTitle === this.selectedJob);
      if (selected) {
        this.selectedJobId = selected._id;
      }
    });
  }

  rankApplicants() {
    if (!this.selectedJobId) {
      alert('Please select a valid job title.');
      return;
    }

    this.loading = true;
    this.showRankedApplicants = false;

    this.dataHandlingService.getRankedApplicants(this.selectedJobId).subscribe(
      (response: any[]) => {
        this.applicants = response.map(applicant => ({
          id: applicant._id,
          name: applicant.name,
          email: applicant.email,
          score: applicant.score,
          selected: false
        }));
        console.log("Ranked applicants:", this.applicants);
        this.loading = false;
        this.showRankedApplicants = true;
      },
      error => {
        console.error("Error ranking applicants:", error);
        this.loading = false;
      }
    );
  }

  onCheckboxChange(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.applicants[index].selected = inputElement.checked;
    }
  }

  shortlistApplicants() {
    const selectedApplicants = this.applicants.filter(app => app.selected);
    console.log("Selected applicants for shortlist:", selectedApplicants);

    if (selectedApplicants.length === 0) {
      alert("Please select at least one applicant to shortlist.");
      return;
    }

    const payload = {
      jobId: this.selectedJobId,
      applicantIds: selectedApplicants.map(app => app.id)
    };

    console.log("Payload being sent:", payload);


    this.dataHandlingService.shortlistApplicants(payload).subscribe(
      res => {
        alert("✅ Applicants shortlisted successfully!");
        this.router.navigate(['/admin/shortlist'], {
          queryParams: {
            jobTitle: this.selectedJob,
            applicants: JSON.stringify(selectedApplicants)
          }
        });
      },
      err => {
        console.error("❌ Error shortlisting applicants:", err);
        alert("Error occurred while shortlisting applicants.");
      }
    );
  }
}
