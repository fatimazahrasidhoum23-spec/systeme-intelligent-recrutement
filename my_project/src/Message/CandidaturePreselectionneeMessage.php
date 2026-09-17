<?php

namespace App\Message;

/**
 * Message reçu depuis RabbitMQ — publié par OffreRh (Spring Boot)
 * quand le RH valide un candidat (status = ACCEPTEE).
 *
 * Symfony Messenger désérialise automatiquement ce JSON en objet.
 * Le handler planifie ensuite un entretien pour ce candidat.
 *
 * Champs cohérents avec Candidature.java (OffreRh) + CandidaturePreselectionneeDto.java
 */
class CandidaturePreselectionneeMessage
{
    public function __construct(
        public readonly int     $candidatureId,
        public readonly string  $nom,
        public readonly string  $email,
        public readonly string  $poste,
        public readonly ?float  $score       = null,
        public readonly ?string $offreTitre  = null,
        public readonly ?string $reference   = null,
    ) {}
}
