package com.ehei.gi4.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {
    private Long id;
    private String nomFichier;
    private String url;
    private Long taille;
    private LocalDateTime dateTelechargement;
    private String typeDocument;

}
