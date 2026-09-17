import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTechnique } from './dashboard-technique';

describe('DashboardTechnique', () => {
  let component: DashboardTechnique;
  let fixture: ComponentFixture<DashboardTechnique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTechnique],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTechnique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
