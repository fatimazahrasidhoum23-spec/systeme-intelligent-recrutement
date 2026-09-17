import { Component, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { Subject, takeUntil }  from 'rxjs';
import { RouterModule }        from '@angular/router';

import { EmailService } from '../../core/services/email.service';
import { EmailEventDto } from '../../core/models/email.model';

@Component({
  selector:    'app-email-test',
  standalone:  true,
  imports:     [CommonModule, FormsModule, RouterModule],
  templateUrl: './email-test.component.html',
})
export class EmailTestComponent implements OnDestroy {

  form: EmailEventDto = {
    destinataire:  '',
    nomCandidat:   '',
    poste:         '',
    typeEvenement: 'postulation'
  };

  submitted      = false;
  isSending      = false;
  successMessage = '';
  errorMessage   = '';

  get minDate(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  private destroy$ = new Subject<void>();

  constructor(
    private emailService: EmailService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  send(): void {
    this.submitted      = true;
    this.successMessage = '';
    this.errorMessage   = '';

    if (!this.isFormValid()) {
      this.errorMessage = "Veuillez corriger les champs en rouge avant denvoyer.";
      return;
    }

    this.isSending = true;
    this.cdr.detectChanges();

    const payload: EmailEventDto = { ...this.form };
    if (payload.typeEvenement === 'entretien' && payload.dateEntretien) {
      payload.dateEntretien = new Date(payload.dateEntretien).toISOString();
    }

    this.emailService.envoyerTest(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            this.isSending      = false;
            this.submitted      = false;
            this.successMessage = (response.message || 'Email envoye.') + ' Destinataire : ' + (response.destinataire || this.form.destinataire);
            this.resetForm();
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.isSending = false;
            if (err && err.error && err.error.erreur) {
              this.errorMessage = err.error.erreur;
            } else if (err && err.status === 0) {
              this.errorMessage = "Backend inaccessible. Verifiez : dotnet run sur le port 5292.";
            } else {
              this.errorMessage = "Erreur " + (err ? err.status : '?') + ". Verifiez la console.";
            }
            this.cdr.detectChanges();
          });
        },
        complete: () => {
          this.ngZone.run(() => {
            this.isSending = false;
            this.cdr.detectChanges();
          });
        }
      });
  }

  reset(): void {
    this.resetForm();
    this.submitted      = false;
    this.successMessage = '';
    this.errorMessage   = '';
  }

  private resetForm(): void {
    this.form = {
      destinataire:  '',
      nomCandidat:   '',
      poste:         '',
      typeEvenement: 'postulation'
    };
  }

  isFormValid(): boolean {
    if (!this.isEmailValid(this.form.destinataire)) return false;
    if (!this.form.nomCandidat || !this.form.nomCandidat.trim()) return false;
    if (!this.form.poste || !this.form.poste.trim())             return false;
    if (!this.form.typeEvenement)                                return false;

    if (this.form.typeEvenement === 'entretien') {
      if (!this.form.dateEntretien)                                return false;
      if (!this.form.lieuEntretien || !this.form.lieuEntretien.trim()) return false;
      if (!this.isDateInFuture(this.form.dateEntretien))           return false;
    }
    return true;
  }

  isEmailValid(email: string): boolean {
    if (!email) return false;
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  isDateInFuture(dateStr: string): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date.getTime() >= Date.now() - 60000;
  }
}
