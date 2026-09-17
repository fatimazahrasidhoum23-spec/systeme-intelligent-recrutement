<?php

namespace App\Service;

use App\DTO\Request\AjouterNoteRequest;
use App\DTO\Request\ModifierStatutRequest;
use App\DTO\Request\PlanifierEntretienRequest;
use App\Entity\Entretien;
use App\Entity\Note;
use App\Repository\Doctrine\EntretienRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EntretienService
{
    public function __construct(
        private readonly EntretienRepository    $entretienRepo,
        private readonly EntityManagerInterface $em,
    ) {}

    public function planifier(PlanifierEntretienRequest $dto): Entretien
    {
        $entretien = new Entretien();
        $entretien->setDateHeure(new \DateTimeImmutable($dto->dateHeure));
        $entretien->setCandidatId($dto->candidatId);
        $entretien->setLien($dto->lien);
        $entretien->setStatut('planifie');
        $this->entretienRepo->save($entretien);
        return $entretien;
    }

    public function listerTous(): array
    {
        return $this->entretienRepo->findAll();
    }

    public function trouver(int $id): Entretien
    {
        return $this->findOrFail($id);
    }

    public function modifier(int $id, PlanifierEntretienRequest $dto): Entretien
    {
        $entretien = $this->findOrFail($id);
        $entretien->setDateHeure(new \DateTimeImmutable($dto->dateHeure));
        $entretien->setCandidatId($dto->candidatId);
        $entretien->setLien($dto->lien);
        $this->entretienRepo->save($entretien);
        return $entretien;
    }

    public function modifierStatut(int $id, ModifierStatutRequest $dto): Entretien
    {
        $entretien = $this->findOrFail($id);
        $entretien->setStatut($dto->statut);
        $this->entretienRepo->save($entretien);
        return $entretien;
    }

    public function ajouterNote(int $id, AjouterNoteRequest $dto, string $auteurId): Note
    {
        $entretien = $this->findOrFail($id);
        $note = new Note();
        $note->setContenu($dto->contenu);
        $note->setEntretien($entretien);
        $note->setAuteurId($auteurId);
        $note->setScore($dto->score);
        $this->em->persist($note);
        $this->em->flush();
        return $note;
    }

    public function listerNotes(int $id): array
    {
        $entretien = $this->findOrFail($id);
        return $this->em->getRepository(Note::class)->findBy(
            ['entretien' => $entretien]
        );
    }

    public function supprimer(int $id): void
    {
        $entretien = $this->findOrFail($id);
        $this->entretienRepo->delete($entretien);
    }

    private function findOrFail(int $id): Entretien
    {
        $entretien = $this->entretienRepo->find($id);
        if (!$entretien) {
            throw new NotFoundHttpException("Entretien $id introuvable.");
        }
        return $entretien;
    }
}