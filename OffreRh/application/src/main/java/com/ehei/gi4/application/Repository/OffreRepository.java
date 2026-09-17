package com.ehei.gi4.application.Repository;

import com.ehei.gi4.application.Enum.OffreStatus;
import com.ehei.gi4.application.Model.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Integer> {
    List<Offre> findAllByStatus(OffreStatus status);
    List<Offre> findAllByStatusIsNot(OffreStatus status);
}
