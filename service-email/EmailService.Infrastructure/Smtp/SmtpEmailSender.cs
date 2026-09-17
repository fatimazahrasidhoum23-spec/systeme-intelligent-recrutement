using EmailService.Domain.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace EmailService.Infrastructure.Smtp;

public class SmtpEmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;

    public SmtpEmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task EnvoyerAsync(string destinataire, string sujet, string corps)
    {
        var from = _configuration["Smtp:From"] ?? "noreply@ats-recrutement.com";
        var host = _configuration["Smtp:Host"] ?? "mail-dev";
        var port = int.Parse(_configuration["Smtp:Port"] ?? "1025");

        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(from));
        email.To.Add(MailboxAddress.Parse(destinataire));
        email.Subject = sujet;
        email.Body = new TextPart("html") { Text = corps };

        using var smtp = new SmtpClient();
        // MailDev n'a pas de TLS ni d'auth
        await smtp.ConnectAsync(host, port, SecureSocketOptions.None);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
