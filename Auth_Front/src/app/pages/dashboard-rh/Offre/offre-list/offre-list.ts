import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RhSidebar } from "../../Shared/rh-sidebar/rh-sidebar";
import { CurrencyPipe, CommonModule } from '@angular/common';
import { OffreResponse } from '../../../../models/offre/offre';
import { OffreSevice } from '../../../../services/offre/offre-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offre-list',
  standalone: true,
  imports: [RhSidebar, CurrencyPipe, RouterLink, CommonModule],
  templateUrl: './offre-list.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './offre-list.css',
})
export class OffreList implements OnInit {
  offreslIST: OffreResponse[] = [];
  offreService = inject(OffreSevice);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.getAll();
  }

  getAll(): void {
    this.offreService.getAll().subscribe({
      next: (offres) => {
        this.offreslIST = [...offres];
        this.cdr.detectChanges();
        console.log('Offres chargées:', this.offreslIST.length);
      },
      error: (err) => {
        console.error('Erreur chargement offres:', err);
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Supprimer cette offre ?')) {
      this.offreService.delete(id).subscribe({
        next: () => {
          this.offreslIST = this.offreslIST.filter(offre => offre.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
        }
      });
    }
  }
}
