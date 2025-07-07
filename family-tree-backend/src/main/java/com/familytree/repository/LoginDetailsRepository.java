package com.familytree.repository;

import com.familytree.model.LoginDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginDetailsRepository extends MongoRepository<LoginDetails, String> {
    
    Optional<LoginDetails> findByUsername(String username);
    
    Optional<LoginDetails> findByToken(String token);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByMobile(String mobile);
}