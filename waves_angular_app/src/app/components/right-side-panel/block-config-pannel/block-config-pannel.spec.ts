import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockConfigPannel } from './block-config-pannel';

describe('BlockConfigPannel', () => {
  let component: BlockConfigPannel;
  let fixture: ComponentFixture<BlockConfigPannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockConfigPannel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockConfigPannel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
