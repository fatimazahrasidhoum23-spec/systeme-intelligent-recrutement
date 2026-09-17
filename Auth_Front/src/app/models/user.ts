// Interface qui définit la structure des données utilisateur
// Correspond exactement à ce que retourne l'API /api/auth/me
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  telephone?: string; // optionnel car peut être null
}

// Interface pour la réponse du Login
export interface LoginResponse {
  token: string;
  refreshToken: string;
  email: string;
  role: string;
}

// Interface pour la requête Register
export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: string;
}

// Interface pour la requête Login
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface pour la réponse Register
export interface RegisterResponse {
  id: string;
  email: string;
  role: string;
}