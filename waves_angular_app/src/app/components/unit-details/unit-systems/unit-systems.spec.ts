import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSystems } from './unit-systems';

describe('UnitSystems', () => {
  let component: UnitSystems;
  let fixture: ComponentFixture<UnitSystems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitSystems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitSystems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
