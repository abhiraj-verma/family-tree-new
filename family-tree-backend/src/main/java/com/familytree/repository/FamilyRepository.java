package com.familytree.repository;

import com.familytree.model.Family;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FamilyRepository extends MongoRepository<Family, String> {
    
    Optional<Family> findByFamilyKey(String familyKey);
    
    boolean existsByFamilyKey(String familyKey);
}