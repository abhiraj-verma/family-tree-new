package com.familytree.controller;

import com.familytree.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ImageController {
    
    private final ImageService imageService;
    
    @PostMapping("/upload/{userId}")
    public ResponseEntity<String> uploadImage(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadImage(file, userId);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            log.error("Failed to upload image: ", e);
            return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteImage(@RequestParam String imageUrl) {
        try {
            imageService.deleteImage(imageUrl);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete image: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}