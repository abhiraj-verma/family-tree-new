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
        list.add("/family/**");
        list.add("/images/**");
        list.add("/relationships/**");
        list.add("/users/**");
        list.add("/public/login/**");
        return list.toArray(new String[list.size()]);
    }
}
