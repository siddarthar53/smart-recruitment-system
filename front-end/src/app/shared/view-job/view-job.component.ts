import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataHandlingService } from '../../admin/Services/data-handling.service';
import { Job } from 'src/app/models/job.model';
import { AuthService } from '../../Services/auth.service';
@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  job: Job | null = null; // Initialize as null
  userRole: string = '';
  userResumes: string[] = ['Resume 1', 'Resume 2', 'Resume 3']; // Mocked resume list
  selectedResume: string = '';
  constructor(private dataHandling: DataHandlingService, private route: ActivatedRoute,
    private authService: AuthService
  ) {this.userRole = this.authService.getUserRole();}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id'); // Get job ID safely
      if (jobId) {
        this.dataHandling.getJob(jobId).subscribe(
          (data) => {
            this.job = data; // Assign job object properly
            console.log(this.job);
          },
          (error) => {
            console.error("Error fetching job details:", error);
          }
        );
      }
    });
  }

  applyForJob() {
    if (!this.selectedResume) {
      alert("Please select a resume before applying!");
      return;
    }

    alert(`You have successfully applied for ${this.job?.jobTitle} using ${this.selectedResume}`);
  }
}
