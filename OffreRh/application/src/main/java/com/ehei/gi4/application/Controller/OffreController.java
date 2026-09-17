package com.ehei.gi4.application.Controller;

import com.ehei.gi4.application.DTO.OffreCreateDto;
import com.ehei.gi4.application.DTO.OffreListDto;
import com.ehei.gi4.application.DTO.OffreUpdateDto;
import com.ehei.gi4.application.Model.Offre;
import com.ehei.gi4.application.Service.OffreService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/Offre")
@CrossOrigin("*")
public class OffreController {
    private final OffreService offreService;

    @PostMapping("/add")
    public ResponseEntity<Offre> Add(@Valid @RequestBody OffreCreateDto offre){
        Offre offreCreated= offreService.AddOffre(offre);
        return ResponseEntity.ok(offreCreated);
    }
    @PatchMapping ("/update/{id}")
    public ResponseEntity<Offre> Update(@Valid @RequestBody OffreUpdateDto offre){
        Offre offreUpdated= offreService.UpdateOffre(offre);
        return ResponseEntity.ok(offreUpdated);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> Delete(@PathVariable int id){
        offreService.DeleteOffre(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/archive")
    public ResponseEntity<List<Offre>> Archive(){
       List<Offre> offre= offreService.ArchiveOffre();
        return ResponseEntity.ok(offre);
    }
    @GetMapping
    public ResponseEntity<List<Offre>> GetOffre(){
       List<Offre> offre= offreService.GetAllOffre();
        return ResponseEntity.ok(offre);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Offre> GetOffreById(@PathVariable int id){
       Offre offre= offreService.OffreGetById(id);
        return ResponseEntity.ok(offre);
    }
}
