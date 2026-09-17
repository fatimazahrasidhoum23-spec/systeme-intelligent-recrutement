package com.ehei.gi4.application.DTO;

import com.ehei.gi4.application.Enum.CandidatureStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidatureListDto {
    private Long id;
    private String nom;
    private String email;
    private String poste;
    private CandidatureStatus statut;

}
