using System.Text;
using System.Text.Json;
using EmailService.Application.DTOs;
using EmailService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace EmailService.Infrastructure.Messaging;

public class RabbitMqConsumer : BackgroundService
{
    private readonly IConfiguration _configuration;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<RabbitMqConsumer> _logger;
    private IConnection? _connection;
    private IChannel? _channel;

    // les queues qu'on écoute — AJOUT de email.auth.queue (événements Auth service)
    private readonly string[] _queues = ["email.postulation", "email.entretien", "email.admission", "email.auth.queue"];

    public RabbitMqConsumer(
        IConfiguration configuration,
        IServiceProvider serviceProvider,
        ILogger<RabbitMqConsumer> logger)
    {
        _configuration = configuration;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // retry automatique si RabbitMQ n'est pas encore prêt
        for (int tentative = 1; tentative <= 5; tentative++)
        {
            try
            {
                var factory = new ConnectionFactory
                {
                    HostName = _configuration["RabbitMQ:Host"] ?? "localhost",
                    Port = int.Parse(_configuration["RabbitMQ:Port"] ?? "5672"),
                    UserName = _configuration["RabbitMQ:Username"] ?? "guest",
                    Password = _configuration["RabbitMQ:Password"] ?? "guest"
                };

                _connection = await factory.CreateConnectionAsync(stoppingToken);
                _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

                // déclarer et écouter chaque queue
                foreach (var queue in _queues)
                {
                    await _channel.QueueDeclareAsync(
                        queue, durable: true, exclusive: false,
                        autoDelete: false, cancellationToken: stoppingToken);

                    var consumer = new AsyncEventingBasicConsumer(_channel);
                    consumer.ReceivedAsync += async (_, ea) =>
                    {
                        await TraiterMessageAsync(ea, queue);
                    };

                    await _channel.BasicConsumeAsync(
                        queue, autoAck: true, consumer: consumer,
                        cancellationToken: stoppingToken);
                }

                _logger.LogInformation("✅ RabbitMQ connecté — écoute des queues actives");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⏳ RabbitMQ tentative {T}/5 : {M}", tentative, ex.Message);
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        // maintenir le service actif
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    private async Task TraiterMessageAsync(BasicDeliverEventArgs ea, string queue)
    {
        try
        {
            var json = Encoding.UTF8.GetString(ea.Body.ToArray());
            var evenement = JsonSerializer.Deserialize<EmailEventDto>(json);

            if (evenement == null) return;

            // déterminer le type selon la queue — AJOUT email.auth.queue
            evenement.TypeEvenement = queue switch
            {
                "email.postulation" => "postulation",
                "email.entretien"   => "entretien",
                "email.admission"   => "admission",
                "email.auth.queue"  => "inscription",
                _                   => evenement.TypeEvenement
            };

            // utiliser un scope pour récupérer le service
            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailAppService>();
            await emailService.TraiterEvenementAsync(evenement);

            _logger.LogInformation("✅ Email traité pour {D}", evenement.Destinataire);
        }
        catch (Exception ex)
        {
            _logger.LogError("❌ Erreur traitement message : {M}", ex.Message);
        }
    }

    public override void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
        base.Dispose();
    }
}