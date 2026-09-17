package com.ehei.gi4.application.Messaging;

import com.ehei.gi4.application.Config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScoringPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishScoringRequest(ScoringRequestMessage message) {
        log.info("[RabbitMQ] Publication scoring → candidatureId={} offreId={}",
                message.getCandidatureId(), message.getOffreId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ATS_EXCHANGE,
                RabbitMQConfig.SCORING_ROUTING_KEY,
                message
        );
        log.info("[RabbitMQ] Message scoring envoyé avec succès");
    }

    public void publishEmailPostulation(EmailPostulationMessage message) {
        log.info("[RabbitMQ] Publication email postulation → destinataire={}",
                message.getDestinataire());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ATS_EXCHANGE,
                RabbitMQConfig.EMAIL_POSTULATION_ROUTING_KEY,
                message
        );
        log.info("[RabbitMQ] Message email postulation envoyé avec succès");
    }

    public void publishCandidaturePreselectionnee(
            int candidatureId, String nom, String email, String poste,
            Double score, String offreTitre, String reference) {

        Map<String, Object> payload = new HashMap<>();
        payload.put("candidatureId", candidatureId);
        payload.put("nom",           nom);
        payload.put("email",         email);
        payload.put("poste",         poste);
        payload.put("score",         score);
        payload.put("offreTitre",    offreTitre);
        payload.put("reference",     reference);

        log.info("[RabbitMQ] Publication candidature préselectionée → candidatureId={}", candidatureId);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ATS_EXCHANGE,
                "candidature.preselectionne",
                payload
        );
    }
}
