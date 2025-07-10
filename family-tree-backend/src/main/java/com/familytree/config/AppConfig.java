package com.familytree.config;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class AppConfig implements WebMvcConfigurer {
    private final JwtTokenAuthenticationInterceptor jwtTokenAuthenticationInterceptor;

    @Autowired
    public AppConfig(@NotNull JwtTokenAuthenticationInterceptor jwtTokenAuthenticationInterceptor) {
        this.jwtTokenAuthenticationInterceptor = jwtTokenAuthenticationInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtTokenAuthenticationInterceptor).addPathPatterns(apisForJwtInterceptor());
    }

    private String[] apisForJwtInterceptor() {
        List<String> list = new ArrayList<>();
        list.add("/api/family/**");
        list.add("/api/images/**");
        list.add("/api/relationships/**");
        list.add("/api/users/**");
        list.add("/api/public/family/**");
        return list.toArray(new String[list.size()]);
    }
}
