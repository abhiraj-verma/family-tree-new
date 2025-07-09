package com.familytree.service;

import com.familytree.dto.FamilyResponse;
import com.familytree.dto.UserRequest;
import com.familytree.model.*;
import com.familytree.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class FamilyService {
    
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final RelationshipRepository relationshipRepository;
    private final LoginDetailsRepository loginDetailsRepository;
    
    public FamilyResponse createFamily(String username, String familyName) {
        // Get login details
        LoginDetails loginDetails = loginDetailsRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if family already exists
        if (familyRepository.existsByFamilyKey(username)) {
            throw new RuntimeException("Family already exists for this user");
        }
        
        // Create new family
        Family family = new Family();
        family.setName(familyName);
        family.setFamilyKey(username);
        
        // Initialize root node
        Family.FamilyNode rootNode = new Family.FamilyNode();
        rootNode.setLocation(0);
        family.setRootNode(rootNode);
        
        family = familyRepository.save(family);
        
        // Update login details with family name
        loginDetails.setFamilyName(familyName);
        loginDetailsRepository.save(loginDetails);
        
        log.info("Family created successfully: {} for user: {}", familyName, username);
        
        return new FamilyResponse(
            family.getId(),
            family.getName(),
            family.getFamilyKey(),
            new ArrayList<>(),
            new ArrayList<>(),
            family.getCreatedAt(),
            family.getUpdatedAt()
        );
    }
    
    public FamilyResponse getFamilyByKey(String familyKey) {
        Family family = familyRepository.findByFamilyKey(familyKey)
            .orElseThrow(() -> new RuntimeException("Family not found"));
        
        // Get all family members
        List<User> members = userRepository.findAllById(family.getMemberIds());
        
        // Get all relationships
        List<Relationship> relationships = family.getRelationships();
        
        return new FamilyResponse(
            family.getId(),
            family.getName(),
            family.getFamilyKey(),
            members,
            relationships,
            family.getCreatedAt(),
            family.getUpdatedAt()
        );
    }
    
    @Transactional
    public User addMember(String familyKey, UserRequest userRequest, String parentId, String relationshipType) {
        Family family = familyRepository.findByFamilyKey(familyKey)
            .orElseThrow(() -> new RuntimeException("Family not found"));
        
        // Create new user
        User user = new User();
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
        user.setLocation(userRequest.getLocation() != null ? userRequest.getLocation() : family.getMemberIds().size());
        user.setIsActive(true);
        if (userRequest.getIsFoundingMember() != null) {
            user.setIsFoundingMember(userRequest.getIsFoundingMember());
        } else {
            user.setIsFoundingMember(family.getMemberIds().isEmpty());
        }
        
        user = userRepository.save(user);
        
        // Add to family
        family.getMemberIds().add(user.getId());
        
        // Handle relationships
        if (parentId != null && relationshipType != null) {
            handleRelationship(user, parentId, relationshipType, family);
        }
        
        // Update root node if this is the first member
        if (family.getMemberIds().size() == 1) {
            family.getRootNode().setUId(user.getId());
        }
        
        familyRepository.save(family);
        
        log.info("Member added successfully: {} to family: {}", user.getFullName(), family.getName());
        
        return user;
    }
    
    private void handleRelationship(User newUser, String existingUserId, String relationshipType, Family family) {
        User existingUser = userRepository.findById(existingUserId)
            .orElseThrow(() -> new RuntimeException("Existing user not found"));
        
        Relationship relationship = new Relationship();
        
        switch (relationshipType.toLowerCase()) {
            case "child":
                // New user is child of existing user
                relationship.setFromId(existingUserId);
                relationship.setToId(newUser.getId());
                relationship.setType(Relationship.RelationType.CHILD);
                
                // Update relationships
                existingUser.getRelationships().getChildrenIds().add(newUser.getId());
                newUser.getRelationships().getParentIds().add(existingUserId);
                
                // Set parent reference based on gender
                if (existingUser.getGender() == User.Gender.MALE) {
                    newUser.getRelationships().setFatherId(existingUserId);
                } else if (existingUser.getGender() == User.Gender.FEMALE) {
                    newUser.getRelationships().setMotherId(existingUserId);
                }
                
                // If existing user has a spouse, connect child to spouse as well
                if (existingUser.getRelationships().getSpouseId() != null) {
                    User spouse = userRepository.findById(existingUser.getRelationships().getSpouseId())
                        .orElse(null);
                    if (spouse != null) {
                        // Add child to spouse's children list
                        spouse.getRelationships().getChildrenIds().add(newUser.getId());
                        
                        // Add spouse to child's parent list
                        if (!newUser.getRelationships().getParentIds().contains(spouse.getId())) {
                            newUser.getRelationships().getParentIds().add(spouse.getId());
                        }
                        
                        // Set appropriate parent reference
                        if (spouse.getGender() == User.Gender.MALE) {
                            newUser.getRelationships().setFatherId(spouse.getId());
                        } else if (spouse.getGender() == User.Gender.FEMALE) {
                            newUser.getRelationships().setMotherId(spouse.getId());
                        }
                        
                        // Create relationship record
                        Relationship spouseChildRel = new Relationship();
                        spouseChildRel.setFromId(spouse.getId());
                        spouseChildRel.setToId(newUser.getId());
                        spouseChildRel.setType(spouse.getGender() == User.Gender.FEMALE ? 
                            Relationship.RelationType.MOTHER : Relationship.RelationType.FATHER);
                        family.getRelationships().add(spouseChildRel);
                        
                        userRepository.save(spouse);
                    }
                }
                break;
                
            case "mother":
                // New user is mother of existing user
                relationship.setFromId(newUser.getId());
                relationship.setToId(existingUserId);
                relationship.setType(Relationship.RelationType.MOTHER);
                
                // Update relationships
                newUser.getRelationships().getChildrenIds().add(existingUserId);
                existingUser.getRelationships().getParentIds().add(newUser.getId());
                existingUser.getRelationships().setMotherId(newUser.getId());
                break;
                
            case "father":
                // New user is father of existing user
                relationship.setFromId(newUser.getId());
                relationship.setToId(existingUserId);
                relationship.setType(Relationship.RelationType.FATHER);
                
                // Update relationships
                newUser.getRelationships().getChildrenIds().add(existingUserId);
                existingUser.getRelationships().getParentIds().add(newUser.getId());
                existingUser.getRelationships().setFatherId(newUser.getId());
                break;
                
            case "parent":
                // Generic parent relationship - determine type based on gender
                if (newUser.getGender() == User.Gender.MALE) {
                    relationship.setFromId(newUser.getId());
                    relationship.setToId(existingUserId);
                    relationship.setType(Relationship.RelationType.FATHER);
                    
                    newUser.getRelationships().getChildrenIds().add(existingUserId);
                    existingUser.getRelationships().getParentIds().add(newUser.getId());
                    existingUser.getRelationships().setFatherId(newUser.getId());
                } else if (newUser.getGender() == User.Gender.FEMALE) {
                    relationship.setFromId(newUser.getId());
                    relationship.setToId(existingUserId);
                    relationship.setType(Relationship.RelationType.MOTHER);
                    
                    newUser.getRelationships().getChildrenIds().add(existingUserId);
                    existingUser.getRelationships().getParentIds().add(newUser.getId());
                    existingUser.getRelationships().setMotherId(newUser.getId());
                } else {
                    // Default to father for OTHER gender
                    relationship.setFromId(newUser.getId());
                    relationship.setToId(existingUserId);
                    relationship.setType(Relationship.RelationType.FATHER);
                    
                    newUser.getRelationships().getChildrenIds().add(existingUserId);
                    existingUser.getRelationships().getParentIds().add(newUser.getId());
                    existingUser.getRelationships().setFatherId(newUser.getId());
                }
                break;
                
            case "spouse":
                // New user is spouse of existing user
                relationship.setFromId(existingUserId);
                relationship.setToId(newUser.getId());
                relationship.setType(Relationship.RelationType.SPOUSE);
                
                // Update relationships (bidirectional)
                existingUser.getRelationships().setSpouseId(newUser.getId());
                newUser.getRelationships().setSpouseId(existingUserId);
                
                // Create reverse relationship
                Relationship reverseRelationship = new Relationship();
                reverseRelationship.setFromId(newUser.getId());
                reverseRelationship.setToId(existingUserId);
                reverseRelationship.setType(Relationship.RelationType.SPOUSE);
                family.getRelationships().add(reverseRelationship);
                break;
                
            default:
                throw new RuntimeException("Invalid relationship type: " + relationshipType);
        }
        
        // Save relationship
        family.getRelationships().add(relationship);
        
        // Update users
        userRepository.save(existingUser);
        userRepository.save(newUser);
    }
    
    @Transactional
    public void removeMember(String familyKey, String userId) {
        Family family = familyRepository.findByFamilyKey(familyKey)
            .orElseThrow(() -> new RuntimeException("Family not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Mark user as inactive
        user.setIsActive(false);
        userRepository.save(user);
        
        // Remove from family member list
        family.getMemberIds().remove(userId);
        
        // Clean up relationships in family
        family.getRelationships().removeIf(rel -> 
            rel.getFromId().equals(userId) || rel.getToId().equals(userId));
        
        // Update other users' relationships
        List<User> allMembers = userRepository.findAllById(family.getMemberIds());
        for (User member : allMembers) {
            if (!member.getId().equals(userId) && member.getIsActive()) {
                User.Relationships relationships = member.getRelationships();
                
                // Remove from children lists
                relationships.getChildrenIds().remove(userId);
                
                // Remove from parent lists
                relationships.getParentIds().remove(userId);
                
                // Clear spouse relationship
                if (userId.equals(relationships.getSpouseId())) {
                    relationships.setSpouseId(null);
                }
                
                // Clear mother/father references
                if (userId.equals(relationships.getMotherId())) {
                    relationships.setMotherId(null);
                }
                if (userId.equals(relationships.getFatherId())) {
                    relationships.setFatherId(null);
                }
                
                userRepository.save(member);
            }
        }
        
        // Clean up orphaned nodes - remove members with no relationships
        cleanupOrphanedNodes(family);
        
        familyRepository.save(family);
        
        log.info("Member removed successfully: {} from family: {}", user.getFullName(), family.getName());
    }
    
    private void cleanupOrphanedNodes(Family family) {
        List<User> activeMembers = userRepository.findAllById(family.getMemberIds())
            .stream()
            .filter(User::getIsActive)
            .toList();
        
        // Find members with no relationships (orphaned nodes)
        List<String> orphanedIds = new ArrayList<>();
        
        for (User member : activeMembers) {
            User.Relationships rel = member.getRelationships();
            boolean hasRelationships = false;
            
            // Check if member has any active relationships
            if (rel.getSpouseId() != null && 
                activeMembers.stream().anyMatch(m -> m.getId().equals(rel.getSpouseId()))) {
                hasRelationships = true;
            }
            
            if (!rel.getChildrenIds().isEmpty() && 
                rel.getChildrenIds().stream().anyMatch(id -> 
                    activeMembers.stream().anyMatch(m -> m.getId().equals(id)))) {
                hasRelationships = true;
            }
            
            if (!rel.getParentIds().isEmpty() && 
                rel.getParentIds().stream().anyMatch(id -> 
                    activeMembers.stream().anyMatch(m -> m.getId().equals(id)))) {
                hasRelationships = true;
            }
            
            // If no relationships and not the only member, mark as orphaned
            if (!hasRelationships && activeMembers.size() > 1) {
                orphanedIds.add(member.getId());
            }
        }
        
        // Remove orphaned nodes
        for (String orphanedId : orphanedIds) {
            family.getMemberIds().remove(orphanedId);
            User orphanedUser = userRepository.findById(orphanedId).orElse(null);
            if (orphanedUser != null) {
                orphanedUser.setIsActive(false);
                userRepository.save(orphanedUser);
            }
        }
    }
    
    public void updateFamilyName(String familyKey, String newName) {
        Family family = familyRepository.findByFamilyKey(familyKey)
            .orElseThrow(() -> new RuntimeException("Family not found"));
        
        family.setName(newName);
        familyRepository.save(family);
        
        // Update login details
        LoginDetails loginDetails = loginDetailsRepository.findByUsername(familyKey)
            .orElseThrow(() -> new RuntimeException("User not found"));
        loginDetails.setFamilyName(newName);
        loginDetailsRepository.save(loginDetails);
        
        log.info("Family name updated successfully: {} for family key: {}", newName, familyKey);
    }
}