namespace EmailService.Domain.Enums;

public enum EmailStatus
{
    EnAttente,  // email créé mais pas encore envoyé
    Envoye,     // email envoyé avec succès
    Echoue      // email qui a échoué (erreur SMTP par exemple)
}