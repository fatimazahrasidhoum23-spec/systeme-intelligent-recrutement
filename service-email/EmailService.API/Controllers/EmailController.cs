using EmailService.Application.DTOs;
using EmailService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmailService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]                          // ← Tout le controller nécessite un JWT valide
public class EmailController : ControllerBase
{
    private readonly IEmailAppService _emailAppService;
    private readonly ILogger<EmailController> _logger;

    public EmailController(IEmailAppService emailAppService, ILogger<EmailController> logger)
    {
        _emailAppService = emailAppService;
        _logger = logger;
    }

    /// <summary>
    /// Récupère tous les logs d'emails envoyés — RH et Technique uniquement
    /// </summary>
    [HttpGet("logs")]
    [Authorize(Roles = "RH,Technique")]
    public async Task<IActionResult> ObtenirLogs()
    {
        var logs = await _emailAppService.ObtenirLogsAsync();
        return Ok(logs);
    }

    /// <summary>
    /// Teste l'envoi d'un email manuellement (sans RabbitMQ) — RH uniquement
    /// </summary>
    [HttpPost("test")]
    [Authorize(Roles = "RH")]
    public async Task<IActionResult> TestEnvoi([FromBody] EmailEventDto evenement)
    {
        try
        {
            await _emailAppService.TraiterEvenementAsync(evenement);
            return Ok(new { message = "Email traité avec succès", destinataire = evenement.Destinataire });
        }
        catch (Exception ex)
        {
            _logger.LogError("Erreur test envoi : {M}", ex.Message);
            return BadRequest(new { erreur = ex.Message });
        }
    }

    /// <summary>
    /// Healthcheck — public, pas de token requis
    /// </summary>
    [HttpGet("health")]
    [AllowAnonymous]
    public IActionResult Health()
    {
        return Ok(new { statut = "OK", service = "EmailService", heure = DateTime.UtcNow });
    }
}
