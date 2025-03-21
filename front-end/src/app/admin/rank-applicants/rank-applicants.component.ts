import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rank-applicants',
  templateUrl: './rank-applicants.component.html',
  styleUrls: ['./rank-applicants.component.css']
})
export class RankApplicantsComponent implements OnInit {
  jobTitles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'HR Specialist'];
  selectedJob: string = '';
  applicants: any[] = [];
  loading: boolean = false;
  showRankedApplicants: boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void { }

  // Handle job selection
  onJobSelect(event: any) {
    this.selectedJob = event.target.value;
    this.showRankedApplicants = false; // Reset the table when selecting a new job
  }

  // Simulate ranking applicants using NLP API (Replace with actual backend call)
  rankApplicants() {
    if (!this.selectedJob) {
      alert('Please select a job title first.');
      return;
    }

    this.loading = true;
    this.showRankedApplicants = false;

    // Simulating API call delay (Replace this with actual HTTP request to backend)
    setTimeout(() => {
      this.applicants =
        [
          { name: 'John Doe', email: 'johndoe@gmail.com', selected: false },
          { name: 'Jane Smith', email: 'janesmith@gmail.com', selected: false },
          { name: 'Michael Brown', email: 'michaelbrown@gmail.com', selected: false },
          { name: 'Emily Davis', email: 'emilydavis@gmail.com', selected: false },
          { name: 'Robert White', email: 'robertwhite@gmail.com', selected: false },
          { name: 'Sophia Green', email: 'sophiagreen@gmail.com', selected: false },
          { name: 'James Black', email: 'jamesblack@gmail.com', selected: false },
          { name: 'Olivia Gray', email: 'oliviagray@gmail.com', selected: false },
          { name: 'William Blue', email: 'williamblue@gmail.com', selected: false },
          { name: 'Emma Red', email: 'emmaredd@gmail.com', selected: false }
        ];

      // Randomize ranking order to simulate backend processing
      this.applicants.sort(() => Math.random() - 0.5);

      this.loading = false;
      this.showRankedApplicants = true;
      console.log('Ranked Applicants:', this.applicants);
    }, 2000); // Simulate a 2-second API response delay
  }

  // Shortlist selected applicants
  shortlistApplicants() {
    const shortlisted = this.applicants.filter(applicant => applicant.selected);
    console.log("Shortlisted applicants:", shortlisted);
    // Redirect to shortlist & schedule interviews component

    if (shortlisted.length === 0) {
      alert('Please select at least one applicant.');
      return;
    }

    this.router.navigate(['/admin/shortlist'], {
      queryParams: {
        jobTitle: this.selectedJob,
        applicants: JSON.stringify(shortlisted)
      }
    });
  }

  // Handle checkbox selection
  onCheckboxChange(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.applicants[index].selected = inputElement.checked;
    }
  }
}
