<?php

namespace App\Security;

use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Représente l'utilisateur extrait du JWT émis par AuthService (.NET).
 * Stocké dans le SecurityContext après validation du token.
 */
class JwtUser implements UserInterface
{
    public function __construct(
        private readonly string $userId,
        private readonly string $email,
        private readonly string $role,
    ) {}

    public function getUserId(): string  { return $this->userId; }
    public function getEmail(): string   { return $this->email;  }
    public function getRole(): string    { return $this->role;   }

    // UserInterface
    public function getUserIdentifier(): string { return $this->email; }

    public function getRoles(): array
    {
        // Symfony attend des rôles préfixés ROLE_
        return ['ROLE_' . strtoupper($this->role), 'ROLE_USER'];
    }

    public function eraseCredentials(): void {}
}
