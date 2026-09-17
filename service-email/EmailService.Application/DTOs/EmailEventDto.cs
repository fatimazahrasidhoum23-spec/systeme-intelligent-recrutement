namespace EmailService.Application.DTOs;

public class EmailEventDto
{
    // ── Champs communs (toujours requis) ──────────────────────
    public string Destinataire { get; set; } = string.Empty;   // email du candidat
    public string NomCandidat { get; set; } = string.Empty;    // nom du candidat
    public string Poste { get; set; } = string.Empty;          // poste concerné
    public string TypeEvenement { get; set; } = string.Empty;  // "postulation" / "entretien" / "admission"

    // ── Info candidat (optionnel — vient du Service Candidat) ─
    public string? NumeroTelephone { get; set; }

    // ── Champs entretien (utilisés si TypeEvenement = "entretien") ─
    public DateTime? DateEntretien { get; set; }
    public string? LieuEntretien { get; set; }
}