<?php

namespace App\DTO\Response;

use App\Entity\Entretien;

class EntretienResponse
{
    public int $id;
    public string $dateHeure;
    public string $statut;
    public ?string $lien;
    public string $candidatId;

    public static function fromEntity(Entretien $e): self
    {
        $dto = new self();
        $dto->id        = $e->getId();
        $dto->dateHeure = $e->getDateHeure()->format(\DateTimeInterface::ATOM);
        $dto->statut    = $e->getStatut();
        $dto->lien      = $e->getLien();
        $dto->candidatId = $e->getCandidatId();
        return $dto;
    }
}
