package com.ehei.gi4.application.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utilitaire JWT — valide les tokens émis par AuthService (HMAC-SHA256).
 * La clé secrète doit être identique à celle de AuthService/appsettings.json.
 */
@Slf4j
@Component
public class JwtUtil {

    private final SecretKey signingKey;

    public JwtUtil(@Value("${app.jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Valide le token et retourne les claims.
     * @throws JwtException si le token est invalide ou expiré
     */
    public Claims validateAndGetClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /** Extrait l'email de l'utilisateur depuis le token. */
    public String getEmail(String token) {
        return validateAndGetClaims(token)
                .get("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", String.class);
    }

    /** Extrait le rôle de l'utilisateur depuis le token. */
    public String getRole(String token) {
        return validateAndGetClaims(token)
                .get("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", String.class);
    }

    /** Extrait l'ID de l'utilisateur depuis le token. */
    public String getUserId(String token) {
        return validateAndGetClaims(token)
                .get("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", String.class);
    }

    /** Vérifie si le token est expiré. */
    public boolean isExpired(String token) {
        try {
            Date expiration = validateAndGetClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }
}
