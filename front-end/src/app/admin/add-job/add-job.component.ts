import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { JobService } from '../../Services/job.service';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  
  title = '';
  location = '';
  jobType = 'Full Time';
  salary = '';
  eligibility = '';
  skillsRequired = '';
  noOfOpenings: number = 1;  // Default to 1
  jobDescription = '';
  jobFile: File | null = null;

  @ViewChild('fileUploader') fileUploader!: ElementRef;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    this.jobFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.jobFile) {
      alert('Please upload a job file');
      return;
    }

    const newJob = {
      title: this.title,
      location: this.location,
      jobType: this.jobType,
      salary: this.salary,
      eligibility: this.eligibility,
      skillsRequired: this.skillsRequired,
      jobDescription: this.jobDescription,
      noOfOpenings: this.noOfOpenings,  // ✅ Now included
      jobFile: this.jobFile
    };

    this.jobService.addJob(newJob).subscribe(
      response => {
        console.log('✅ Job added successfully', response);
        alert('Job added successfully!');
        this.resetForm();
      },
      error => {
        console.error('❌ Error adding job:', error);
        alert('Failed to add job');
      }
    );
  }

  resetForm() {
    this.title = '';
    this.location = '';
    this.jobType = 'Full Time';
    this.salary = '';
    this.eligibility = '';
    this.skillsRequired = '';
    this.jobDescription = '';
    this.jobFile = null;
    this.fileUploader.nativeElement.value = '';  // Reset the file input
  }
}
