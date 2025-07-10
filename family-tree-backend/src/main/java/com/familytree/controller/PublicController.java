package com.familytree.controller;

import com.familytree.config.UserRequestAuditor;
import com.familytree.dto.FamilyResponse;
import com.familytree.service.FamilyService;
import com.familytree.service.JwtTokenProviderService;
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
    private final JwtTokenProviderService jwtTokenProviderService;
    
    @GetMapping("/getFamily/")
    public ResponseEntity<FamilyResponse> getPublicFamily(
            @RequestParam String token,
            @RequestParam String familyName) {
        String username = UserRequestAuditor.getCurrentUser().getUsername();
        FamilyResponse family = familyService.getFamilyByKey(username);
        if (!family.getName().equals(familyName)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Family not found");
        }
        return ResponseEntity.ok(family);
    }
}