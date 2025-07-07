package com.familytree.service;

import com.familytree.dto.UserRequest;
import com.familytree.model.User;
import com.familytree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getUserById(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUser(String userId, UserRequest userRequest) {
        User user = getUserById(userId);
        
        // Update user fields
        user.setFullName(userRequest.getFullName());
        user.setNickName(userRequest.getNickName());
        user.setMobile(userRequest.getMobile());
        user.setEmail(userRequest.getEmail());
        user.setBio(userRequest.getBio());
        user.setGender(userRequest.getGender());
        user.setBloodGroup(userRequest.getBloodGroup());
        user.setBirthDay(userRequest.getBirthDay());
        user.setMarriageAnniversary(userRequest.getMarriageAnniversary());
        user.setRewards(userRequest.getRewards());
        user.setJob(userRequest.getJob());
        user.setEducation(userRequest.getEducation());
        user.setFamilyDoctor(userRequest.getFamilyDoctor());
        user.setDeathAnniversary(userRequest.getDeathAnniversary());
        user.setImageUrl(userRequest.getImageUrl());
        
        if (userRequest.getLocation() != null) {
            user.setLocation(userRequest.getLocation());
        }
        
        user = userRepository.save(user);
        
        log.info("User updated successfully: {}", user.getFullName());
        
        return user;
    }
    
    public List<User> searchUsers(String query) {
        return userRepository.findByFullNameContainingIgnoreCase(query);
    }
    
    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }
}