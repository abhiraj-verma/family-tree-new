package com.familytree.controller;

import com.familytree.dto.RelationshipRequest;
import com.familytree.model.Relationship;
import com.familytree.service.RelationshipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/relationships")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RelationshipController {
    
    private final RelationshipService relationshipService;
    
    @PostMapping
    public ResponseEntity<Relationship> createRelationship(
            @Valid @RequestBody RelationshipRequest request) {
        try {
            Relationship relationship = relationshipService.createRelationship(request);
            return ResponseEntity.ok(relationship);
        } catch (Exception e) {
            log.error("Failed to create relationship: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Relationship>> getUserRelationships(@PathVariable String userId) {
        try {
            List<Relationship> relationships = relationshipService.getUserRelationships(userId);
            return ResponseEntity.ok(relationships);
        } catch (Exception e) {
            log.error("Failed to get user relationships: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{relationshipId}")
    public ResponseEntity<Void> deleteRelationship(@PathVariable String relationshipId) {
        try {
            relationshipService.deleteRelationship(relationshipId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete relationship: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}