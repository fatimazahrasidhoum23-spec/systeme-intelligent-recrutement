package com.ehei.gi4.application.DTO;

import com.ehei.gi4.application.Enum.CandidatureStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidatureUpdateDto {
    @NotNull(message = "L'ID est requis pour la mise à jour")
    private int id;

    @NotBlank(message = "Le nom ne peut pas être vide")
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le poste est obligatoire")
    private String poste;

    @NotNull(message = "Le statut est obligatoire")
    private CandidatureStatus statut;
}
