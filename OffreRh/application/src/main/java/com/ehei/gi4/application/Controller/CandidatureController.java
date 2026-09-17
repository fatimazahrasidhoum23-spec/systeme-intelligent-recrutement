package com.ehei.gi4.application.Controller;

import com.ehei.gi4.application.DTO.CandidatureCreateDto;
import com.ehei.gi4.application.DTO.CandidaturePreselectionneeDto;
import com.ehei.gi4.application.DTO.CandidatureUpdateDto;
import com.ehei.gi4.application.DTO.DecisionCandidatureDto;
import com.ehei.gi4.application.Model.Candidature;
import com.ehei.gi4.application.Service.CandidatureService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("candidature")
public class CandidatureController {

    private CandidatureService candidatureService;

    @PostMapping("/postuler")
    public ResponseEntity<Candidature> Postuler(@Valid @RequestBody CandidatureCreateDto createDto) {
        Candidature candidature = candidatureService.AddCandidature(createDto);
        return new ResponseEntity<>(candidature, HttpStatus.CREATED);
    }

    @PostMapping("add")
    public ResponseEntity<Candidature> Add(@Valid @RequestBody CandidatureCreateDto postuler) {
        Candidature candidature = candidatureService.AddCandidature(postuler);
        return ResponseEntity.ok(candidature);
    }

    @GetMapping
    public ResponseEntity<List<Candidature>> getAllCandidature() {
        List<Candidature> candidatures = candidatureService.getAllCandidature();
        return ResponseEntity.ok(candidatures);
    }

    @PatchMapping("update/{id}")
    public ResponseEntity<Candidature> Update(@Valid @RequestBody CandidatureUpdateDto updateDto) {
        Candidature candidature = candidatureService.UpdateCandidature(updateDto);
        return ResponseEntity.ok(candidature);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> Delete(@PathVariable int id) {
        candidatureService.DeleteCandidature(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{id}")
    public ResponseEntity<Candidature> getById(@PathVariable int id) {
        Candidature candidature = candidatureService.getCandidatureById(id);
        return ResponseEntity.ok(candidature);
    }

    // ── Gérer Candidat préselectionné (RH) ───────────────────────────────

    /**
     * Consulter : liste des candidats EN_ATTENTE triés par score ATS (décroissant).
     * Accès : RH uniquement (configuré dans SecurityConfig).
     * GET /candidature/preselectionnees
     */
    @GetMapping("/preselectionnees")
    public ResponseEntity<List<CandidaturePreselectionneeDto>> getPreselectionnees() {
        return ResponseEntity.ok(candidatureService.getPreselectionnees());
    }

    /**
     * Valider : passe la candidature en ACCEPTEE.
     * Accès : RH uniquement.
     * PATCH /candidature/valider
     */
    @PatchMapping("/valider")
    public ResponseEntity<Candidature> valider(@Valid @RequestBody DecisionCandidatureDto dto) {
        return ResponseEntity.ok(candidatureService.valider(dto));
    }

    /**
     * Éliminer : passe la candidature en REFUSEE.
     * Accès : RH uniquement.
     * PATCH /candidature/eliminer
     */
    @PatchMapping("/eliminer")
    public ResponseEntity<Candidature> eliminer(@Valid @RequestBody DecisionCandidatureDto dto) {
        return ResponseEntity.ok(candidatureService.eliminer(dto));
    }

    // ── Suivi candidature — appelé par le front Angular (candidat) ────────

    /**
     * GET /candidature/suivi/nom/{nom}
     * Permet au candidat de suivre ses candidatures par son nom.
     */
    @GetMapping("/suivi/nom/{nom}")
    public ResponseEntity<List<Candidature>> suivreParNom(@PathVariable String nom) {
        return ResponseEntity.ok(candidatureService.findByNom(nom));
    }

    /**
     * GET /candidature/suivi/email/{email}
     * Permet au candidat de suivre ses candidatures par son email.
     */
    @GetMapping("/suivi/email/{email}")
    public ResponseEntity<List<Candidature>> suivreParEmail(@PathVariable String email) {
        return ResponseEntity.ok(candidatureService.findByEmail(email));
    }
}
