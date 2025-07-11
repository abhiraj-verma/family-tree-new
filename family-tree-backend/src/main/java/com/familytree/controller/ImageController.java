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
public class ImageController {
    
    private final ImageService imageService;
    
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam String userId,
            @RequestParam("file") MultipartFile file) {
        String imageUrl = imageService.uploadImage(file, userId);
        return ResponseEntity.ok(imageUrl);
    }
    
    @PutMapping("/delete")
    public ResponseEntity<Void> deleteImage(@RequestParam String imageUrl) {
        imageService.deleteImage(imageUrl);
        return ResponseEntity.ok().build();
    }
}