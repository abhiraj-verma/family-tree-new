package com.familytree.controller;

import com.familytree.dto.AuthResponse;
import com.familytree.service.AuthService;
import com.familytree.service.FamilyService;
import com.familytree.service.JwtTokenProviderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Slf4j
public class PublicController {
    
    private final FamilyService familyService;
    private final JwtTokenProviderService jwtTokenProviderService;
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> getPublicFamily(
            @RequestParam String familyName) {
        AuthResponse response = authService.publicTokenLogIn(familyName);
        return ResponseEntity.ok(response);
    }
}