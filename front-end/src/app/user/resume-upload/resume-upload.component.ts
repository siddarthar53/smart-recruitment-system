import { Component } from '@angular/core';

@Component({
  selector: 'app-resume-upload',
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css']
})
export class ResumeUploadComponent {
  resumeTitle: string = '';
  uploadMessage: string = '';
  savedResumes: { title: string, url: string }[] = [];
  selectedResume: string | null = null;
  selectedResumeTitle: string = '';

  /** Handles Resume File Upload */
  onFileUpload(event: any) {
    const file = event.target.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    // Simulate uploading the file and getting a S3 URL
    const fakeS3Url = `https://s3-bucket-url.com/${file.name}`;

    this.uploadMessage = `"${this.resumeTitle}" Resume Saved.`;
    
    this.savedResumes.push({ title: this.resumeTitle, url: fakeS3Url });

    // Clear the form
    this.resumeTitle = '';
  }

  /** Handles Resume Upload */
  saveResume() {
    if (!this.resumeTitle.trim()) {
      alert('Please enter a resume title.');
      return;
    }

    this.uploadMessage = `"${this.resumeTitle}" Resume Saved.`;
  }

  /** Displays Selected Resume in Viewer */
  viewResume(resumeUrl: string) {
    this.selectedResume = resumeUrl;
    const selected = this.savedResumes.find(r => r.url === resumeUrl);
    this.selectedResumeTitle = selected ? selected.title : 'Resume';
  }

  /** Deletes Resume */
  deleteResume(resumeTitle: string) {
    this.savedResumes = this.savedResumes.filter(r => r.title !== resumeTitle);
    this.selectedResume = null;
  }
}
