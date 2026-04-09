package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.UserDTO;
import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private LevelService levelService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");
        testUser.setPassword("encodedPassword");
        testUser.setTotalXp(500);
        testUser.setLevel(5);
        testUser.setHunterRank(HunterRank.E);
        testUser.setCurrentStreak(0);
    }

    @Test
    void testGetProfile() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        UserDTO.ProfileResponse response = userService.getProfile("test@example.com");

        // Assert
        assertNotNull(response);
        assertEquals("Test User", response.getName());
        assertEquals("test@example.com", response.getEmail());
        assertEquals(500, response.getTotalXp());
        assertEquals(5, response.getLevel());
    }

    @Test
    void testUpdateProfile_NameOnly() {
        // Arrange
        UserDTO.ProfileUpdateRequest request = new UserDTO.ProfileUpdateRequest();
        request.setName("Updated Name");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        UserDTO.ProfileResponse response = userService.updateProfile("test@example.com", request);

        // Assert
        assertNotNull(response);
        assertEquals("Updated Name", testUser.getName());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdateProfile_PasswordChange() {
        // Arrange
        UserDTO.ProfileUpdateRequest request = new UserDTO.ProfileUpdateRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("newPassword123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword123")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        UserDTO.ProfileResponse response = userService.updateProfile("test@example.com", request);

        // Assert
        assertNotNull(response);
        verify(passwordEncoder, times(1)).encode("newPassword123");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdateProfile_WrongCurrentPassword() {
        // Arrange
        UserDTO.ProfileUpdateRequest request = new UserDTO.ProfileUpdateRequest();
        request.setCurrentPassword("wrongPassword");
        request.setNewPassword("newPassword123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () ->
            userService.updateProfile("test@example.com", request)
        );
    }

    @Test
    void testUpdateProfile_PasswordTooShort() {
        // Arrange
        UserDTO.ProfileUpdateRequest request = new UserDTO.ProfileUpdateRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("123"); // Too short

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () ->
            userService.updateProfile("test@example.com", request)
        );
    }

    @Test
    void testUpdateStreak_FirstCompletion() {
        // Arrange
        testUser.setLastStreakDate(null);
        testUser.setCurrentStreak(0);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateStreakOnQuestCompletion(testUser);

        // Assert
        assertEquals(1, testUser.getCurrentStreak());
        assertNotNull(testUser.getLastStreakDate());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdateStreak_ConsecutiveDay() {
        // Arrange
        testUser.setLastStreakDate(LocalDateTime.now().minusDays(1));
        testUser.setCurrentStreak(5);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateStreakOnQuestCompletion(testUser);

        // Assert
        assertEquals(6, testUser.getCurrentStreak());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdateStreak_SameDay() {
        // Arrange
        testUser.setLastStreakDate(LocalDateTime.now());
        testUser.setCurrentStreak(5);

        // Act
        userService.updateStreakOnQuestCompletion(testUser);

        // Assert
        assertEquals(5, testUser.getCurrentStreak()); // Streak unchanged
        verify(userRepository, never()).save(testUser);
    }

    @Test
    void testUpdateStreak_StreakBroken() {
        // Arrange
        testUser.setLastStreakDate(LocalDateTime.now().minusDays(3));
        testUser.setCurrentStreak(10);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateStreakOnQuestCompletion(testUser);

        // Assert
        assertEquals(1, testUser.getCurrentStreak()); // Streak reset
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testPasswordReset() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        String token = userService.initiatePasswordReset("test@example.com");

        // Assert
        assertNotNull(token);
        assertEquals(token, testUser.getResetToken());
        assertNotNull(testUser.getResetTokenExpiry());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testConfirmPasswordReset() {
        // Arrange
        String token = "test-reset-token";
        testUser.setResetToken(token);
        testUser.setResetTokenExpiry(LocalDateTime.now().plusHours(1));

        when(userRepository.findByResetToken(token)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        UserDTO.PasswordResetConfirmRequest request = new UserDTO.PasswordResetConfirmRequest();
        request.setToken(token);
        request.setNewPassword("newPassword123");

        userService.confirmPasswordReset(token, "newPassword123");

        // Assert
        assertNull(testUser.getResetToken());
        assertNull(testUser.getResetTokenExpiry());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testConfirmPasswordReset_ExpiredToken() {
        // Arrange
        String token = "expired-token";
        testUser.setResetToken(token);
        testUser.setResetTokenExpiry(LocalDateTime.now().minusHours(1));

        when(userRepository.findByResetToken(token)).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(RuntimeException.class, () ->
            userService.confirmPasswordReset(token, "newPassword123")
        );
    }
}
