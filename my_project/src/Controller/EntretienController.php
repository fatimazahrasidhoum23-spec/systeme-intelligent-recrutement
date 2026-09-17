<?php

namespace App\Controller;

use App\DTO\Request\AjouterNoteRequest;
use App\DTO\Request\ModifierStatutRequest;
use App\DTO\Request\PlanifierEntretienRequest;
use App\DTO\Response\EntretienResponse;
use App\Service\EntretienService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/entretiens', name: 'entretien_')]
class EntretienController extends AbstractController
{
    public function __construct(
        private readonly EntretienService    $service,
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface  $validator,
    ) {}

    // POST /api/entretiens — planifier un entretien
    #[Route('', name: 'planifier', methods: ['POST'])]
    public function planifier(Request $request): JsonResponse
    {
        $dto = $this->deserializeAndValidate($request, PlanifierEntretienRequest::class);
        $entretien = $this->service->planifier($dto);
        return $this->json(EntretienResponse::fromEntity($entretien), Response::HTTP_CREATED);
    }

    // GET /api/entretiens — lister tous les entretiens
    #[Route('', name: 'liste', methods: ['GET'])]
    public function liste(): JsonResponse
    {
        $entretiens = $this->service->listerTous();
        return $this->json(
            array_map(fn($e) => EntretienResponse::fromEntity($e), $entretiens)
        );
    }

    // GET /api/entretiens/{id} — consulter un entretien
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $entretien = $this->service->trouver($id);
        return $this->json(EntretienResponse::fromEntity($entretien));
    }

    // PUT /api/entretiens/{id} — modifier date/lieu
    #[Route('/{id}', name: 'modifier', methods: ['PUT'])]
    public function modifier(int $id, Request $request): JsonResponse
    {
        $dto = $this->deserializeAndValidate($request, PlanifierEntretienRequest::class);
        $entretien = $this->service->modifier($id, $dto);
        return $this->json(EntretienResponse::fromEntity($entretien));
    }

    // PATCH /api/entretiens/{id}/statut — modifier le statut
    #[Route('/{id}/statut', name: 'modifier_statut', methods: ['PATCH'])]
    public function modifierStatut(int $id, Request $request): JsonResponse
    {
        $dto = $this->deserializeAndValidate($request, ModifierStatutRequest::class);
        $entretien = $this->service->modifierStatut($id, $dto);
        return $this->json(EntretienResponse::fromEntity($entretien));
    }

    // POST /api/entretiens/{id}/notes — ajouter une note
    #[Route('/{id}/notes', name: 'ajouter_note', methods: ['POST'])]
    public function ajouterNote(int $id, Request $request): JsonResponse
    {
        $dto = $this->deserializeAndValidate($request, AjouterNoteRequest::class);
        $auteurId = $request->headers->get('X-User-Id', 'anonyme');
        $note = $this->service->ajouterNote($id, $dto, $auteurId);
        return $this->json([
            'id'        => $note->getId(),
            'contenu'   => $note->getContenu(),
            'auteurId'  => $note->getAuteurId(),
            'score'     => $note->getScore(),
            'createdAt' => $note->getCreatedAt()->format(\DateTimeInterface::ATOM),
        ], Response::HTTP_CREATED);
    }

    // GET /api/entretiens/{id}/notes — lister les notes
    #[Route('/{id}/notes', name: 'liste_notes', methods: ['GET'])]
    public function listeNotes(int $id): JsonResponse
    {
        $notes = $this->service->listerNotes($id);
        return $this->json(
            array_map(fn($n) => [
                'id'        => $n->getId(),
                'contenu'   => $n->getContenu(),
                'auteurId'  => $n->getAuteurId(),
                'score'     => $n->getScore(),
                'createdAt' => $n->getCreatedAt()->format(\DateTimeInterface::ATOM),
            ], $notes)
        );
    }

    // DELETE /api/entretiens/{id} — supprimer un entretien
    #[Route('/{id}', name: 'supprimer', methods: ['DELETE'])]
    public function supprimer(int $id): JsonResponse
    {
        $this->service->supprimer($id);
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function deserializeAndValidate(Request $request, string $class): object
    {
        $dto = $this->serializer->deserialize($request->getContent(), $class, 'json');
        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $e) {
                $messages[$e->getPropertyPath()] = $e->getMessage();
            }
            throw new \Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException(
                json_encode($messages)
            );
        }
        return $dto;
    }
}