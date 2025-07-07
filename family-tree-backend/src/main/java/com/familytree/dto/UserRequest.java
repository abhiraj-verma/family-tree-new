package com.familytree.dto;

import com.familytree.model.User;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.time.LocalDate;

@Data
public class UserRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    private String nickName;
    private String mobile;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String bio;
    private User.Gender gender;
    private String bloodGroup;
    private LocalDate birthDay;
    private LocalDate marriageAnniversary;
    private String rewards;
    private String job;
    private String education;
    private String familyDoctor;
    private LocalDate deathAnniversary;
    private String imageUrl;
    private Integer location;
}