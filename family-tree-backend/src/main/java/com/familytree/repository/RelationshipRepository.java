package com.familytree.repository;

import com.familytree.model.Relationship;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationshipRepository extends MongoRepository<Relationship, String> {
    
    List<Relationship> findByFromId(String fromId);
    
    List<Relationship> findByToId(String toId);
    
    List<Relationship> findByFromIdOrToId(String fromId, String toId);
    
    void deleteByFromIdAndToId(String fromId, String toId);
}