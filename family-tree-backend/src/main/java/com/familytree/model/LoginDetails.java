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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "login_details")
public class LoginDetails {
    @Id
    private String id;
    
    @NotBlank(message = "Username is required")
    @Indexed(unique = true)
    private String username;
    
    private String password; // Encrypted
    
    private String mobile;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String familyName;
    private Boolean isGoogleSignIn = false;
    private String token;
    private LocalDateTime tokenExpiryDate;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}