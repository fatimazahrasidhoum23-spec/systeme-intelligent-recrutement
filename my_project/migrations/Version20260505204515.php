<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260505204515 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notes DROP FOREIGN KEY `FK_11BA68C548DCEA2`');
        $this->addSql('ALTER TABLE notes ADD score INT DEFAULT NULL');
        $this->addSql('ALTER TABLE notes ADD CONSTRAINT FK_11BA68C548DCEA2 FOREIGN KEY (entretien_id) REFERENCES entretiens (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notes DROP FOREIGN KEY FK_11BA68C548DCEA2');
        $this->addSql('ALTER TABLE notes DROP score');
        $this->addSql('ALTER TABLE notes ADD CONSTRAINT `FK_11BA68C548DCEA2` FOREIGN KEY (entretien_id) REFERENCES entretiens (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
