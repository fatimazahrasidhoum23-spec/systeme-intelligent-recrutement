<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260505144039 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE candidat_blacklist (id INT AUTO_INCREMENT NOT NULL, candidat_id VARCHAR(100) NOT NULL, raison LONGTEXT NOT NULL, blacklisted_at DATETIME NOT NULL, blacklisted_by VARCHAR(100) NOT NULL, UNIQUE INDEX UNIQ_CB5846C78D0EB82 (candidat_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE entretiens (id INT AUTO_INCREMENT NOT NULL, date_heure DATETIME NOT NULL, statut VARCHAR(50) NOT NULL, lien VARCHAR(255) DEFAULT NULL, candidat_id VARCHAR(100) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE notes (id INT AUTO_INCREMENT NOT NULL, contenu LONGTEXT NOT NULL, auteur_id VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL, entretien_id INT NOT NULL, INDEX IDX_11BA68C548DCEA2 (entretien_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE notes ADD CONSTRAINT FK_11BA68C548DCEA2 FOREIGN KEY (entretien_id) REFERENCES entretiens (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notes DROP FOREIGN KEY FK_11BA68C548DCEA2');
        $this->addSql('DROP TABLE candidat_blacklist');
        $this->addSql('DROP TABLE entretiens');
        $this->addSql('DROP TABLE notes');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
