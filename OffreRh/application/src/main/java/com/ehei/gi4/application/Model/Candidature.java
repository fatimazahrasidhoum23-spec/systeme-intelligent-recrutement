package com.ehei.gi4.application.Model;

import com.ehei.gi4.application.Enum.CandidatureStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Candidature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nom;
    private String email;
    private String poste;

    @ManyToOne
    @JoinColumn(name = "offre_id")
    private Offre offre;

    private CandidatureStatus status;

    // ── Champs du diagramme de classes (reference, date, score) ──────────
    private String reference;
    private LocalDate date;
    // Score calculé par le service ATS et persisté via ScoringResultListener
    private Double score;
}
