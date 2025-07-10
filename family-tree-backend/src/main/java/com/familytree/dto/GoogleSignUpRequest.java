package com.familytree.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleSignUpRequest {
    @NotBlank(message = "GoogleId is required")
    private String googleId;

    @Email(message = "Invalid email format")
    private String email;
}
