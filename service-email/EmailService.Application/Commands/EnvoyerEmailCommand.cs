using MediatR;

namespace EmailService.Application.Commands;

public class EnvoyerEmailCommand : IRequest<bool>
{
    public string Destinataire { get; set; } = string.Empty;
    public string NomCandidat { get; set; } = string.Empty;
    public string Poste { get; set; } = string.Empty;
    public string TypeEvenement { get; set; } = string.Empty;
}