import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitBilling } from './unit-billing';

describe('UnitBilling', () => {
  let component: UnitBilling;
  let fixture: ComponentFixture<UnitBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitBilling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
