package com.ehei.gi4.application.Model;

import com.ehei.gi4.application.Enum.TypeDocument;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomFichier;
    private String url;
    private Long taille;
    private LocalDateTime dateTelechargement;
    private boolean estSelectionner;

    @Enumerated(EnumType.STRING)
    private TypeDocument typeDocument;
}
