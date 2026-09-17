<?php

namespace App\MessageHandler;

use App\DTO\Request\PlanifierEntretienRequest;
use App\Message\CandidaturePreselectionneeMessage;
use App\Service\EntretienService;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handler déclenché quand OffreRh publie un candidat accepté dans
 * "candidature.preselectionne.queue".
 *
 * Action : planifie automatiquement un entretien pour ce candidat.
 */
#[AsMessageHandler]
class CandidaturePreselectionneeHandler
{
    public function __construct(
        private readonly EntretienService $entretienService,
        private readonly LoggerInterface  $logger,
    ) {}

    public function __invoke(CandidaturePreselectionneeMessage $message): void
    {
        $this->logger->info(
            '[RabbitMQ] Candidat préselectionné reçu — candidatureId={id} email={email} score={score}',
            [
                'id'    => $message->candidatureId,
                'email' => $message->email,
                'score' => $message->score,
            ]
        );

        // Planifier un entretien automatiquement pour le candidat accepté
        $dto = new PlanifierEntretienRequest();
        // Date dans 7 jours par défaut — le RH pourra la modifier ensuite
        $dto->dateHeure  = (new \DateTimeImmutable('+7 days noon'))
                                ->format(\DateTimeInterface::ATOM);
        $dto->candidatId = (string) $message->candidatureId;
        $dto->lien       = null;

        $entretien = $this->entretienService->planifier($dto);

        $this->logger->info(
            '[RabbitMQ] Entretien planifié automatiquement — entretienId={id} candidatId={cid}',
            [
                'id'  => $entretien->getId(),
                'cid' => $message->candidatureId,
            ]
        );
    }
}
