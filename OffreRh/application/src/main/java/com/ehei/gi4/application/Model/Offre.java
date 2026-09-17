package com.ehei.gi4.application.Model;

import com.ehei.gi4.application.Enum.OffreStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter@Setter
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "offres_emploi")
public class Offre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String titre;
    private String description;
    private String lieu;
    private BigDecimal salaireMin;
    private BigDecimal salaireMax;
    private OffreStatus status;
}
