import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { CandidatService } from '../../services/Candidat/candidat-service';
import { Navbar } from '../dashboard-rh/Shared/navbar/navbar';

@Component({
  selector: 'app-dashboard-candidat',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard-candidat.html',
  styleUrl: './dashboard-candidat.css'
})
export class DashboardCandidat implements OnInit {
  offres: any[] = [];
  documents: any[] = [];
  candidatures: any[] = [];
  successMessage = '';
  errorMessage = '';
  uploading = false;
  selectedType = 'CV';
  private cdr = inject(ChangeDetectorRef);

  // Modale de postulation
  showPostulerModal = false;
  selectedOffre: any = null;
  selectedDocId: number | null = null;
  candidatInfo = {
    nom: '',
    email: '',
    poste: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private candidatService: CandidatService
  ) {}

  ngOnInit(): void {
    this.candidatInfo.nom = localStorage.getItem('userName') || '';
    this.candidatInfo.email = localStorage.getItem('userEmail') || '';
    this.loadOffres();
    this.loadDocuments();
    this.loadCandidatures();
  }

  loadOffres() {
    this.candidatService.getAll().subscribe({
      next: (data) => { this.offres = [...data]; this.cdr.detectChanges(); }
    });
  }

  loadDocuments() {
    this.candidatService.getDocuments().subscribe({
      next: (data) => { this.documents = [...data]; this.cdr.detectChanges(); }
    });
  }

  loadCandidatures() {
    const email = localStorage.getItem('userEmail') || '';
    if (email) {
      this.candidatService.suivreParEmail(email).subscribe({
        next: (data) => { this.candidatures = [...data]; this.cdr.detectChanges(); }
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    this.candidatService.uploadDocument(file, this.selectedType).subscribe({
      next: () => {
        this.successMessage = 'Document uploade avec succes !';
        this.uploading = false;
        this.loadDocuments();
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'upload';
        this.uploading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteDoc(id: number) {
    this.candidatService.deleteDocument(id).subscribe({
      next: () => this.loadDocuments()
    });
  }

  // Ouvrir la modale
  openPostulerModal(offre: any) {
    if (!this.candidatInfo.email) {
      this.errorMessage = 'Veuillez vous reconnecter pour postuler';
      this.cdr.detectChanges();
      return;
    }
    this.selectedOffre = offre;
    this.candidatInfo.poste = offre.titre;
    this.selectedDocId = this.documents.find(d => d.typeDocument === 'CV')?.id || null;
    this.showPostulerModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showPostulerModal = false;
    this.selectedOffre = null;
    this.selectedDocId = null;
    this.cdr.detectChanges();
  }

  // Confirmer la postulation
  confirmerPostulation() {
    const doc = this.documents.find(d => d.id === Number(this.selectedDocId));
    const cvUrl = doc ? doc.url : '';

    const dto = {
      nom: this.candidatInfo.nom,
      email: this.candidatInfo.email,
      poste: this.selectedOffre.titre,
      statut: 'EN_ATTENTE',
      cvUrl: cvUrl
    };

    this.candidatService.postuler(dto).subscribe({
      next: (response: any) => {
        this.successMessage = 'Candidature envoyee ! Reference: #' + response.id + ' - Poste: ' + this.selectedOffre.titre;
        this.closeModal();
        this.loadCandidatures();
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 5000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la postulation';
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteCandidature(id: number) {
    if (!confirm('Supprimer cette candidature ?')) return;
    this.candidatService.deleteCandidature(id).subscribe({
      next: () => { this.loadCandidatures(); this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'Erreur suppression'; this.cdr.detectChanges(); }
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => { this.authService.clearTokens(); this.router.navigate(['/login']); },
      error: () => { this.authService.clearTokens(); this.router.navigate(['/login']); }
    });
  }
}
