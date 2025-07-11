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
@RequestMapping("/relationships")
@RequiredArgsConstructor
@Slf4j
public class RelationshipController {
    
    private final RelationshipService relationshipService;
    
    @PostMapping("create")
    public ResponseEntity<Relationship> createRelationship(
            @Valid @RequestBody RelationshipRequest request) {
        Relationship relationship = relationshipService.createRelationship(request);
        return ResponseEntity.ok(relationship);
    }
    
    @GetMapping("/UserRelations")
    public ResponseEntity<List<Relationship>> getUserRelationships(@RequestParam String userId) {
        List<Relationship> relationships = relationshipService.getUserRelationships(userId);
        return ResponseEntity.ok(relationships);
    }
    
    @PutMapping("/deleteRelation")
    public ResponseEntity<Void> deleteRelationship(@RequestParam String relationshipId) {
        relationshipService.deleteRelationship(relationshipId);
        return ResponseEntity.ok().build();
    }
}