import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { OffreRequest } from '../../../../models/offre/offre';
import { OffreSevice } from '../../../../services/offre/offre-service';
import { Router } from '@angular/router';
import { RhSidebar } from "../../Shared/rh-sidebar/rh-sidebar";
import { CommonModule } from '@angular/common';

const salaireComparaison: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const min = control.get('salaireMin')?.value;
  const max = control.get('salaireMax')?.value;
  return min !== null && max !== null && max <= min ? { salaireIncoherent: true } : null;
};

@Component({
  selector: 'app-offre-ajout',
  imports: [ReactiveFormsModule, RhSidebar, CommonModule],
  standalone: true,
  templateUrl: './offre-ajout.html',
  styleUrl: './offre-ajout.css',
})
export class OffreAjout implements OnInit {
  private offreService = inject(OffreSevice);
  router = inject(Router);
  successMessage = '';
  errorMessage = '';

  formGroup = new FormGroup({
    titre: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    salaireMin: new FormControl(0, [Validators.min(0)]),
    salaireMax: new FormControl(0, [Validators.min(0)]),
    lieu: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required])
  }, { validators: salaireComparaison });

  ngOnInit() {}

  OnAdd(): void {
    if (this.formGroup.invalid) return;
    const data: OffreRequest = this.formGroup.value as OffreRequest;
    this.offreService.Add(data).subscribe({
      next: () => {
        this.successMessage = 'Offre ajoutée avec succès !';
        this.formGroup.reset();
        setTimeout(() => this.router.navigate(['/dashboard/rh/offre/list']), 1500);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout. Vérifiez votre connexion.';
        console.error(err);
      }
    });
  }
}
