package com.familytree.controller;

import com.familytree.dto.UserRequest;
import com.familytree.model.User;
import com.familytree.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Failed to get user: ", e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable String userId,
            @Valid @RequestBody UserRequest userRequest) {
        try {
            User user = userService.updateUser(userId, userRequest);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Failed to update user: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        try {
            List<User> users = userService.searchUsers(query);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Failed to search users: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}