package com.familytree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class FamilyTreeApplication {
    public static void main(String[] args) {
        SpringApplication.run(FamilyTreeApplication.class, args);
    }
}