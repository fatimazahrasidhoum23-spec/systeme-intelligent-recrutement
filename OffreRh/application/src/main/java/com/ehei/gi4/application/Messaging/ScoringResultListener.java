package com.ehei.gi4.application.Messaging;

import com.ehei.gi4.application.Config.RabbitMQConfig;
import com.ehei.gi4.application.Service.CandidatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Écoute "ats.result.queue" — reçoit les scores calculés par le service ATS (FastAPI).
 * Persiste le score sur la Candidature pour permettre au RH de consulter
 * les candidats préselectionés triés par score.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ScoringResultListener {

    private final CandidatureService candidatureService;

    @RabbitListener(queues = RabbitMQConfig.RESULT_QUEUE)
    public void onScoringResult(ScoringResultMessage result) {
        log.info("[RabbitMQ] Résultat ATS reçu ← candidatureId={} | score={} | grade={}",
                result.getCandidatureId(),
                result.getFinalScore(),
                result.getGrade());

        if (result.getCandidatureId() != null && result.getFinalScore() != null) {
            candidatureService.enregistrerScore(result.getCandidatureId(), result.getFinalScore());
            log.info("[RabbitMQ] Score {} persisté → candidatureId={}",
                    result.getFinalScore(), result.getCandidatureId());
        }
    }
}
