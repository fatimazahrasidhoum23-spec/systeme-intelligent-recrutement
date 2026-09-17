package com.ehei.gi4.application.Security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtre Spring Security — intercepte chaque requête HTTP,
 * extrait le Bearer token, le valide et injecte l'utilisateur dans le contexte.
 *
 * Si le token est expiré → 401 avec message indiquant d'appeler refresh-token.
 * Si le token est absent sur une route protégée → Spring Security renvoie 401.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Pas de header → on laisse passer (Spring Security bloquera si la route est protégée)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        try {
            var claims = jwtUtil.validateAndGetClaims(token);

            // Récupérer le rôle depuis le claim .NET
            String role = claims.get(
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role", String.class);
            String userId = claims.get(
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", String.class);

            List<SimpleGrantedAuthority> authorities = role != null
                    ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    : List.of();

            var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.debug("JWT valide — userId={} role={}", userId, role);

        } catch (ExpiredJwtException e) {
            log.info("Token expiré pour la requête {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\":\"Token expiré. Appelez POST /api/auth/refresh-token sur AuthService pour obtenir un nouveau token.\"}"
            );
            return;
        } catch (JwtException e) {
            log.warn("Token JWT invalide : {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Token JWT invalide.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
