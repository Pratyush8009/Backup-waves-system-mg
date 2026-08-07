import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurePage } from './configure-page';

describe('ConfigurePage', () => {
  let component: ConfigurePage;
  let fixture: ComponentFixture<ConfigurePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
