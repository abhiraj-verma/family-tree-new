package com.familytree.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "relationships")
public class Relationship {
    @Id
    private String id;
    
    @NotBlank(message = "From ID is required")
    private String fromId;
    
    @NotBlank(message = "To ID is required")
    private String toId;
    
    private RelationType type;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    public enum RelationType {
        MOTHER, FATHER, CHILD, SPOUSE
    }
}