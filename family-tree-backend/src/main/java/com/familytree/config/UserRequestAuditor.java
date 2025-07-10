package com.familytree.config;

import com.familytree.dto.UserContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

@Configuration
public class UserRequestAuditor implements AuditorAware<String> {
    public static final ThreadLocal<UserContext> currentUser = ThreadLocal.withInitial(UserContext::new);

    public UserRequestAuditor() {}

    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.ofNullable(currentUser.get().getUsername());
    }

    public static void clearContext(){currentUser.remove();}

    public static void setUsername(String username) {
        currentUser.get().setUsername(username);
    }

    public static UserContext getCurrentUser() {
        return currentUser.get();
    }
}
