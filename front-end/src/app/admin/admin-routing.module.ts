import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ViewJobsComponent } from '../shared/view-jobs/view-jobs.component';
import { ViewJobComponent } from '../shared/view-job/view-job.component';
import { AddJobComponent } from './add-job/add-job.component';
import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';
import { ViewApplicantComponent } from './view-applicant/view-applicant.component';
import { RankApplicantsComponent } from './rank-applicants/rank-applicants.component';
import { SchedulingInterviewComponent } from './scheduling-interview/scheduling-interview.component';
import { AnalyticsComponent } from './analytics/analytics.component';

const routes: Routes = [ 
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'view-jobs', component: ViewJobsComponent },
  { path: 'view-job/:id', component: ViewJobComponent },
  { path: 'add-job', component: AddJobComponent },
  { path: 'view-applicants', component: ViewApplicantsComponent },
  { path: 'view-applicant', component: ViewApplicantComponent },
  { path: 'rank-applicants', component: RankApplicantsComponent },
  { path: 'shortlist', component: SchedulingInterviewComponent },
  { path:'analytics',component: AnalyticsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
