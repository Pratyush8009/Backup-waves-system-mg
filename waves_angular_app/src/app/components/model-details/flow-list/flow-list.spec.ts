import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowList } from './flow-list';

describe('FlowList', () => {
  let component: FlowList;
  let fixture: ComponentFixture<FlowList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
