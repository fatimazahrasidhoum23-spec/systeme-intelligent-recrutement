<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'notes')]
class Note
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'text')]
    private string $contenu;

    #[ORM\ManyToOne(targetEntity: Entretien::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Entretien $entretien;

    #[ORM\Column(length: 100)]
    private string $auteurId;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $score = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getContenu(): string { return $this->contenu; }
    public function setContenu(string $c): static { $this->contenu = $c; return $this; }
    public function getEntretien(): Entretien { return $this->entretien; }
    public function setEntretien(Entretien $e): static { $this->entretien = $e; return $this; }
    public function getAuteurId(): string { return $this->auteurId; }
    public function setAuteurId(string $a): static { $this->auteurId = $a; return $this; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
    public function getScore(): ?int { return $this->score; }
    public function setScore(?int $s): static { $this->score = $s; return $this; }
}