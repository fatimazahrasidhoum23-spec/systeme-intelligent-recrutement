import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreAjout } from './offre-ajout';

describe('OffreAjout', () => {
  let component: OffreAjout;
  let fixture: ComponentFixture<OffreAjout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffreAjout],
    }).compileComponents();

    fixture = TestBed.createComponent(OffreAjout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
