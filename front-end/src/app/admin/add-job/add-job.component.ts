import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {
  
  title: string = '';
  location: string = '';
  jobType: string = 'Full Time';
  salary: string = '';
  eligibility: string = '';
  skillsRequired: string = ''; // ✅ Added Skills Field
  jobDescription: string = '';
  jobImage: File | null = null;

  constructor() { }

  ngOnInit(): void { }

  onFileSelected(event: any) {
    this.jobImage = event.target.files[0];
  }

  onSubmit() {
    const newJob = {
      title: this.title,
      location: this.location,
      jobType: this.jobType,
      salary: this.salary,
      eligibility: this.eligibility,
      skillsRequired: this.skillsRequired, // ✅ Include skills
      jobDescription: this.jobDescription,
      jobImage: this.jobImage
    };

    console.log("New job added:", newJob);

    // Reset Form
    this.title = '';
    this.location = '';
    this.jobType = 'Full Time';
    this.salary = '';
    this.eligibility = '';
    this.skillsRequired = '';
    this.jobDescription = '';
    this.jobImage = null;
  }
}
