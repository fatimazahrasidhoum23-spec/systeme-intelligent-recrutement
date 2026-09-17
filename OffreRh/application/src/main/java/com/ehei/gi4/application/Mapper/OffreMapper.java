package com.ehei.gi4.application.Mapper;

import com.ehei.gi4.application.DTO.OffreCreateDto;
import com.ehei.gi4.application.DTO.OffreUpdateDto;
import com.ehei.gi4.application.Model.Offre;

public class OffreMapper {

    public static Offre ToEntity(OffreCreateDto offre){
        Offre offreEntity = new Offre();
        offreEntity.setTitre(offre.getTitre());
        offreEntity.setDescription(offre.getDescription());
        offreEntity.setLieu(offre.getLieu());
        offreEntity.setSalaireMin(offre.getSalaireMin());
        offreEntity.setSalaireMax(offre.getSalaireMax());
        offreEntity.setStatus(offre.getStatus());
        return offreEntity;

    }
    public static OffreCreateDto ToDtoCreate(Offre offreEntity){
        OffreCreateDto offreCreateDto = new OffreCreateDto();
        offreCreateDto.setTitre(offreEntity.getTitre());
        offreCreateDto.setDescription(offreEntity.getDescription());
        offreCreateDto.setLieu(offreEntity.getLieu());
        offreCreateDto.setSalaireMin(offreEntity.getSalaireMin());
        offreCreateDto.setSalaireMax(offreEntity.getSalaireMax());
        offreCreateDto.setStatus(offreEntity.getStatus());
        return offreCreateDto;

    }
    public static void UpdateFromEntity(OffreUpdateDto offre, Offre offreEntity){
        offreEntity.setTitre(offre.getTitre());
        offreEntity.setDescription(offre.getDescription());
        offreEntity.setLieu(offre.getLieu());
        offreEntity.setSalaireMin(offre.getSalaireMin());
        offreEntity.setSalaireMax(offre.getSalaireMax());
        offreEntity.setStatus(offre.getStatus());
    }
    public static OffreUpdateDto toDto(Offre offreEntity){
       OffreUpdateDto offreUpdateDto = new OffreUpdateDto();
        offreUpdateDto.setId(offreEntity.getId());
        offreUpdateDto.setTitre(offreEntity.getTitre());
        offreUpdateDto.setDescription(offreEntity.getDescription());
        offreUpdateDto.setLieu(offreEntity.getLieu());
        offreUpdateDto.setSalaireMin(offreEntity.getSalaireMin());
        offreUpdateDto.setSalaireMax(offreEntity.getSalaireMax());
        offreUpdateDto.setStatus(offreEntity.getStatus());
        return offreUpdateDto;
    }
}
