using EmailService.Domain.Enums;

namespace EmailService.Domain.Entities;

public class EmailLog
{
    public int Id { get; set; }
    public string Destinataire { get; set; } = string.Empty;  // adresse email du candidat
    public string Sujet { get; set; } = string.Empty;         // sujet de l'email
    public string Corps { get; set; } = string.Empty;         // contenu de l'email
    public EmailType Type { get; set; }                        // type d'email envoyé
    public EmailStatus Statut { get; set; }                    // statut de l'envoi
    public DateTime DateEnvoi { get; set; } = DateTime.UtcNow; // date d'envoi
    public string? MessageErreur { get; set; }                 // erreur si échec
}