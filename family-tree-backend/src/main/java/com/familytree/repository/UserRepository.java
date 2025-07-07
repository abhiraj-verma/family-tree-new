package com.familytree.repository;

import com.familytree.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    List<User> findByIsActiveTrue();
    
    @Query("{'relationships.parentIds': ?0}")
    List<User> findByParentId(String parentId);
    
    @Query("{'relationships.childrenIds': ?0}")
    List<User> findByChildId(String childId);
    
    @Query("{'relationships.spouseId': ?0}")
    Optional<User> findBySpouseId(String spouseId);
    
    @Query("{'relationships.motherId': ?0}")
    List<User> findByMotherId(String motherId);
    
    @Query("{'relationships.fatherId': ?0}")
    List<User> findByFatherId(String fatherId);
    
    List<User> findByFullNameContainingIgnoreCase(String name);
}