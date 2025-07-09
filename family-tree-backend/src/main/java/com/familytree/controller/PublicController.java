package com.familytree.controller;

import com.familytree.dto.FamilyResponse;
import com.familytree.service.FamilyService;
import com.familytree.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Slf4j
public class PublicController {
    
    private final FamilyService familyService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/family/{token}")
    public ResponseEntity<FamilyResponse> getPublicFamily(
            @PathVariable String token,
            @RequestParam String familyName) {
        // Validate token
        if (!jwtTokenProvider.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        // Get username from token
        String username = jwtTokenProvider.getUsernameFromToken(token);
        // Get family by key (username)
        FamilyResponse family = familyService.getFamilyByKey(username);
        // Verify family name matches
        if (!family.getName().equals(familyName)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found");
        }
        return ResponseEntity.ok(family);
    }
}