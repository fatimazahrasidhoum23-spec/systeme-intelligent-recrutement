using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;

namespace AuthService.Messaging;

/// <summary>
/// Publie des événements RabbitMQ depuis le service d'authentification.
/// Actuellement : envoie un email de bienvenue quand un user s'inscrit.
/// </summary>
public class AuthEventPublisher : IAsyncDisposable
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthEventPublisher> _logger;
    private IConnection? _connection;
    private IChannel? _channel;

    // Noms cohérents avec les autres services
    private const string Exchange        = "ats.exchange";
    private const string AuthRoutingKey  = "email.auth";
    private const string AuthQueue       = "email.auth.queue";

    public AuthEventPublisher(IConfiguration configuration, ILogger<AuthEventPublisher> logger)
    {
        _configuration = configuration;
        _logger        = logger;
    }

    private async Task EnsureConnectedAsync()
    {
        if (_connection is { IsOpen: true }) return;

        var factory = new ConnectionFactory
        {
            HostName = _configuration["RabbitMQ:Host"]     ?? "localhost",
            Port     = int.Parse(_configuration["RabbitMQ:Port"] ?? "5672"),
            UserName = _configuration["RabbitMQ:Username"] ?? "guest",
            Password = _configuration["RabbitMQ:Password"] ?? "guest"
        };

        _connection = await factory.CreateConnectionAsync();
        _channel    = await _connection.CreateChannelAsync();

        // Déclaration idempotente (sûr si Spring Boot a déjà créé l'exchange)
        await _channel.ExchangeDeclareAsync(Exchange, ExchangeType.Topic, durable: true);
        await _channel.QueueDeclareAsync(AuthQueue, durable: true, exclusive: false, autoDelete: false);
        await _channel.QueueBindAsync(AuthQueue, Exchange, AuthRoutingKey);
    }

    /// <summary>
    /// Publie un événement "bienvenue" dans email.auth.queue après inscription.
    /// Le service-email (.NET) consommera ce message et enverra l'email.
    /// </summary>
    public async Task PublierInscriptionAsync(string email, string nom, string prenom)
    {
        try
        {
            await EnsureConnectedAsync();

            // Structure compatible avec EmailEventDto.cs du service-email
            var payload = new
            {
                Destinataire   = email,
                NomCandidat    = $"{prenom} {nom}",
                Poste          = string.Empty,
                TypeEvenement  = "inscription"   // le service-email peut ajouter ce type
            };

            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload));

            var props = new BasicProperties { Persistent = true, ContentType = "application/json" };

            await _channel!.BasicPublishAsync(
                exchange:   Exchange,
                routingKey: AuthRoutingKey,
                mandatory:  false,
                basicProperties: props,
                body:       body
            );

            _logger.LogInformation("[RabbitMQ] Événement inscription publié → {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError("[RabbitMQ] Erreur publication inscription : {M}", ex.Message);
            // On ne lève pas l'exception — l'inscription réussit même si RabbitMQ est down
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel is not null) await _channel.DisposeAsync();
        if (_connection is not null) await _connection.DisposeAsync();
    }
}
