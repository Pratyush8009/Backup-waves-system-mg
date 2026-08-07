import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelOverview } from './model-overview';

describe('ModelOverview', () => {
  let component: ModelOverview;
  let fixture: ComponentFixture<ModelOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
