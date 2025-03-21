import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';
import { ViewJobComponent } from '../shared/view-job/view-job.component'; 
import { ViewJobsComponent } from '../shared/view-jobs/view-jobs.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { InterviewDetailsComponent } from './interview-details/interview-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'view-jobs', component: ViewJobsComponent },  
  { path: 'view-job/:id', component: ViewJobComponent },  
  { path: 'save-resume', component: ResumeUploadComponent },
  { path: 'applications', component: MyApplicationsComponent },
  { path: 'interview-details', component: InterviewDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
