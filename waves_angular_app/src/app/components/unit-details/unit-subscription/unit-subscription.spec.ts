import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSubscription } from './unit-subscription';

describe('UnitSubscription', () => {
  let component: UnitSubscription;
  let fixture: ComponentFixture<UnitSubscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitSubscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitSubscription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
