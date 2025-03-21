import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingInterviewComponent } from './scheduling-interview.component';

describe('SchedulingInterviewComponent', () => {
  let component: SchedulingInterviewComponent;
  let fixture: ComponentFixture<SchedulingInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulingInterviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
