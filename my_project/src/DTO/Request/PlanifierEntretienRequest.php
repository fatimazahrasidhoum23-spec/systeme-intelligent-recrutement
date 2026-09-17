<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

class PlanifierEntretienRequest
{
    #[Assert\NotBlank]
    #[Assert\DateTime(format: \DateTimeInterface::ATOM)]
    public string $dateHeure;

    #[Assert\NotBlank]
    public string $candidatId;

    #[Assert\Url]
    public ?string $lien = null;
}
