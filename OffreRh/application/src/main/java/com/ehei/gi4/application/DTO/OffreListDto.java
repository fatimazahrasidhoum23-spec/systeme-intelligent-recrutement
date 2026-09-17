package com.ehei.gi4.application.DTO;

import com.ehei.gi4.application.Enum.OffreStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OffreListDto {

    private int id;

    private String titre;

    private String description;

    private String lieu;

    private BigDecimal salaireMin;

    private BigDecimal salaireMax;

    private OffreStatus status;
}
