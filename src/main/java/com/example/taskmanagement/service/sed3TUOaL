package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.UserDTO;
import com.example.taskmanagement.dto.UserStatusDTO;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private LevelService levelService;
    @Autowired private PasswordEncoder passwordEncoder;

    public UserStatusDTO getStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int tasksCompleted = taskRepository.countCompletedByUserId(user.getId());
        int xpToNextLevel  = levelService.xpToNextLevel(user);
        int xpToNextRank   = levelService.xpToNextRank(user);

        return UserStatusDTO.from(user, xpToNextLevel, xpToNextRank, tasksCompleted);
    }

    public UserDTO.ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDTO.ProfileResponse.fromUser(user);
    }

    @Transactional
    public UserDTO.ProfileResponse updateProfile(String email, UserDTO.ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }

        // Handle password change if requested
        if (request.getCurrentPassword() != null && request.getNewPassword() != null) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            if (request.getNewPassword().length() < 6) {
                throw new RuntimeException("New password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        return UserDTO.ProfileResponse.fromUser(userRepository.save(user));
    }

    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // In production, send email with reset link containing the token
        // For now, the token is returned in the response
    }

    public String initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        return resetToken; // Return token for demo purposes (in prod, send via email)
    }

    @Transactional
    public void confirmPasswordReset(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        if (newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    public void updateStreakOnQuestCompletion(User user) {
        LocalDate today = LocalDate.now();
        LocalDateTime lastStreakDate = user.getLastStreakDate();

        if (lastStreakDate == null) {
            // First completion
            user.setCurrentStreak(1);
            user.setLastStreakDate(LocalDateTime.now());
        } else {
            LocalDate lastDate = lastStreakDate.toLocalDate();
            long daysBetween = ChronoUnit.DAYS.between(lastDate, today);

            if (daysBetween == 0) {
                // Already completed a task today, don't increment streak
                return;
            } else if (daysBetween == 1) {
                // Consecutive day
                user.setCurrentStreak(user.getCurrentStreak() + 1);
                user.setLastStreakDate(LocalDateTime.now());
            } else {
                // Streak broken, reset to 1
                user.setCurrentStreak(1);
                user.setLastStreakDate(LocalDateTime.now());
            }
        }

        userRepository.save(user);
    }

    public int getStreak(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCurrentStreak();
    }
}
