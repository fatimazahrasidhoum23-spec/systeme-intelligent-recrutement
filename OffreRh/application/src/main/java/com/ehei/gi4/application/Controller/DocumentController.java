package com.ehei.gi4.application.Controller;

import com.ehei.gi4.application.DTO.DocumentDto;
import com.ehei.gi4.application.Enum.TypeDocument;
import com.ehei.gi4.application.Model.Document;
import com.ehei.gi4.application.Service.DocumentService;
import com.ehei.gi4.application.Service.MinioService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/document")
@AllArgsConstructor
public class DocumentController {

    private final DocumentService service;
    private final MinioService minioService;

    @GetMapping
    public ResponseEntity<List<DocumentDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getById(@PathVariable Long id) {
        DocumentDto dto = service.getById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentDto> upload(
            @RequestParam MultipartFile file,
            @RequestParam TypeDocument typeDocument) throws Exception {

        String url = minioService.uploadFile(file);

        Document doc = Document.builder()
                .nomFichier(file.getOriginalFilename())
                .url(url)
                .taille(file.getSize())
                .dateTelechargement(LocalDateTime.now())
                .estSelectionner(false)
                .typeDocument(typeDocument)
                .build();

        return ResponseEntity.ok(service.save(doc));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
