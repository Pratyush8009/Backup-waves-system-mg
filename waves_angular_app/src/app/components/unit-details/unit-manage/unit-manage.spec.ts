import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitManage } from './unit-manage';

describe('UnitManage', () => {
  let component: UnitManage;
  let fixture: ComponentFixture<UnitManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitManage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
