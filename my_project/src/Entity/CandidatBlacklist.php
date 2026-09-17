<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'candidat_blacklist')]
class CandidatBlacklist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    private string $candidatId;

    #[ORM\Column(type: 'text')]
    private string $raison;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $blacklistedAt;

    #[ORM\Column(length: 100)]
    private string $blacklistedBy;

    public function __construct()
    {
        $this->blacklistedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getCandidatId(): string { return $this->candidatId; }
    public function setCandidatId(string $c): static { $this->candidatId = $c; return $this; }
    public function getRaison(): string { return $this->raison; }
    public function setRaison(string $r): static { $this->raison = $r; return $this; }
    public function getBlacklistedAt(): \DateTimeImmutable { return $this->blacklistedAt; }
    public function getBlacklistedBy(): string { return $this->blacklistedBy; }
    public function setBlacklistedBy(string $b): static { $this->blacklistedBy = $b; return $this; }
}
