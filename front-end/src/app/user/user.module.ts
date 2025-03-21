import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
// ✅ Import Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { InterviewDetailsComponent } from './interview-details/interview-details.component';

@NgModule({
  declarations: [
    UserDashboardComponent,
    ResumeUploadComponent,
    UserSidebarComponent,
    MyApplicationsComponent,
    InterviewDetailsComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,  // ✅ Use this instead of BrowserModule
    UserRoutingModule,
    ReactiveFormsModule, 
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,
    FormsModule,
    RouterModule ,
    MatCardModule,
    SharedModule
  ],
  exports: [UserSidebarComponent] 
})
export class UserModule { }
