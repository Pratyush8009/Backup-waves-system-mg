import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSchema } from './system-schema';

describe('SystemSchema', () => {
  let component: SystemSchema;
  let fixture: ComponentFixture<SystemSchema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemSchema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemSchema);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
