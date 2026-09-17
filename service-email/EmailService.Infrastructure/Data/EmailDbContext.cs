using EmailService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmailService.Infrastructure.Data;

public class EmailDbContext : DbContext
{
    public EmailDbContext(DbContextOptions<EmailDbContext> options) : base(options) { }

    public DbSet<EmailLog> EmailLogs { get; set; }
    public DbSet<EmailTemplate> EmailTemplates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // configuration table EmailLogs
        modelBuilder.Entity<EmailLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Destinataire).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Sujet).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Corps).IsRequired();
            entity.Property(e => e.Type).HasConversion<string>();
            entity.Property(e => e.Statut).HasConversion<string>();
        });

        // configuration table EmailTemplates
        modelBuilder.Entity<EmailTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Sujet).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Corps).IsRequired();
            entity.Property(e => e.Type).HasConversion<string>();
        });

        // ─── Seed des 3 templates ───
        modelBuilder.Entity<EmailTemplate>().HasData(
            new EmailTemplate
            {
                Id = 1,
                Type = Domain.Enums.EmailType.ConfirmationPostulation,
                Sujet = "Confirmation de votre candidature – {Poste}",
                Corps = "Bonjour {NomCandidat},\n\n" +
                        "Nous avons bien reçu votre candidature pour le poste de {Poste}.\n\n" +
                        "Votre dossier sera étudié avec attention et nous vous contacterons prochainement " +
                        "pour vous tenir informé(e) de la suite du processus.\n\n" +
                        "Nous vous remercions de l'intérêt que vous portez à notre entreprise.\n\n" +
                        "Cordialement,\n{NomEntreprise}",
                EstActif = true
            },
            new EmailTemplate
            {
                Id = 2,
                Type = Domain.Enums.EmailType.ConfirmationEntretien,
                Sujet = "Confirmation de votre entretien – {Poste}",
                Corps = "Bonjour {NomCandidat},\n\n" +
                        "Nous avons le plaisir de vous confirmer votre entretien pour le poste de {Poste}.\n\n" +
                        "Date : {DateEntretien}\n" +
                        "Lieu : {LieuEntretien}\n\n" +
                        "Nous vous remercions de bien vouloir vous présenter à l'heure prévue.\n\n" +
                        "N'hésitez pas à nous contacter pour toute information complémentaire.\n\n" +
                        "Cordialement,\n{NomEntreprise}",
                EstActif = true
            },
            new EmailTemplate
            {
                Id = 3,
                Type = Domain.Enums.EmailType.Admission,
                Sujet = "Félicitations – Votre candidature a été retenue – {Poste}",
                Corps = "Bonjour {NomCandidat},\n\n" +
                        "Nous avons le plaisir de vous informer que votre candidature pour le poste de {Poste} " +
                        "a été retenue avec succès.\n\n" +
                        "Votre profil a particulièrement retenu notre attention et correspond aux attentes du poste.\n\n" +
                        "Nous vous contacterons prochainement afin de vous communiquer les prochaines étapes " +
                        "du processus.\n\n" +
                        "Cordialement,\n{NomEntreprise}",
                EstActif = true
            }
        );
    }
}