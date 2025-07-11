package com.familytree.config;

import com.familytree.repository.LoginDetailsRepository;
import com.familytree.service.JwtTokenProviderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class JwtTokenAuthenticationInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JwtTokenProviderService jwtTokenProviderService;
    private final LoginDetailsRepository loginDetailsRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        try {
            String token = StringUtils.hasText(request.getHeader("token")) ?
                    request.getHeader("token") : request.getParameter("token") ;
            if (!StringUtils.hasText(token)) {
                throw new RuntimeException("Jwt token not found");
            }
            Claims claims = jwtTokenProviderService.validateToken(token);
            if (!claims.getExpiration().after(new Date())) {
                    throw new RuntimeException("Jwt token expired");
                }
            String username = claims.getSubject();
            loginDetailsRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            UserRequestAuditor.setUsername(username);
        } catch (RuntimeException ex) {
            log.warn("JWT Authentication error: {}", ex.getMessage());
            buildFailureResponse(response, ex.getMessage());
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
        UserRequestAuditor.clearContext();
    }

    private void buildFailureResponse(HttpServletResponse response, String errorMessage) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpStatus.FORBIDDEN.value());
        Map<String, String> map = new HashMap<>();
        map.put("message", errorMessage);
        map.put("timestamp", String.valueOf(LocalDateTime.now()));
        map.put("status", String.valueOf(HttpStatus.FORBIDDEN.value()));
        response.getWriter().write(objectMapper.writeValueAsString(map));
    }
}
