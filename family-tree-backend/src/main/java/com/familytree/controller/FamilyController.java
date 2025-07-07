package com.familytree.controller;

import com.familytree.dto.*;
import com.familytree.model.User;
import com.familytree.service.FamilyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FamilyController {
    
    private final FamilyService familyService;
    
    @PostMapping("/create")
    public ResponseEntity<FamilyResponse> createFamily(
            @RequestParam String familyName,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            FamilyResponse response = familyService.createFamily(username, familyName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create family: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{familyKey}")
    public ResponseEntity<FamilyResponse> getFamily(@PathVariable String familyKey) {
        try {
            FamilyResponse response = familyService.getFamilyByKey(familyKey);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get family: ", e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{familyKey}/members")
    public ResponseEntity<User> addMember(
            @PathVariable String familyKey,
            @Valid @RequestBody UserRequest userRequest,
            @RequestParam(required = false) String parentId,
            @RequestParam(required = false) String relationshipType) {
        try {
            User user = familyService.addMember(familyKey, userRequest, parentId, relationshipType);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Failed to add member: ", e);
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{familyKey}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable String familyKey,
            @PathVariable String userId) {
        try {
            familyService.removeMember(familyKey, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to remove member: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{familyKey}/name")
    public ResponseEntity<Void> updateFamilyName(
            @PathVariable String familyKey,
            @RequestParam String newName) {
        try {
            familyService.updateFamilyName(familyKey, newName);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to update family name: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}