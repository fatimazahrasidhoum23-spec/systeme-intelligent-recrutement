package com.ehei.gi4.application.Service;

import com.ehei.gi4.application.DTO.OffreCreateDto;
import com.ehei.gi4.application.DTO.OffreListDto;
import com.ehei.gi4.application.DTO.OffreUpdateDto;
import com.ehei.gi4.application.Enum.OffreStatus;
import com.ehei.gi4.application.Mapper.OffreMapper;
import com.ehei.gi4.application.Model.Offre;
import com.ehei.gi4.application.Repository.OffreRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
@Getter
@Setter
public class OffreService {

    private final OffreRepository offreRepository;

    public Offre AddOffre(OffreCreateDto dto){
        Offre offre=OffreMapper.ToEntity(dto);
       return offreRepository.save(offre);

    }
    public Offre UpdateOffre(OffreUpdateDto dto ){

        Offre offre = offreRepository.findById(dto.getId()).orElse(null);
        if(offre==null){
           return null;
        }
        OffreMapper.UpdateFromEntity(dto,offre);
        return offreRepository.save(offre);
    }
    public Offre OffreGetById(int id){
            Offre offre =null;
        if(offreRepository.findById(id).isPresent()){
            offre = offreRepository.findById(id).get();
        }
        return offre;

    }
    public void DeleteOffre(int id)
    {
        offreRepository.deleteById(id);
    }
    public List<Offre> ArchiveOffre(){
        /*Offre offre = offreRepository.findById(id).orElse(null);
        offre.setStatus(OffreStatus.Archiver);
        offreRepository.save(offre);*/
        List<Offre> offreArr =offreRepository.findAllByStatus(OffreStatus.Archiver);
        return offreArr;
    }
    public List<Offre> GetAllOffre(){
       List<Offre> offreArchiver = offreRepository.findAllByStatusIsNot(OffreStatus.Archiver);
        System.out.println("appelservice");
        return offreArchiver;
    }


    
}
