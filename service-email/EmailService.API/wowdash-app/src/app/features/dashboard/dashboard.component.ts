import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { RouterModule }                from '@angular/router';
import { Subject, takeUntil }          from 'rxjs';

import { EmailService } from '../../core/services/email.service';
import { EmailLog }     from '../../core/models/email.model';

interface DashboardStats {
  total:      number;
  envoyes:    number;
  echoues:    number;
  enAttente:  number;
  parType: {
    postulation: number;
    entretien:   number;
    admission:   number;
  };
}

@Component({
  selector:    'app-dashboard',
  standalone:  true,
  imports:     [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  stats: DashboardStats = {
    total: 0, envoyes: 0, echoues: 0, enAttente: 0,
    parType: { postulation: 0, entretien: 0, admission: 0 }
  };

  healthOk:      boolean | null = null;
  healthService: string         = '';
  healthHeure:   string         = '';

  private destroy$ = new Subject<void>();

  constructor(
    private emailService: EmailService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.healthOk = null;

    this.emailService.health()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (h) => {
          this.ngZone.run(() => {
            this.healthOk      = true;
            this.healthService = h.service;
            this.healthHeure   = h.heure;
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.healthOk = false;
            this.cdr.detectChanges();
          });
        }
      });

    this.emailService.getLogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logs) => {
          this.ngZone.run(() => {
            this.computeStats(logs);
            this.cdr.detectChanges();
          });
        },
        error: () => {}
      });
  }

  private computeStats(logs: EmailLog[]): void {
    this.stats = {
      total:     logs.length,
      enAttente: logs.filter(l => String(l.statut) === '0' || String(l.statut) === 'EnAttente').length,
      envoyes:   logs.filter(l => String(l.statut) === '1' || String(l.statut) === 'Envoye').length,
      echoues:   logs.filter(l => String(l.statut) === '2' || String(l.statut) === 'Echoue').length,
      parType: {
        postulation: logs.filter(l => String(l.type) === '0' || String(l.type) === 'ConfirmationPostulation').length,
        entretien:   logs.filter(l => String(l.type) === '1' || String(l.type) === 'ConfirmationEntretien').length,
        admission:   logs.filter(l => String(l.type) === '2' || String(l.type) === 'Admission').length
      }
    };
  }
}
