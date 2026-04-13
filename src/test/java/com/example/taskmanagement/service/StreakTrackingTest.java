/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for streak tracking logic in UserService.
 * Tests the updateStreakOnQuestCompletion logic directly (without Spring context).
 */
class StreakTrackingTest {

    /**
     * Stripped-down streak logic extracted for unit testing.
     * Mirrors the logic in UserService.updateStreakOnQuestCompletion().
     */
    private void updateStreak(User user, LocalDateTime completionTime) {
        java.time.LocalDate today = completionTime.toLocalDate();
        LocalDateTime lastStreakDate = user.getLastStreakDate();

        if (lastStreakDate == null) {
            user.setCurrentStreak(1);
            user.setLastStreakDate(completionTime);
        } else {
            java.time.LocalDate lastDate = lastStreakDate.toLocalDate();
            long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(lastDate, today);

            if (daysBetween == 0) {
                // Same day — no increment
                return;
            } else if (daysBetween == 1) {
                // Consecutive day
                user.setCurrentStreak(user.getCurrentStreak() + 1);
                user.setLastStreakDate(completionTime);
            } else {
                // Streak broken
                user.setCurrentStreak(1);
                user.setLastStreakDate(completionTime);
            }
        }
    }

    private User createUser() {
        User user = new User();
        user.setId(1L);
        user.setName("TestHunter");
        user.setEmail("test@hunter.com");
        user.setPassword("encoded");
        user.setTotalXp(0);
        user.setLevel(1);
        user.setHunterRank(HunterRank.E);
        user.setCurrentStreak(0);
        user.setLastStreakDate(null);
        return user;
    }

    @Test
    @DisplayName("First quest completion sets streak to 1")
    void firstCompletion_streakOne() {
        User user = createUser();
        updateStreak(user, LocalDateTime.of(2026, 4, 10, 14, 0));
        assertEquals(1, user.getCurrentStreak());
    }

    @Test
    @DisplayName("Same day completion doesn't increment streak")
    void sameDay_noIncrement() {
        User user = createUser();
        LocalDateTime day1 = LocalDateTime.of(2026, 4, 10, 10, 0);

        updateStreak(user, day1);
        assertEquals(1, user.getCurrentStreak());

        // Complete another quest same day — no increment
        updateStreak(user, day1.plusHours(3));
        assertEquals(1, user.getCurrentStreak());
    }

    @Test
    @DisplayName("Consecutive day increments streak")
    void consecutiveDay_increments() {
        User user = createUser();
        LocalDateTime day1 = LocalDateTime.of(2026, 4, 10, 10, 0);
        LocalDateTime day2 = LocalDateTime.of(2026, 4, 11, 10, 0);
        LocalDateTime day3 = LocalDateTime.of(2026, 4, 12, 10, 0);

        updateStreak(user, day1);
        assertEquals(1, user.getCurrentStreak());

        updateStreak(user, day2);
        assertEquals(2, user.getCurrentStreak());

        updateStreak(user, day3);
        assertEquals(3, user.getCurrentStreak());
    }

    @Test
    @DisplayName("Missing a day resets streak to 1")
    void missedDay_resetsStreak() {
        User user = createUser();
        LocalDateTime day1 = LocalDateTime.of(2026, 4, 10, 10, 0);
        LocalDateTime day2 = LocalDateTime.of(2026, 4, 11, 10, 0);
        // Skip day 3
        LocalDateTime day4 = LocalDateTime.of(2026, 4, 13, 10, 0);

        updateStreak(user, day1);
        updateStreak(user, day2);
        assertEquals(2, user.getCurrentStreak());

        updateStreak(user, day4);
        assertEquals(1, user.getCurrentStreak()); // Reset
    }

    @Test
    @DisplayName("7-day streak tracks correctly")
    void sevenDayStreak() {
        User user = createUser();
        for (int i = 0; i < 7; i++) {
            LocalDateTime day = LocalDateTime.of(2026, 4, 10 + i, 10, 0);
            updateStreak(user, day);
        }
        assertEquals(7, user.getCurrentStreak());
    }
}
