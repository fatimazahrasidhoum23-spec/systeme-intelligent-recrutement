<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

class AjouterNoteRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 5)]
    public string $contenu;

    #[Assert\NotNull]
    #[Assert\Range(min: 0, max: 100)]
    public int $score;
}