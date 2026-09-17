using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EmailService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Destinataire = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Sujet = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Corps = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Statut = table.Column<string>(type: "text", nullable: false),
                    DateEnvoi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MessageErreur = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Sujet = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Corps = table.Column<string>(type: "text", nullable: false),
                    EstActif = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTemplates", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "EmailTemplates",
                columns: new[] { "Id", "Corps", "EstActif", "Sujet", "Type" },
                values: new object[,]
                {
                    { 1, "Bonjour {NomCandidat},\n\nNous avons bien reçu votre candidature pour le poste de {Poste}.\n\nVotre dossier sera étudié avec attention et nous vous contacterons prochainement pour vous tenir informé(e) de la suite du processus.\n\nNous vous remercions de l'intérêt que vous portez à notre entreprise.\n\nCordialement,\n{NomEntreprise}", true, "Confirmation de votre candidature – {Poste}", "ConfirmationPostulation" },
                    { 2, "Bonjour {NomCandidat},\n\nNous avons le plaisir de vous confirmer votre entretien pour le poste de {Poste}.\n\nDate : {DateEntretien}\nLieu : {LieuEntretien}\n\nNous vous remercions de bien vouloir vous présenter à l'heure prévue.\n\nN'hésitez pas à nous contacter pour toute information complémentaire.\n\nCordialement,\n{NomEntreprise}", true, "Confirmation de votre entretien – {Poste}", "ConfirmationEntretien" },
                    { 3, "Bonjour {NomCandidat},\n\nNous avons le plaisir de vous informer que votre candidature pour le poste de {Poste} a été retenue avec succès.\n\nVotre profil a particulièrement retenu notre attention et correspond aux attentes du poste.\n\nNous vous contacterons prochainement afin de vous communiquer les prochaines étapes du processus.\n\nCordialement,\n{NomEntreprise}", true, "Félicitations – Votre candidature a été retenue – {Poste}", "Admission" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailLogs");

            migrationBuilder.DropTable(
                name: "EmailTemplates");
        }
    }
}
