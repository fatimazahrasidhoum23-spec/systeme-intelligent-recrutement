import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreAdd } from './offre-add';

describe('OffreAdd', () => {
  let component: OffreAdd;
  let fixture: ComponentFixture<OffreAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffreAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(OffreAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
