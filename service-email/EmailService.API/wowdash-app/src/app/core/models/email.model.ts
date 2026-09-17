// ============================================================
// Modèles alignés EXACTEMENT sur le backend EmailService .NET
// Backend : http://localhost:5292
// ============================================================

// ─── ENUMS (mêmes valeurs que le backend C#) ─────────────────
// EmailService.Domain/Enums/EmailType.cs
export enum EmailType {
  ConfirmationPostulation = 'ConfirmationPostulation',
  ConfirmationEntretien   = 'ConfirmationEntretien',
  Admission               = 'Admission'
}

// EmailService.Domain/Enums/EmailStatus.cs
export enum EmailStatus {
  EnAttente = 'EnAttente',
  Envoye    = 'Envoye',
  Echoue    = 'Echoue'
}

// ─── ENTITY (correspond à EmailLog.cs côté backend) ──────────
export interface EmailLog {
  id:            number;
  destinataire:  string;
  sujet:         string;
  corps:         string;
  type:          EmailType | number;     // .NET sérialise les enums en nombre par défaut
  statut:        EmailStatus | number;
  dateEnvoi:     string;
  messageErreur?: string | null;
}

// ─── DTO (correspond à EmailEventDto.cs côté backend) ────────
// POST /api/Email/test attend EXACTEMENT cette structure
export interface EmailEventDto {
  destinataire:    string;                          // email du candidat
  nomCandidat:     string;                          // nom du candidat
  poste:           string;                          // poste concerné
  typeEvenement:   'postulation' | 'entretien' | 'admission';

  // Optionnels
  numeroTelephone?: string;
  dateEntretien?:   string;   // ISO 8601 — utilisé seulement si typeEvenement="entretien"
  lieuEntretien?:   string;
}

// ─── Réponses du backend ─────────────────────────────────────
// POST /api/Email/test retourne :
//   succès → { message: "Email traité avec succès", destinataire: "..." }
//   échec  → { erreur: "..." } (status 400)
export interface SendEmailResponse {
  message?:      string;
  destinataire?: string;
  erreur?:       string;
}

// GET /api/Email/health
export interface HealthResponse {
  statut:  string;
  service: string;
  heure:   string;
}
