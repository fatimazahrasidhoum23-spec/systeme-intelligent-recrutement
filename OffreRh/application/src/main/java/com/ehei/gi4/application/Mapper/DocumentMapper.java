package com.ehei.gi4.application.Mapper;

import com.ehei.gi4.application.DTO.DocumentDto;
import com.ehei.gi4.application.Enum.TypeDocument;
import com.ehei.gi4.application.Model.Document;

public class DocumentMapper {
    public static DocumentDto toDto(Document doc) {
        return new DocumentDto(
                doc.getId(),
                doc.getNomFichier(),
                doc.getUrl(),
                doc.getTaille(),
                doc.getDateTelechargement(),
                doc.getTypeDocument() != null ? doc.getTypeDocument().name() : null
        );
    }

    public static Document toEntity(DocumentDto dto) {
        Document document = new Document();
        document.setNomFichier(dto.getNomFichier());
        document.setUrl(dto.getUrl());
        document.setTaille(dto.getTaille());
        document.setDateTelechargement(dto.getDateTelechargement());
        if (dto.getTypeDocument() != null) {
            document.setTypeDocument(TypeDocument.valueOf(dto.getTypeDocument()));
        }
        return document;
    }
}
