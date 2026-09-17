import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreUpdate } from './offre-update';

describe('OffreUpdate', () => {
  let component: OffreUpdate;
  let fixture: ComponentFixture<OffreUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffreUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(OffreUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
