package com.ehei.gi4.application.DTO;

import com.ehei.gi4.application.Enum.CandidatureStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidatureCreateDto {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Le format de l'email est invalide")
    private String email;

    @NotBlank(message = "Le poste est obligatoire")
    private String poste;

    @NotNull(message = "Le statut ne peut pas être nul")
    private CandidatureStatus statut;

    /** AJOUT : URL MinIO du CV — ex: http://minio:9000/documents/cv_ali.pdf */
    private String cvUrl;

}
