using EmailService.Domain.Enums;

namespace EmailService.Domain.Entities;

public class EmailTemplate
{
    public int Id { get; set; }
    public EmailType Type { get; set; }                    // pour quel type d'email
    public string Sujet { get; set; } = string.Empty;     // sujet du template
    public string Corps { get; set; } = string.Empty;     // corps du template
    public bool EstActif { get; set; } = true;            // template actif ou non
}