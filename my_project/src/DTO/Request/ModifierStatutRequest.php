<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

class ModifierStatutRequest
{
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['planifie', 'confirme', 'annule', 'termine'])]
    public string $statut;
}
