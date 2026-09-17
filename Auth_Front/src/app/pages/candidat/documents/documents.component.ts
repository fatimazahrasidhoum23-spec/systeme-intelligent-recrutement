import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../services/document.service';
import { Navbar } from '../../dashboard-rh/Shared/navbar/navbar';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, Navbar, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './documents.component.html'
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  uploading = false;
  successMessage = '';
  errorMessage = '';
  selectedType = 'CV';

  constructor(private documentService: DocumentService) {}

  ngOnInit() { this.loadDocuments(); }

  loadDocuments() {
    this.documentService.getMesDocuments().subscribe({
      next: (docs) => this.documents = docs,
      error: () => this.errorMessage = 'Erreur lors du chargement des documents'
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.documentService.upload(file, this.selectedType).subscribe({
      next: () => {
        this.successMessage = 'Document uploadé avec succès !';
        this.uploading = false;
        this.loadDocuments();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'upload';
        this.uploading = false;
      }
    });
  }

  onDelete(id: number) {
    if (!confirm('Supprimer ce document ?')) return;
    this.documentService.delete(id).subscribe({
      next: () => this.loadDocuments(),
      error: () => this.errorMessage = 'Erreur lors de la suppression'
    });
  }
}
