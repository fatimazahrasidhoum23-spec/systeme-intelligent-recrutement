package com.ehei.gi4.application.Messaging;

import lombok.*;
import java.io.Serializable;

/**
 * Message publié dans "ats.scoring.queue".
 * Le service ATS (FastAPI) le consomme pour effectuer le scoring CV/Offre.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ScoringRequestMessage implements Serializable {
    private Integer candidatureId;
    private String  candidatEmail;
    private String  candidatNom;
    private String  cvUrl;               // URL MinIO du CV
    private Integer offreId;
    private String  offreTitre;
    private String  offreDescription;
}
