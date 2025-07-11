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
import jakarta.validation.constraints.Email;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    private String nickName;
    
    private String mobile;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String imageUrl;
    private String bio;
    
    private Gender gender;
    private String bloodGroup;
    private LocalDate birthDay;
    private LocalDate marriageAnniversary;
    private String rewards;
    private String job;
    private String education;
    private String familyDoctor;
    private LocalDate deathAnniversary;
    
    private Integer location = 0;
    private Boolean isActive = true;
    private Boolean isBloodRelative = true;
    private String inactiveReason;
    
    // Relationships
    private Relationships relationships = new Relationships();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Relationships {
        private String spouseId;
        private List<String> childrenIds = new ArrayList<>();
        private List<String> parentIds = new ArrayList<>();
        private String motherId;
        private String fatherId;
    }
}