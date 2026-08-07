import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelTemplate } from './model-template';

describe('ModelTemplate', () => {
  let component: ModelTemplate;
  let fixture: ComponentFixture<ModelTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
