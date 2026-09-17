package com.ehei.gi4.application.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO pour les actions RH : Valider (ACCEPTEE) ou Éliminer (REFUSEE) un candidat.
 * Use case "Gérer Candidat préselectionné" — actions Valider et Eliminer.
 */
@Getter
@Setter
public class DecisionCandidatureDto {

    @NotNull(message = "L'ID de la candidature est requis")
    private Integer id;

    /** Commentaire optionnel du RH justifiant la décision */
    private String commentaire;
}
