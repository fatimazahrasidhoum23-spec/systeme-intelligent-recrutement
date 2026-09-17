package com.ehei.gi4.application.Mapper;

import com.ehei.gi4.application.DTO.CandidatureCreateDto;
import com.ehei.gi4.application.DTO.CandidatureUpdateDto;
import com.ehei.gi4.application.Model.Candidature;

public class CandidatureMapper {

    public static Candidature ToEntity(CandidatureCreateDto candidatureCreateDto) {
        Candidature candidature = new Candidature();
        candidature.setNom(candidatureCreateDto.getNom());
        candidature.setEmail(candidatureCreateDto.getEmail());
        candidature.setPoste(candidatureCreateDto.getPoste());
        candidature.setStatus(candidatureCreateDto.getStatut());
        return candidature;
    }
    public static CandidatureCreateDto ToDtoCreate(Candidature candidature) {
        CandidatureCreateDto candidatureCreateDto = new CandidatureCreateDto();
        candidatureCreateDto.setNom(candidature.getNom());
        candidatureCreateDto.setEmail(candidature.getEmail());
        candidatureCreateDto.setPoste(candidature.getPoste());
        candidatureCreateDto.setStatut(candidature.getStatus());
        return candidatureCreateDto;
    }
    public static void UpdateFromEntity(CandidatureUpdateDto candidatureUpdateDto, Candidature candidature) {
        candidatureUpdateDto.setNom(candidature.getNom());
        candidatureUpdateDto.setEmail(candidature.getEmail());
        candidatureUpdateDto.setPoste(candidature.getPoste());
        candidatureUpdateDto.setStatut(candidature.getStatus());
    }
    public static CandidatureUpdateDto ToDtoUpdate(Candidature candidature) {
        CandidatureUpdateDto candidatureUpdateDto = new CandidatureUpdateDto();
        candidatureUpdateDto.setNom(candidature.getNom());
        candidatureUpdateDto.setEmail(candidature.getEmail());
        candidatureUpdateDto.setPoste(candidature.getPoste());
        candidatureUpdateDto.setStatut(candidature.getStatus());
        return candidatureUpdateDto;
    }
}
