import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewJobsComponent } from './view-jobs/view-jobs.component';
import { ViewJobComponent } from './view-job/view-job.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ViewJobsComponent,ViewJobComponent],
  imports: [CommonModule, FormsModule],
  exports: [ViewJobsComponent,ViewJobComponent]
})
export class SharedModule { }
