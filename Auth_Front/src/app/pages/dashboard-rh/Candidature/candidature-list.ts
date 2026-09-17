import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RhSidebar } from '../Shared/rh-sidebar/rh-sidebar';

@Component({
  selector: 'app-candidature-list',
  standalone: true,
  imports: [CommonModule, RhSidebar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './candidature-list.html'
})
export class CandidatureList implements OnInit {
  candidatures: any[] = [];
  successMessage = '';
  errorMessage = '';
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost/api/offre/candidature';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') });
  }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => { this.candidatures = [...data]; this.cdr.detectChanges(); },
      error: () => this.errorMessage = 'Erreur lors du chargement'
    });
  }

  onValider(id: number) {
    this.http.patch(`${this.apiUrl}/valider`, { id }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.successMessage = 'Candidature #' + id + ' validee !';
        this.loadAll();
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => this.errorMessage = 'Erreur lors de la validation'
    });
  }

  onEliminer(id: number) {
    if (!confirm('Eliminer la candidature #' + id + ' ?')) return;
    this.http.patch(`${this.apiUrl}/eliminer`, { id }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.successMessage = 'Candidature #' + id + ' eliminee';
        this.loadAll();
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => this.errorMessage = 'Erreur lors de l\'elimination'
    });
  }

  onDelete(id: number) {
    if (!confirm('Supprimer definitivement la candidature #' + id + ' ?')) return;
    this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => { this.loadAll(); this.cdr.detectChanges(); },
      error: () => this.errorMessage = 'Erreur lors de la suppression'
    });
  }

  voirCV(cvUrl: string) {
    if (cvUrl) window.open(cvUrl, '_blank');
  }

  scoreColor(score: number): string {
    if (score === null || score === undefined) return 'bg-secondary-100 text-secondary-600';
    if (score >= 80) return 'bg-success-100 text-success-600';
    if (score >= 60) return 'bg-warning-100 text-warning-600';
    return 'bg-danger-100 text-danger-600';
  }

  statutColor(statut: string): string {
    if (statut === 'EN_ATTENTE') return 'bg-warning-100 text-warning-600';
    if (statut === 'ACCEPTEE') return 'bg-success-100 text-success-600';
    if (statut === 'REFUSEE') return 'bg-danger-100 text-danger-600';
    return 'bg-secondary-100 text-secondary-600';
  }
}
