using EmailService.Domain.Entities;
using EmailService.Domain.Enums;

namespace EmailService.Domain.Interfaces;

public interface IEmailTemplateRepository
{
    Task<EmailTemplate?> ObtenirParTypeAsync(EmailType type);
    Task AjouterAsync(EmailTemplate template);
}