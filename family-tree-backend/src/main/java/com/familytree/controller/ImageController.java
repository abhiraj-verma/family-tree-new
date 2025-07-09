package com.familytree.controller;

import com.familytree.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ImageController {
    
    private final ImageService imageService;
    
    @PostMapping("/upload/{userId}")
    public ResponseEntity<String> uploadImage(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {
        String imageUrl = imageService.uploadImage(file, userId);
        return ResponseEntity.ok(imageUrl);
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteImage(@RequestParam String imageUrl) {
        imageService.deleteImage(imageUrl);
        return ResponseEntity.ok().build();
    }
}