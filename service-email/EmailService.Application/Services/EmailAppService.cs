using EmailService.Application.DTOs;
using EmailService.Application.Interfaces;
using EmailService.Domain.Entities;
using EmailService.Domain.Enums;
using EmailService.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Globalization;

namespace EmailService.Application.Services;

public class EmailAppService : IEmailAppService
{
    private readonly IEmailSender _emailSender;
    private readonly IEmailLogRepository _emailLogRepository;
    private readonly IEmailTemplateRepository _emailTemplateRepository;
    private readonly IConfiguration _configuration;

    public EmailAppService(
        IEmailSender emailSender,
        IEmailLogRepository emailLogRepository,
        IEmailTemplateRepository emailTemplateRepository,
        IConfiguration configuration)
    {
        _emailSender = emailSender;
        _emailLogRepository = emailLogRepository;
        _emailTemplateRepository = emailTemplateRepository;
        _configuration = configuration;
    }

    public async Task TraiterEvenementAsync(EmailEventDto evenement)
    {
        // 1. Déterminer le type d'email selon l'événement reçu — AJOUT inscription
        var type = evenement.TypeEvenement.ToLower() switch
        {
            "postulation" => EmailType.ConfirmationPostulation,
            "entretien"   => EmailType.ConfirmationEntretien,
            "admission"   => EmailType.Admission,
            "inscription" => EmailType.ConfirmationPostulation, // template de bienvenue — à adapter
            _ => throw new ArgumentException($"Type inconnu : {evenement.TypeEvenement}")
        };

        // 2. Récupérer le template correspondant en base
        var template = await _emailTemplateRepository.ObtenirParTypeAsync(type);
        if (template == null)
            throw new InvalidOperationException($"Template introuvable pour le type {type}");

        // 3. Récupérer le nom de l'entreprise depuis la configuration
        var nomEntreprise = _configuration["NomEntreprise"] ?? "ATS Recrutement";

        // 4. Préparer le sujet (remplacer les placeholders)
        var sujet = RemplacerPlaceholders(template.Sujet, evenement, nomEntreprise);

        // 5. Préparer le corps (remplacer les placeholders)
        var corps = RemplacerPlaceholders(template.Corps, evenement, nomEntreprise);

        // 6. Créer le log avec statut EnAttente
        var log = new EmailLog
        {
            Destinataire = evenement.Destinataire,
            Sujet = sujet,
            Corps = corps,
            Type = type,
            Statut = EmailStatus.EnAttente,
            DateEnvoi = DateTime.UtcNow
        };

        try
        {
            // 7. Envoyer l'email
            await _emailSender.EnvoyerAsync(evenement.Destinataire, sujet, corps);
            log.Statut = EmailStatus.Envoye;
        }
        catch (Exception ex)
        {
            // 8. En cas d'échec, enregistrer l'erreur
            log.Statut = EmailStatus.Echoue;
            log.MessageErreur = ex.Message;
        }
        finally
        {
            // 9. Toujours sauvegarder le log
            await _emailLogRepository.AjouterAsync(log);
        }
    }

    /// <summary>
    /// Remplace les placeholders {NomCandidat}, {Poste}, {DateEntretien}, {LieuEntretien}, {NomEntreprise}
    /// dans un texte (sujet ou corps de template).
    /// </summary>
    private string RemplacerPlaceholders(string texte, EmailEventDto evt, string nomEntreprise)
    {
        var dateFormatee = evt.DateEntretien.HasValue
            ? evt.DateEntretien.Value.ToString("dddd dd MMMM yyyy 'à' HH'h'mm",
                new CultureInfo("fr-FR"))
            : string.Empty;

        return texte
            .Replace("{NomCandidat}", evt.NomCandidat)
            .Replace("{Poste}", evt.Poste)
            .Replace("{DateEntretien}", dateFormatee)
            .Replace("{LieuEntretien}", evt.LieuEntretien ?? string.Empty)
            .Replace("{NomEntreprise}", nomEntreprise);
    }

    public async Task<List<object>> ObtenirLogsAsync()
    {
        var logs = await _emailLogRepository.ObtenirTousAsync();
        return logs.Cast<object>().ToList();
    }
}