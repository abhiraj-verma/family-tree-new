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
    
    @GetMapping("/fetch")
    public ResponseEntity<FamilyResponse> getFamily(@RequestParam String familyKey) {
        FamilyResponse response = familyService.getFamilyByKey(familyKey);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/addMembers")
    public ResponseEntity<User> addMember(
            @RequestParam String familyKey,
            @Valid @RequestBody UserRequest userRequest,
            @RequestParam(required = false) String parentId,
            @RequestParam(required = false) String relationshipType) {
        User user = familyService.addMember(familyKey, userRequest, parentId, relationshipType);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/removeMembers")
    public ResponseEntity<Void> removeMember(
            @RequestParam String familyKey,
            @RequestParam String userId) {
        familyService.removeMember(familyKey, userId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/updateName")
    public ResponseEntity<Void> updateFamilyName(
            @RequestParam String familyKey,
            @RequestParam String newName) {
        familyService.updateFamilyName(familyKey, newName);
        return ResponseEntity.ok().build();
    }
}