export interface OffreResponse {
  id: number ;
  titre: string ;
  description: string;
  lieu: string;
  salaireMin: number;
  salaireMax: number;
  status : string;
}

export interface OffreRequest{
  titre: string ;
  description: string;
  lieu: string;
  salaireMin: number;
  salaireMax: number;
  status : string;
}

