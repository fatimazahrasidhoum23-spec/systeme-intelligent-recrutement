package com.ehei.gi4.application.DTO;

import com.ehei.gi4.application.Enum.OffreStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class OffreCreateDto {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 100)
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotBlank(message = "Le lieu est obligatoire")
    private String lieu;

    @PositiveOrZero(message = "Le salaire minimum doit être positif")
    private BigDecimal salaireMin;

    @PositiveOrZero(message = "Le salaire maximum doit être positif")
    private BigDecimal salaireMax;

    @NotNull(message = "Le statut est obligatoire")
    private OffreStatus status;
}
