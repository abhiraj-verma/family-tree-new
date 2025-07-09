package com.familytree.service;

import com.familytree.dto.*;
import com.familytree.model.LoginDetails;
import com.familytree.repository.LoginDetailsRepository;
import com.familytree.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final LoginDetailsRepository loginDetailsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (loginDetailsRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }
        
        // Check if email already exists (if provided)
        if (request.getEmail() != null && !request.getEmail().isEmpty() 
            && loginDetailsRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }
        
        // Check if mobile already exists (if provided)
        if (request.getMobile() != null && !request.getMobile().isEmpty() 
            && loginDetailsRepository.existsByMobile(request.getMobile())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mobile number already exists");
        }
        
        // Create new login details
        LoginDetails loginDetails = new LoginDetails();
        loginDetails.setUsername(request.getUsername());
        loginDetails.setPassword(passwordEncoder.encode(request.getPassword()));
        loginDetails.setEmail(request.getEmail());
        loginDetails.setMobile(request.getMobile());
        loginDetails.setIsGoogleSignIn(false);
        loginDetails.setFamilyKey(request.getUsername()); // Use username as family key initially
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(request.getUsername());
        String refreshToken = jwtTokenProvider.generateRefreshToken(request.getUsername());
        
        loginDetails.setToken(token);
        loginDetails.setTokenExpiryDate(LocalDateTime.now().plusDays(30));
        
        loginDetailsRepository.save(loginDetails);
        
        log.info("User registered successfully: {}", request.getUsername());
        
        return new AuthResponse(
            token,
            refreshToken,
            loginDetails.getUsername(),
            loginDetails.getFamilyName(),
            loginDetails.getFamilyKey(),
            jwtTokenProvider.getExpirationTime()
        );
    }
    
    public AuthResponse login(AuthRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
        
        // Get user details
        LoginDetails loginDetails = loginDetailsRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate new tokens
        String token = jwtTokenProvider.generateToken(request.getUsername());
        String refreshToken = jwtTokenProvider.generateRefreshToken(request.getUsername());
        
        // Update token in database
        loginDetails.setToken(token);
        loginDetails.setTokenExpiryDate(LocalDateTime.now().plusDays(30));
        loginDetailsRepository.save(loginDetails);
        
        log.info("User logged in successfully: {}", request.getUsername());
        
        return new AuthResponse(
            token,
            refreshToken,
            loginDetails.getUsername(),
            loginDetails.getFamilyName(),
            loginDetails.getFamilyKey(),
            jwtTokenProvider.getExpirationTime()
        );
    }
    
    public AuthResponse googleSignIn(String googleToken) {
        // TODO: Implement Google OAuth verification
        // For now, create a mock implementation
        String username = "google_" + System.currentTimeMillis();
        
        LoginDetails loginDetails = new LoginDetails();
        loginDetails.setUsername(username);
        loginDetails.setIsGoogleSignIn(true);
        loginDetails.setFamilyKey(username);
        
        String token = jwtTokenProvider.generateToken(username);
        String refreshToken = jwtTokenProvider.generateRefreshToken(username);
        
        loginDetails.setToken(token);
        loginDetails.setTokenExpiryDate(LocalDateTime.now().plusDays(30));
        
        loginDetailsRepository.save(loginDetails);
        
        log.info("Google sign-in successful: {}", username);
        
        return new AuthResponse(
            token,
            refreshToken,
            loginDetails.getUsername(),
            loginDetails.getFamilyName(),
            loginDetails.getFamilyKey(),
            jwtTokenProvider.getExpirationTime()
        );
    }
    
    public void logout(String username) {
        LoginDetails loginDetails = loginDetailsRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        loginDetails.setToken(null);
        loginDetails.setTokenExpiryDate(null);
        loginDetailsRepository.save(loginDetails);
        
        log.info("User logged out successfully: {}", username);
    }

    public String extractUsernameFromToken(String tokenHeader) {
        // Remove 'Bearer ' prefix if present
        String token = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7) : tokenHeader;
        return jwtTokenProvider.getUsernameFromToken(token);
    }
}