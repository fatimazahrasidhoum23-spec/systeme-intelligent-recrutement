package com.ehei.gi4.application.DTO;

import com.ehei.gi4.application.Enum.CandidatureStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO de consultation pour le RH — liste des candidats préselectionés (use case : Consulter).
 * Inclut le score ATS calculé par le service FastAPI.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CandidaturePreselectionneeDto {
    private int id;
    private String reference;
    private String nom;
    private String email;
    private String poste;
    private LocalDate date;
    private CandidatureStatus status;
    private Double score;
    // Titre de l'offre liée
    private String offreTitre;
}
