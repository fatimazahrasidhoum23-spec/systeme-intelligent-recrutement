import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreList } from './offre-list';

describe('OffreList', () => {
  let component: OffreList;
  let fixture: ComponentFixture<OffreList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffreList],
    }).compileComponents();

    fixture = TestBed.createComponent(OffreList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
