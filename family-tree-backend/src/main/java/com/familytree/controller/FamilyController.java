package com.familytree.controller;

import com.familytree.config.UserRequestAuditor;
import com.familytree.dto.*;
import com.familytree.model.User;
import com.familytree.service.FamilyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/family")
@RequiredArgsConstructor
@Slf4j
public class FamilyController {
    
    private final FamilyService familyService;
    
    @PostMapping("/create")
    public ResponseEntity<FamilyResponse> createFamily(
            @RequestParam String familyName) {
        String username = UserRequestAuditor.getCurrentUser().getUsername();
        FamilyResponse response = familyService.createFamily(username, familyName);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{familyKey}")
    public ResponseEntity<FamilyResponse> getFamily(@PathVariable String familyKey) {
        FamilyResponse response = familyService.getFamilyByKey(familyKey);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{familyKey}/members")
    public ResponseEntity<User> addMember(
            @PathVariable String familyKey,
            @Valid @RequestBody UserRequest userRequest,
            @RequestParam(required = false) String parentId,
            @RequestParam(required = false) String relationshipType) {
        User user = familyService.addMember(familyKey, userRequest, parentId, relationshipType);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/{familyKey}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable String familyKey,
            @PathVariable String userId) {
        familyService.removeMember(familyKey, userId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{familyKey}/name")
    public ResponseEntity<Void> updateFamilyName(
            @PathVariable String familyKey,
            @RequestParam String newName) {
        familyService.updateFamilyName(familyKey, newName);
        return ResponseEntity.ok().build();
    }
}