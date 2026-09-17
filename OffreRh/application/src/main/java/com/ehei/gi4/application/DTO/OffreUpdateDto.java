package com.ehei.gi4.application.DTO;

import com.ehei.gi4.application.Enum.OffreStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class OffreUpdateDto {
    @NotNull(message = "L'identifiant de l'offre est requis pour la modification")
    private int id;

    @NotBlank(message = "Le titre ne peut pas être vide")
    private String titre;

    private String description;

    private String lieu;

    private BigDecimal salaireMin;

    private BigDecimal salaireMax;

    private OffreStatus status;
}
