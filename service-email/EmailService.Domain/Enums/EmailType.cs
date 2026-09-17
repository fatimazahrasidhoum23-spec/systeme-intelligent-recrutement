namespace EmailService.Domain.Enums;

public enum EmailType
{
    ConfirmationPostulation,  // email envoyé quand un candidat postule
    ConfirmationEntretien,    // email envoyé quand un entretien est planifié
    Admission                 // email envoyé pour la décision finale
}