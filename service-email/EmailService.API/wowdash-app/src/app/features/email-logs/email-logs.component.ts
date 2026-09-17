import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { FormsModule }                 from '@angular/forms';
import { Subject, takeUntil }          from 'rxjs';

import { EmailService } from '../../core/services/email.service';
import { EmailLog }     from '../../core/models/email.model';
import {
  EmailTypeLabelPipe,
  EmailStatusLabelPipe,
  EmailStatusBadgePipe,
  EmailTypeBadgePipe
} from '../../core/services/email.pipes';

@Component({
  selector:    'app-email-logs',
  standalone:  true,
  imports: [
    CommonModule, FormsModule,
    EmailTypeLabelPipe, EmailStatusLabelPipe,
    EmailStatusBadgePipe, EmailTypeBadgePipe
  ],
  templateUrl: './email-logs.component.html',
})
export class EmailLogsComponent implements OnInit, OnDestroy {

  logs:         EmailLog[] = [];
  selectedLog:  EmailLog | null = null;
  isLoading    = false;
  errorMessage = '';

  search:       string = '';
  filterType:   string = '';
  filterStatus: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private emailService: EmailService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogs(): void {
    this.isLoading    = true;
    this.errorMessage = '';

    this.emailService.getLogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.ngZone.run(() => {
            this.logs      = data || [];
            this.isLoading = false;
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.isLoading = false;
            this.errorMessage = err.status === 0
              ? 'Backend inaccessible. Verifiez que dotnet run tourne sur le port 5292.'
              : 'Erreur ' + err.status + ' : ' + err.message;
            this.cdr.detectChanges();
          });
        }
      });
  }

  get filteredLogs(): EmailLog[] {
    return this.logs.filter(log => {
      if (this.filterType !== '' && String(log.type) !== this.filterType) {
        return false;
      }
      if (this.filterStatus !== '' && String(log.statut) !== this.filterStatus) {
        return false;
      }
      if (this.search) {
        const term = this.search.toLowerCase();
        const match = log.destinataire?.toLowerCase().includes(term) ||
                      log.sujet?.toLowerCase().includes(term);
        if (!match) return false;
      }
      return true;
    });
  }

  resetFilters(): void {
    this.search       = '';
    this.filterType   = '';
    this.filterStatus = '';
  }

  viewDetail(log: EmailLog): void {
    this.selectedLog = log;
  }
}
