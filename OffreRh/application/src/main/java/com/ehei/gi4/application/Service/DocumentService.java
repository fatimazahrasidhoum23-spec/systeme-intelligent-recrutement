package com.ehei.gi4.application.Service;

import com.ehei.gi4.application.DTO.DocumentDto;
import com.ehei.gi4.application.Mapper.DocumentMapper;
import com.ehei.gi4.application.Model.Document;
import com.ehei.gi4.application.Repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DocumentService {
    private final DocumentRepository repository;

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    public List<DocumentDto> getAll() {
        return repository.findAll()
                .stream()
                .map(DocumentMapper::toDto)
                .toList();
    }

    public DocumentDto getById(Long id) {
        return repository.findById(id)
                .map(DocumentMapper::toDto)
                .orElse(null);
    }

    public DocumentDto save(Document document) {
        return DocumentMapper.toDto(repository.save(document));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

}
