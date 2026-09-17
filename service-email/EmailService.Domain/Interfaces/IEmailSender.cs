namespace EmailService.Domain.Interfaces;

public interface IEmailSender
{
    Task EnvoyerAsync(string destinataire, string sujet, string corps);
}