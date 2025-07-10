package com.familytree.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.public.token.expiration}")
    private long jwtPublicTokenExpirationMs;
    
    @Value("${jwt.session.token.expiration}")
    private long jwtSessionTokenExpirationMs;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generatePublicToken(String username) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtPublicTokenExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // UPDATED
                .compact();
    }

    public String generateSessionToken(String username) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtSessionTokenExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(expiryDate)
                .claim("type", "refresh")
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // UPDATED
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public Claims validateToken(String token) throws RuntimeException {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token | error: {}", e.getMessage(), e);
            throw new RuntimeException("Invalid jwt token");
        }
    }
}