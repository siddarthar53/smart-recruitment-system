import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../Services/resume.service';
import { Resume } from 'src/app/models/resume.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅ Add this

@Component({
  selector: 'app-resume-upload',
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css']
})
export class ResumeUploadComponent implements OnInit {
  resumeTitle: string = '';
  uploadMessage: string = '';
  savedResumes: Resume[] = [];
  selectedResume: Resume | null = null;
  selectedResumeUrl: SafeResourceUrl | null = null;
  selectedResumeTitle: string = '';
  selectedFile: File | null = null;
  userId: string | null = null;

  constructor(private resumeService: ResumeService,private sanitizer: DomSanitizer) {}

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
  }


  /** Handles Resume File Selection */
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }
    this.selectedFile = file;
  }

  /** Handles Resume Upload */
  saveResume() {
    if (!this.resumeTitle.trim()) {
      alert('Please enter a resume title.');
      return;
    }
    if (!this.selectedFile) {
      alert('Please select a resume file to upload.');
      return;
    }
    if (!this.userId) {
      alert('User not found. Please log in again.');
      return;
    }

    this.resumeService.uploadResume(this.resumeTitle, this.selectedFile, this.userId).subscribe(
      (response: Resume) => {
        console.log('✅ Resume uploaded:', response);
        this.uploadMessage = `${response.resumeTitle} Resume Saved.`;
        this.savedResumes.push(response);
        this.resumeTitle = '';
        this.selectedFile = null;
        this.clearFileInput();
      },
      (error) => {
        console.error('❌ Error uploading resume:', error);
        alert('Failed to upload resume.');
      }
    );
  }

  /** Clears File Input Field After Upload */
  clearFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /** Loads Saved Resumes */
  loadSavedResumes() {
    if (!this.userId) {
      console.error("User not found in local storage.");
      return;
    }

    this.resumeService.getSavedResumes(this.userId).subscribe(
      (resumes: any) => {
        this.savedResumes = resumes;
        console.log("Fetched Resumes:", this.savedResumes);
      },
      (error) => {
        console.error("❌ Error fetching saved resumes:", error);
      }
    );
  }


  /** Displays Selected Resume in Viewer (To be implemented) */
  viewResume(resumeUrl: string) {
    // TODO: Implement resume viewing
    this.selectedResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resumeUrl);
    const matchingResume = this.savedResumes.find(resume => resume.s3Bucket?.s3Url === resumeUrl);
    this.selectedResumeTitle = matchingResume?.resumeTitle || 'Resume Preview';
  }

  deleteResume(resumeId: string) {
    if (!resumeId) {
      alert('Invalid resume ID.');
      return;
    }
  
    this.resumeService.deleteResume(resumeId).subscribe(
      (response: any) => {
        console.log('✅ Resume deleted:', response);
        this.loadSavedResumes();  // ✅ Refresh the list after deletion
      },
      (error) => {
        console.error('❌ Error deleting resume:', error);
        alert('Failed to delete resume.');
      }
    );
  }
  
  
}
