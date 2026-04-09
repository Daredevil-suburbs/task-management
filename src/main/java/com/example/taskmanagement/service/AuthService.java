package com.example.taskmanagement.service;

import com.example.taskmanagement.config.RateLimitConfig;
import com.example.taskmanagement.dto.AuthDTO;
import com.example.taskmanagement.exception.LoginLockedException;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RateLimitConfig.LoginAttemptService loginAttemptService;

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthDTO.AuthResponse(token, user.getEmail(), user.getName());
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        String email = request.getEmail();

        // Check if account is locked due to too many failed attempts
        if (loginAttemptService.isLocked(email)) {
            throw new LoginLockedException(
                "Account temporarily locked due to too many failed login attempts. Try again in 15 minutes."
            );
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );

            // Login successful - reset attempts
            loginAttemptService.recordSuccess(email);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtils.generateToken(email);
            return new AuthDTO.AuthResponse(token, email, user.getName());
        } catch (BadCredentialsException e) {
            // Record failed attempt
            loginAttemptService.recordFailedAttempt(email);
            int remaining = loginAttemptService.getRemainingAttempts(email);

            if (remaining == 0) {
                throw new LoginLockedException(
                    "Account locked due to too many failed login attempts. Try again in 15 minutes."
                );
            }

            throw new BadCredentialsException(
                "Invalid email or password. " + remaining + " attempts remaining."
            );
        }
    }
}
