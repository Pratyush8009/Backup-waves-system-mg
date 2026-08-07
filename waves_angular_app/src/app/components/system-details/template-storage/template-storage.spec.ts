import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateStorage } from './template-storage';

describe('TemplateStorage', () => {
  let component: TemplateStorage;
  let fixture: ComponentFixture<TemplateStorage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateStorage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateStorage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
