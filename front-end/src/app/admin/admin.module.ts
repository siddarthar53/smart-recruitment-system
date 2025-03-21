import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddJobComponent } from './add-job/add-job.component';
import { ViewApplicantsComponent } from './view-applicants/view-applicants.component';
import { RankApplicantsComponent } from './rank-applicants/rank-applicants.component';
import { SchedulingInterviewComponent } from './scheduling-interview/scheduling-interview.component';
import { ViewApplicantComponent } from './view-applicant/view-applicant.component';
import { SharedModule } from '../shared/shared.module'; 

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AddJobComponent,
    ViewApplicantsComponent,
    RankApplicantsComponent,
    SchedulingInterviewComponent,
    ViewApplicantComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule
  ],
})
export class AdminModule { }
