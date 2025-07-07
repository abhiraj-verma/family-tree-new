package com.familytree.dto;

import com.familytree.model.User;
import com.familytree.model.Relationship;
import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class FamilyResponse {
    private String id;
    private String name;
    private String familyKey;
    private List<User> members;
    private List<Relationship> relationships;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}