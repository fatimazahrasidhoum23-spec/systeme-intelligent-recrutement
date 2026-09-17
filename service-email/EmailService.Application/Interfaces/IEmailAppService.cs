using EmailService.Application.DTOs;

namespace EmailService.Application.Interfaces;

public interface IEmailAppService
{
    Task TraiterEvenementAsync(EmailEventDto evenement);
    Task<List<object>> ObtenirLogsAsync();
}