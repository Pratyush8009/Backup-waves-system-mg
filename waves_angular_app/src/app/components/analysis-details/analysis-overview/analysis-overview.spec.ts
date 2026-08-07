import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisOverview } from './analysis-overview';

describe('AnalysisOverview', () => {
  let component: AnalysisOverview;
  let fixture: ComponentFixture<AnalysisOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
