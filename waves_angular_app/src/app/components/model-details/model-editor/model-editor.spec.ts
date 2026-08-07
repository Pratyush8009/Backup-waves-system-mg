import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelEditor } from './model-editor';

describe('ModelEditor', () => {
  let component: ModelEditor;
  let fixture: ComponentFixture<ModelEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
