package com.familytree.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService {
    
    @Value("${wasabi.access-key}")
    private String accessKey;
    
    @Value("${wasabi.secret-key}")
    private String secretKey;
    
    @Value("${wasabi.bucket-name}")
    private String bucketName;
    
    @Value("${wasabi.region}")
    private String region;
    
    @Value("${wasabi.endpoint}")
    private String endpoint;
    
    private S3Client getS3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        
        return S3Client.builder()
            .region(Region.of(region))
            .endpointOverride(URI.create(endpoint))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .build();
    }
    
    public String uploadImage(MultipartFile file, String userId) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File must be an image");
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = "users/" + userId + "/" + UUID.randomUUID() + extension;
        
        try {
            S3Client s3Client = getS3Client();
            
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(filename)
                .contentType(contentType)
                .contentLength(file.getSize())
                .build();
            
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            
            String imageUrl = endpoint + "/" + bucketName + "/" + filename;
            
            log.info("Image uploaded successfully: {}", imageUrl);
            
            return imageUrl;
            
        } catch (IOException e) {
            log.error("Error uploading image: ", e);
            throw new RuntimeException("Failed to upload image", e);
        }
    }
    
    public void deleteImage(String imageUrl) {
        try {
            // Extract key from URL
            String key = imageUrl.substring(imageUrl.indexOf(bucketName) + bucketName.length() + 1);
            
            S3Client s3Client = getS3Client();
            
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
            
            s3Client.deleteObject(deleteObjectRequest);
            
            log.info("Image deleted successfully: {}", imageUrl);
            
        } catch (Exception e) {
            log.error("Error deleting image: ", e);
            throw new RuntimeException("Failed to delete image", e);
        }
    }
}