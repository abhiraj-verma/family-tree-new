package com.familytree.dto;

import com.familytree.model.Relationship;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class RelationshipRequest {
    @NotBlank(message = "From ID is required")
    private String fromId;
    
    @NotBlank(message = "To ID is required")
    private String toId;
    
    private Relationship.RelationType type;
}