package com.familytree.controller;

import com.familytree.dto.*;
import com.familytree.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Registration failed: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/google-signin")
    public ResponseEntity<AuthResponse> googleSignIn(@RequestBody String googleToken) {
        try {
            AuthResponse response = authService.googleSignIn(googleToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Google sign-in failed: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        try {
            // Extract username from token and logout
            // Implementation depends on your JWT token structure
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Logout failed: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}