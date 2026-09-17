<?php

namespace App\Repository\Doctrine;

use App\Entity\Entretien;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class EntretienRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Entretien::class);
    }

    public function save(Entretien $entretien): void
    {
        $this->getEntityManager()->persist($entretien);
        $this->getEntityManager()->flush();
    }

    public function delete(Entretien $entretien): void
    {
        $this->getEntityManager()->remove($entretien);
        $this->getEntityManager()->flush();
    }
}