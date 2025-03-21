import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankApplicantsComponent } from './rank-applicants.component';

describe('RankApplicantsComponent', () => {
  let component: RankApplicantsComponent;
  let fixture: ComponentFixture<RankApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankApplicantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
