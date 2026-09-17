package com.ehei.gi4.application.Messaging;

import lombok.*;
import java.io.Serializable;
import java.util.Map;

/**
 * Message reçu depuis "ats.result.queue".
 * Publié par le service ATS (FastAPI) après scoring.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ScoringResultMessage implements Serializable {
    private Integer             candidatureId;
    private String              candidatEmail;
    private Integer             offreId;
    private Double              finalScore;
    private String              grade;
    private String              recommendation;
    private Map<String, Object> breakdown;
    private Boolean             hrAdjusted;
}
