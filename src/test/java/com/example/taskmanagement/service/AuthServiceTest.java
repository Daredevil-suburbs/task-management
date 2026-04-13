/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.config.RateLimitConfig;
import com.example.taskmanagement.dto.AuthDTO;
import com.example.taskmanagement.exception.LoginLockedException;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RateLimitConfig.LoginAttemptService loginAttemptService;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");
        testUser.setPassword("encodedPassword");
    }

    @Test
    void testRegister() {
        // Arrange
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setName("New User");

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtils.generateToken("newuser@example.com")).thenReturn("testToken");

        // Act
        AuthDTO.AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("testToken", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmail() {
        // Arrange
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("correctPassword");

        when(loginAttemptService.isLocked("test@example.com")).thenReturn(false);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtUtils.generateToken("test@example.com")).thenReturn("testToken");

        // Act
        AuthDTO.AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("testToken", response.getToken());
        verify(loginAttemptService, times(1)).recordSuccess("test@example.com");
    }

    @Test
    void testLogin_LockedAccount() {
        // Arrange
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("locked@example.com");

        when(loginAttemptService.isLocked("locked@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(LoginLockedException.class, () -> authService.login(request));
    }

    @Test
    void testLogin_BadCredentials() {
        // Arrange
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongPassword");

        when(loginAttemptService.isLocked("test@example.com")).thenReturn(false);
        when(loginAttemptService.getRemainingAttempts("test@example.com")).thenReturn(2);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        BadCredentialsException exception = assertThrows(BadCredentialsException.class,
            () -> authService.login(request));

        assertTrue(exception.getMessage().contains("2 attempts remaining"));
        verify(loginAttemptService, times(1)).recordFailedAttempt("test@example.com");
    }

    @Test
    void testLogin_LockAfterMaxAttempts() {
        // Arrange
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setEmail("test@example.com");

        when(loginAttemptService.isLocked("test@example.com")).thenReturn(false);
        when(loginAttemptService.getRemainingAttempts("test@example.com")).thenReturn(0);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        assertThrows(LoginLockedException.class, () -> authService.login(request));
    }
}
