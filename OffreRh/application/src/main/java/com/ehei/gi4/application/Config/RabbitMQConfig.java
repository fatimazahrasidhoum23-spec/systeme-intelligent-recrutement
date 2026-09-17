package com.ehei.gi4.application.Config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // ── Exchange unique pour tout le projet ───────────────────────────────
    public static final String ATS_EXCHANGE         = "ats.exchange";

    // ── ATS scoring : OffreRh → ATS (FastAPI) ────────────────────────────
    public static final String SCORING_QUEUE        = "ats.scoring.queue";
    public static final String SCORING_ROUTING_KEY  = "ats.scoring";

    // ── ATS résultat : ATS (FastAPI) → OffreRh ───────────────────────────
    public static final String RESULT_QUEUE         = "ats.result.queue";
    public static final String RESULT_ROUTING_KEY   = "ats.result";

    // ── Email postulation : OffreRh → service-email (.NET) ───────────────
    public static final String EMAIL_POSTULATION_QUEUE       = "email.postulation";
    public static final String EMAIL_POSTULATION_ROUTING_KEY = "email.postulation";

    // ── Auth events : service-auth (.NET) → service-email (.NET) ─────────
    public static final String EMAIL_AUTH_QUEUE       = "email.auth.queue";
    public static final String EMAIL_AUTH_ROUTING_KEY = "email.auth";

    // ── Candidat préselectionné : OffreRh → Symfony ───────────────────────
    public static final String PRESELECTIONNE_QUEUE       = "candidature.preselectionne.queue";
    public static final String PRESELECTIONNE_ROUTING_KEY = "candidature.preselectionne";

    // ── Exchange topic ────────────────────────────────────────────────────
    @Bean
    public TopicExchange atsExchange() {
        return new TopicExchange(ATS_EXCHANGE, true, false);
    }

    // ── Queues ATS ────────────────────────────────────────────────────────
    @Bean public Queue scoringQueue()  { return QueueBuilder.durable(SCORING_QUEUE).build(); }
    @Bean public Queue resultQueue()   { return QueueBuilder.durable(RESULT_QUEUE).build(); }

    // ── Queue email postulation ───────────────────────────────────────────
    @Bean public Queue emailPostulationQueue() { return QueueBuilder.durable(EMAIL_POSTULATION_QUEUE).build(); }

    // ── Queue candidat préselectionné → Symfony ───────────────────────────
    @Bean public Queue preselectionneQueue() { return QueueBuilder.durable(PRESELECTIONNE_QUEUE).build(); }

    // ── Bindings ──────────────────────────────────────────────────────────
    @Bean
    public Binding scoringBinding(Queue scoringQueue, TopicExchange atsExchange) {
        return BindingBuilder.bind(scoringQueue).to(atsExchange).with(SCORING_ROUTING_KEY);
    }

    @Bean
    public Binding resultBinding(Queue resultQueue, TopicExchange atsExchange) {
        return BindingBuilder.bind(resultQueue).to(atsExchange).with(RESULT_ROUTING_KEY);
    }

    @Bean
    public Binding emailPostulationBinding(Queue emailPostulationQueue, TopicExchange atsExchange) {
        return BindingBuilder.bind(emailPostulationQueue).to(atsExchange).with(EMAIL_POSTULATION_ROUTING_KEY);
    }

    @Bean
    public Binding preselectionneBinding(Queue preselectionneQueue, TopicExchange atsExchange) {
        return BindingBuilder.bind(preselectionneQueue).to(atsExchange).with(PRESELECTIONNE_ROUTING_KEY);
    }

    // ── Sérialisation JSON ────────────────────────────────────────────────
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
