package com.ehei.gi4.application.Service;

import com.ehei.gi4.application.DTO.CandidatureCreateDto;
import com.ehei.gi4.application.DTO.CandidaturePreselectionneeDto;
import com.ehei.gi4.application.DTO.CandidatureUpdateDto;
import com.ehei.gi4.application.DTO.DecisionCandidatureDto;
import com.ehei.gi4.application.Enum.CandidatureStatus;
import com.ehei.gi4.application.Mapper.CandidatureMapper;
import com.ehei.gi4.application.Messaging.EmailPostulationMessage;
import com.ehei.gi4.application.Messaging.ScoringPublisher;
import com.ehei.gi4.application.Messaging.ScoringRequestMessage;
import com.ehei.gi4.application.Model.Candidature;
import com.ehei.gi4.application.Model.Offre;
import com.ehei.gi4.application.Repository.CandidatureRepository;
import com.ehei.gi4.application.Repository.OffreRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final OffreRepository offreRepository;
    private final ScoringPublisher scoringPublisher;

    public Candidature AddCandidature(CandidatureCreateDto Dto) {
        Candidature candidature = CandidatureMapper.ToEntity(Dto);
        Candidature saved = candidatureRepository.save(candidature);

        // Publier vers ATS pour le scoring
        ScoringRequestMessage scoringMsg = ScoringRequestMessage.builder()
                .candidatureId(saved.getId())
                .candidatEmail(saved.getEmail())
                .candidatNom(saved.getNom())
                .cvUrl(Dto.getCvUrl() != null ? Dto.getCvUrl() : "")
                .offreId(0)
                .offreTitre(saved.getPoste())
                .offreDescription(saved.getPoste())
                .build();
        scoringPublisher.publishScoringRequest(scoringMsg);

        // Publier vers service-email pour confirmation
        EmailPostulationMessage emailMsg = EmailPostulationMessage.builder()
                .Destinataire(saved.getEmail())
                .NomCandidat(saved.getNom())
                .Poste(saved.getPoste())
                .TypeEvenement("postulation")
                .build();
        scoringPublisher.publishEmailPostulation(emailMsg);

        return saved;
    }

    public Candidature UpdateCandidature(CandidatureUpdateDto Dto) {
        Candidature candidature = candidatureRepository.findById(Dto.getId()).orElse(null);
        if (candidature != null) {
            CandidatureMapper.UpdateFromEntity(Dto, candidature);
            return candidatureRepository.save(candidature);
        }
        return null;
    }

    public void DeleteCandidature(int id) {
        candidatureRepository.deleteById(id);
    }

    public List<Candidature> getAllCandidature() {
        return candidatureRepository.findAll();
    }

    public Candidature getCandidatureById(int id) {
        return candidatureRepository.findById(id).orElse(null);
    }

    public Candidature Postuler(int offreId, CandidatureCreateDto dto) {
        Offre offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        Candidature candidature = new Candidature();
        candidature.setOffre(offre);
        candidature.setNom(dto.getNom());
        candidature.setEmail(dto.getEmail());
        candidature.setPoste(dto.getPoste());
        candidature.setStatus(CandidatureStatus.EN_ATTENTE);

        Candidature saved = candidatureRepository.save(candidature);

        // Publier vers ATS (FastAPI) pour le scoring
        ScoringRequestMessage scoringMsg = ScoringRequestMessage.builder()
                .candidatureId(saved.getId())
                .candidatEmail(saved.getEmail())
                .candidatNom(saved.getNom())
                .cvUrl(dto.getCvUrl())
                .offreId(offre.getId())
                .offreTitre(offre.getTitre())
                .offreDescription(offre.getDescription())
                .build();
        scoringPublisher.publishScoringRequest(scoringMsg);

        // Publier vers service-email pour confirmation
        EmailPostulationMessage emailMsg = EmailPostulationMessage.builder()
                .Destinataire(saved.getEmail())
                .NomCandidat(saved.getNom())
                .Poste(saved.getPoste())
                .TypeEvenement("postulation")
                .build();
        scoringPublisher.publishEmailPostulation(emailMsg);

        return saved;
    }

    // ── Gérer Candidat préselectionné (use case RH) ───────────────────────

    /**
     * Consulter : retourne les candidatures EN_ATTENTE avec leur score ATS.
     * Le RH voit ainsi les candidats classés pour prendre une décision.
     */
    public List<CandidaturePreselectionneeDto> getPreselectionnees() {
        return candidatureRepository.findByStatus(CandidatureStatus.EN_ATTENTE)
                .stream()
                .map(c -> CandidaturePreselectionneeDto.builder()
                        .id(c.getId())
                        .reference(c.getReference())
                        .nom(c.getNom())
                        .email(c.getEmail())
                        .poste(c.getPoste())
                        .date(c.getDate())
                        .status(c.getStatus())
                        .score(c.getScore())
                        .offreTitre(c.getOffre() != null ? c.getOffre().getTitre() : null)
                        .build())
                .sorted((a, b) -> Double.compare(
                        b.getScore() != null ? b.getScore() : 0.0,
                        a.getScore() != null ? a.getScore() : 0.0))
                .collect(Collectors.toList());
    }

    /**
     * Valider : passe la candidature en ACCEPTEE.
     * Use case "Valider" dans Gérer Candidat préselectionné.
     */
    public Candidature valider(DecisionCandidatureDto dto) {
        Candidature candidature = candidatureRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée : " + dto.getId()));
        candidature.setStatus(CandidatureStatus.ACCEPTEE);
        Candidature saved = candidatureRepository.save(candidature);

        // Notifier Symfony pour planifier un entretien automatiquement
        scoringPublisher.publishCandidaturePreselectionnee(
                saved.getId(),
                saved.getNom(),
                saved.getEmail(),
                saved.getPoste(),
                saved.getScore(),
                saved.getOffre() != null ? saved.getOffre().getTitre() : null,
                saved.getReference()
        );

        return saved;
    }

    /**
     * Éliminer : passe la candidature en REFUSEE.
     * Use case "Eliminer" dans Gérer Candidat préselectionné.
     */
    public Candidature eliminer(DecisionCandidatureDto dto) {
        Candidature candidature = candidatureRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée : " + dto.getId()));
        candidature.setStatus(CandidatureStatus.REFUSEE);
        return candidatureRepository.save(candidature);
    }

    /**
     * Appelé par ScoringResultListener quand le score ATS arrive via RabbitMQ.
     * Persiste le score sur la candidature.
     */
    public void enregistrerScore(int candidatureId, double score) {
        candidatureRepository.findById(candidatureId).ifPresent(c -> {
            c.setScore(score);
            candidatureRepository.save(c);
        });
    }

    // ── Suivi candidature — appelé par le front Angular (candidat) ────────

    public List<Candidature> findByNom(String nom) {
        return candidatureRepository.findByNomContainingIgnoreCase(nom);
    }

    public List<Candidature> findByEmail(String email) {
        return candidatureRepository.findByEmailIgnoreCase(email);
    }
}
