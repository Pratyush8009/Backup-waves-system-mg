import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowConfigPanel } from './flow-config-panel';

describe('FlowConfigPanel', () => {
  let component: FlowConfigPanel;
  let fixture: ComponentFixture<FlowConfigPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowConfigPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowConfigPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
