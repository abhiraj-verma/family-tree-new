package com.familytree.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "families")
public class Family {
    @Id
    private String id;
    
    @NotBlank(message = "Family name is required")
    private String name;
    
    @Indexed(unique = true)
    private String familyKey; // This will be the username from login_details
    
    private FamilyNode rootNode;
    private Set<String> memberIds = new HashSet<>();
    private List<Relationship> relationships = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FamilyNode {
        private String uId;
        private Integer location;
        private List<FamilyNode> children = new ArrayList<>();
        private List<FamilyNode> parents = new ArrayList<>();
        private List<FamilyNode> spouse = new ArrayList<>();
    }
}