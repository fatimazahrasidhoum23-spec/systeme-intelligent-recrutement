package com.ehei.gi4.application.Messaging;

import lombok.*;
import java.io.Serializable;

/**
 * Message publié dans "email.postulation" quand un candidat postule.
 * Le service-email (.NET) consomme ce message et envoie un email de confirmation.
 *
 * Les champs correspondent exactement à EmailEventDto.cs du service-email.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailPostulationMessage implements Serializable {
    private String Destinataire;   // email du candidat
    private String NomCandidat;    // nom complet
    private String Poste;          // poste de l'offre
    private String TypeEvenement;  // toujours "postulation" ici
}
