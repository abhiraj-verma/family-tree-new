package com.familytree.service;

import com.familytree.dto.RelationshipRequest;
import com.familytree.model.Relationship;
import com.familytree.repository.RelationshipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RelationshipService {
    
    private final RelationshipRepository relationshipRepository;
    
    public Relationship createRelationship(RelationshipRequest request) {
        Relationship relationship = new Relationship();
        relationship.setFromId(request.getFromId());
        relationship.setToId(request.getToId());
        relationship.setType(request.getType());
        
        relationship = relationshipRepository.save(relationship);
        
        log.info("Relationship created: {} -> {} ({})", 
            request.getFromId(), request.getToId(), request.getType());
        
        return relationship;
    }
    
    public List<Relationship> getUserRelationships(String userId) {
        return relationshipRepository.findByFromIdOrToId(userId, userId);
    }
    
    public void deleteRelationship(String relationshipId) {
        relationshipRepository.deleteById(relationshipId);
        log.info("Relationship deleted: {}", relationshipId);
    }
    
    public void deleteRelationshipBetweenUsers(String fromId, String toId) {
        relationshipRepository.deleteByFromIdAndToId(fromId, toId);
        log.info("Relationship deleted between: {} and {}", fromId, toId);
    }
}