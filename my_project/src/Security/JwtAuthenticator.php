<?php

namespace App\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

/**
 * Authenticator JWT HS256 pour Symfony.
 * Valide les tokens émis par AuthService (.NET) — même clé secrète.
 *
 * Claims .NET utilisés :
 *   - http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier → userId
 *   - http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress   → email
 *   - http://schemas.microsoft.com/ws/2008/06/identity/claims/role         → role
 */
class JwtAuthenticator extends AbstractAuthenticator
{
    // Claim URIs utilisées par .NET (identiques à JwtUtil.java dans OffreRh)
    private const CLAIM_USER_ID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    private const CLAIM_EMAIL   = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
    private const CLAIM_ROLE    = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

    public function __construct(
        private readonly string $jwtSecret,
    ) {}

    /** Déclenché si le header Authorization: Bearer <token> est présent */
    public function supports(Request $request): ?bool
    {
        $auth = $request->headers->get('Authorization', '');
        return str_starts_with($auth, 'Bearer ');
    }

    public function authenticate(Request $request): Passport
    {
        $token = substr($request->headers->get('Authorization'), 7);

        try {
            $decoded = (array) JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
        } catch (\Exception $e) {
            throw new AuthenticationException('Token JWT invalide ou expiré : ' . $e->getMessage());
        }

        $userId = $decoded[self::CLAIM_USER_ID] ?? 'unknown';
        $email  = $decoded[self::CLAIM_EMAIL]   ?? $userId;
        $role   = $decoded[self::CLAIM_ROLE]    ?? 'Candidat';

        $user = new JwtUser($userId, $email, $role);

        return new SelfValidatingPassport(
            new UserBadge($email, fn() => $user)
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Continuer vers le controller
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(
            ['error' => $exception->getMessage()],
            Response::HTTP_UNAUTHORIZED
        );
    }
}
