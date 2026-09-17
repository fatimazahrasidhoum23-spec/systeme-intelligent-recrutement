import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreArchive } from './offre-archive';

describe('OffreArchive', () => {
  let component: OffreArchive;
  let fixture: ComponentFixture<OffreArchive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffreArchive],
    }).compileComponents();

    fixture = TestBed.createComponent(OffreArchive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
