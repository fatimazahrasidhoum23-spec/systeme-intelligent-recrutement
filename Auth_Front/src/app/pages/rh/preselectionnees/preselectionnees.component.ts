import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatService } from '../../../services/Candidat/candidat-service';
import { RhSidebar } from '../../dashboard-rh/Shared/rh-sidebar/rh-sidebar';

@Component({
  selector: 'app-preselectionnees',
  standalone: true,
  imports: [CommonModule, RhSidebar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './preselectionnees.component.html'
})
export class PreselectionneeComponent implements OnInit {
  candidats: any[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private candidatService: CandidatService) {}

  ngOnInit() { this.load(); }

  load() {
    this.candidatService.getPreselectionnees().subscribe({
      next: (data) => this.candidats = data,
      error: () => this.errorMessage = 'Erreur lors du chargement'
    });
  }

  onValider(id: number) {
    this.candidatService.valider(id).subscribe({
      next: () => { this.successMessage = 'Candidat validé ✓'; this.load(); },
      error: () => this.errorMessage = 'Erreur lors de la validation'
    });
  }

  onEliminer(id: number) {
    if (!confirm('Éliminer ce candidat ?')) return;
    this.candidatService.eliminer(id).subscribe({
      next: () => { this.successMessage = 'Candidat éliminé'; this.load(); },
      error: () => this.errorMessage = 'Erreur lors de l\'élimination'
    });
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'bg-success-100 text-success-600';
    if (score >= 60) return 'bg-warning-100 text-warning-600';
    return 'bg-danger-100 text-danger-600';
  }
}
