package com.familytree.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String publicUrl;
    private String sessionToken;
    private String username;
    private String familyName;
    private LocalDateTime expireOn;
}