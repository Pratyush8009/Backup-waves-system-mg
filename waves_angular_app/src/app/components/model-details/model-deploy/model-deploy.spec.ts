import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDeploy } from './model-deploy';

describe('ModelDeploy', () => {
  let component: ModelDeploy;
  let fixture: ComponentFixture<ModelDeploy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDeploy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelDeploy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
