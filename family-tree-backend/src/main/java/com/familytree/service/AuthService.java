package com.familytree.service;

import com.familytree.config.UserRequestAuditor;
import com.familytree.dto.*;
import com.familytree.model.LoginDetails;
import com.familytree.repository.LoginDetailsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    @Value("${public.url.redirection.dns}")
    private String redirectionDns;

    private final LoginDetailsRepository loginDetailsRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtTokenProviderService jwtTokenProviderService;
    private static final String GOOGLE_SIGN_UP_PREFIX = "g-";
    
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
        
        // Generate JWT publicToken
        String publicToken = jwtTokenProviderService.generatePublicToken(request.getUsername());
        String sessionToken = jwtTokenProviderService.generateSessionToken(request.getUsername());
        
        loginDetails.setToken(publicToken);
        loginDetails.setTokenExpiryDate(LocalDateTime.now().plusDays(30));
        
        loginDetailsRepository.save(loginDetails);
        
        log.info("User registered successfully: {}", request.getUsername());
        
        return new AuthResponse(
            redirectionDns + publicToken,
            sessionToken,
            loginDetails.getUsername(),
            loginDetails.getFamilyName(),
            loginDetails.getTokenExpiryDate()
        );
    }
    
    public AuthResponse login(AuthRequest request) {
        // Get user details
        LoginDetails loginDetails = loginDetailsRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate new tokens
        String sessionToken = jwtTokenProviderService.generateSessionToken(request.getUsername());
        
        log.info("User logged in successfully: {}", request.getUsername());
        
        return new AuthResponse(
            redirectionDns + loginDetails.getToken(),
            sessionToken,
            loginDetails.getUsername(),
            loginDetails.getFamilyName(),
            loginDetails.getTokenExpiryDate()
        );
    }
    
    public AuthResponse googleSignIn(GoogleSignUpRequest request) {
        String username = GOOGLE_SIGN_UP_PREFIX + request.getGoogleId();
        LoginDetails loginDetails = new LoginDetails();
        loginDetails.setUsername(username);
        loginDetails.setIsGoogleSignIn(true);
        loginDetails.setEmail(request.getEmail());
        
        String publicToken = jwtTokenProviderService.generatePublicToken(username);
        String sessionToken = jwtTokenProviderService.generateSessionToken(username);
        
        loginDetails.setToken(publicToken);
        loginDetails.setTokenExpiryDate(LocalDateTime.now().plusDays(30));
        
        loginDetailsRepository.save(loginDetails);
        
        log.info("Google sign-in successful: {}", username);
        
        return new AuthResponse(
            redirectionDns + publicToken,
            sessionToken,
            loginDetails.getUsername(),
            loginDetails.getFamilyName(),
            loginDetails.getTokenExpiryDate()
        );
    }
    
    public void logout(String username) {
//        LoginDetails loginDetails = loginDetailsRepository.findByUsername(username)
//            .orElseThrow(() -> new RuntimeException("User not found"));
//
//        loginDetails.setToken(null);
//        loginDetails.setTokenExpiryDate(null);
//        loginDetailsRepository.save(loginDetails);
        
        log.info("User logged out successfully: {}", username);
    }

    public String extractUsernameFromToken(String tokenHeader) {
        // Remove 'Bearer ' prefix if present
        String publicToken = tokenHeader.startsWith("Bearer ") ? tokenHeader.substring(7) : tokenHeader;
        return jwtTokenProviderService.getUsernameFromToken(publicToken);
    }

    public AuthResponse publicTokenLogIn(String familyName) {
        String username = UserRequestAuditor.getCurrentUser().getUsername();
        LoginDetails loginDetails = loginDetailsRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!loginDetails.getFamilyName().equals(familyName)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found");
        }

        // Generate new tokens
        String sessionToken = jwtTokenProviderService.generateSessionToken(username);

        log.info("User logged in successfully through public url: {}", username);

        return new AuthResponse(
                redirectionDns + loginDetails.getToken(),
                sessionToken,
                username,
                loginDetails.getFamilyName(),
                loginDetails.getTokenExpiryDate()
        );
    }
}