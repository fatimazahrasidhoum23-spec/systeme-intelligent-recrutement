import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';
import {
  EmailLog,
  EmailEventDto,
  SendEmailResponse,
  HealthResponse
} from '../models/email.model';
import { environment } from '../../../environments/environment';

// ============================================================
// EmailService Angular — couvre EXACTEMENT les 3 endpoints
// du backend .NET (EmailController.cs)
// ============================================================

@Injectable({ providedIn: 'root' })
export class EmailService {

  // ATTENTION : route en majuscule singulier côté backend
  // [Route("api/[controller]")] → EmailController → /api/Email
  private readonly API = environment.emailApiUrl;

  constructor(private http: HttpClient) {}

  // ── GET /api/Email/logs ──────────────────────────────────
  // Backend retourne la liste plate triée par DateEnvoi DESC
  getLogs(): Observable<EmailLog[]> {
    return this.http.get<EmailLog[]>(`${this.API}/Email/logs`);
  }

  // ── POST /api/Email/test ─────────────────────────────────
  // Backend attend un EmailEventDto (Destinataire, NomCandidat, Poste, TypeEvenement, ...)
  envoyerTest(evenement: EmailEventDto): Observable<SendEmailResponse> {
    return this.http.post<SendEmailResponse>(`${this.API}/Email/test`, evenement);
  }

  // ── GET /api/Email/health ────────────────────────────────
  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.API}/Email/health`);
  }
}
