package com.ehei.gi4.application.Repository;

import com.ehei.gi4.application.Enum.CandidatureStatus;
import com.ehei.gi4.application.Model.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Integer> {

    List<Candidature> findByStatus(CandidatureStatus status);
    List<Candidature> findByOffreId(int offreId);

    // ── Suivi candidature par le front Angular (candidat) ─────────────────
    List<Candidature> findByNomContainingIgnoreCase(String nom);
    List<Candidature> findByEmailIgnoreCase(String email);
}
