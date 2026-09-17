using EmailService.Domain.Entities;

namespace EmailService.Domain.Interfaces;

public interface IEmailLogRepository
{
    Task AjouterAsync(EmailLog log);
    Task<List<EmailLog>> ObtenirTousAsync();
    Task<EmailLog?> ObtenirParIdAsync(int id);
}