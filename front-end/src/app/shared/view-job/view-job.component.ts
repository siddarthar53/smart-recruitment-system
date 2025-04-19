import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataHandlingService } from '../../Services/data-handling.service';
import { Job } from 'src/app/models/job.model';
import { AuthService } from '../../Services/auth.service';
import { ResumeService } from 'src/app/Services/resume.service';
@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  job: Job | null = null; // Initialize as null
  userRole: string = '';
  userResumes: { resumeId: string,resumeTitle: string,s3BucketData:any}[] = [];
  userId: string = '';
  selectedResume: any = '';
  postedAgo: string = ''; // Add this property to your component

  constructor(private dataHandling: DataHandlingService, private route: ActivatedRoute,
    private authService: AuthService,private resumeService: ResumeService
  ) {this.userRole = this.authService.getUserRole();}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log("Parsed User Object:", user);
        this.userId = user._id;

        this.loadSavedResumes();
      } catch (error) {
        console.error("❌ JSON Parsing Error:", error);
      }
    } else {
      console.error("❌ User not found in local storage.");
    }
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id'); // Get job ID safely
      if (jobId) {
        this.dataHandling.getJob(jobId).subscribe(
          (data) => {
            this.job = data; // Assign job object properly
            this.postedAgo = this.calculateTimeAgo(this.job.createdAt);
            console.log(this.job);
          },
          (error) => {
            console.error("Error fetching job details:", error);
          }
        );
      }
    });
  }

  loadSavedResumes() {
    this.resumeService.getSavedResumes(this.userId).subscribe(
      (resumes: any[]) => {
        this.userResumes = resumes.map(resume => ({
          resumeId: resume._id, // Ensure backend sends this property
          resumeTitle: resume.resumeTitle, // Ensure backend sends this property
          s3BucketData: resume.s3Bucket // Ensure backend sends this property
        }));
        console.log("Fetched Resumes:", this.userResumes);
      },
      (error) => {
        console.error("Error fetching resumes:", error);
      }
    );
  }
  
  calculateTimeAgo(dateString: string): string {
    const now = new Date();
    const postedDate = new Date(dateString);
    const seconds = Math.floor((now.getTime() - postedDate.getTime()) / 1000);
  
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);
    const weeks = Math.floor(seconds / 604800);
  
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  applyForJob() {
    if (!this.selectedResume) {
      alert("Please select a resume before applying!");
      return;
    }
    // Find the selected resume object properly
    const selectedResumeDetails = this.userResumes.find(resume => resume.resumeId === this.selectedResume);
  
    if (!selectedResumeDetails) {
      console.error("❌ Selected resume details not found! Possible mismatched ID type.");
      return;
    }
    
    // Prepare application data
    const applicationData = {
      userId: this.userId,
      resumeId: selectedResumeDetails.resumeId
    };

    // Send POST request to backend
  const jobId = this.job?._id ?? '';
  if (!jobId) {
    console.error("❌ Job ID is undefined or invalid.");
    alert("Unable to apply for the job. Job ID is missing.");
    return; 
  }
  this.resumeService.applyForJob(jobId, applicationData).subscribe(
    (response) => {
      console.log("✅ Application Successful:", response);
      alert(`You have successfully applied for ${this.job?.jobTitle} using ${selectedResumeDetails.resumeTitle}`);
    },
    (error) => {
      console.error("❌ Application Failed:", error);
      alert("Something went wrong while applying. Please try again later.");
    }
  );
    // Log job application details
    console.log("✅ Job Application Details:");
    console.log("🆔 Job ID:", this.job?._id);
    console.log("👤 User ID:", this.userId);
    console.log("📄 Resume ID:", selectedResumeDetails.resumeId);
    console.log("📌 Resume Title:", selectedResumeDetails.resumeTitle);
    console.log("📦 S3 Bucket Data:", selectedResumeDetails.s3BucketData);
  
    alert(`You have successfully applied for ${this.job?.jobTitle} using ${selectedResumeDetails.resumeTitle}`);
  }
}
