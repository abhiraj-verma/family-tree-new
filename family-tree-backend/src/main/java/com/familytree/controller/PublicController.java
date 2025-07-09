package com.familytree.controller;

import com.familytree.dto.FamilyResponse;
import com.familytree.service.FamilyService;
import com.familytree.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PublicController {
    
    private final FamilyService familyService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/family/{token}")
    public ResponseEntity<FamilyResponse> getPublicFamily(
            @PathVariable String token,
            @RequestParam String familyName) {
        try {
            // Validate token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Get username from token
            String username = jwtTokenProvider.getUsernameFromToken(token);
            
            // Get family by key (username)
            FamilyResponse family = familyService.getFamilyByKey(username);
            
            // Verify family name matches
            if (!family.getName().equals(familyName)) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(family);
        } catch (Exception e) {
            log.error("Failed to get public family: ", e);
            return ResponseEntity.notFound().build();
        }
    }
}