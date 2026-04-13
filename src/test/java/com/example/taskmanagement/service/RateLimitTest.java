/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.config.RateLimitConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the login rate limiting logic.
 */
class RateLimitTest {

    private RateLimitConfig.LoginAttemptService limiter;

    @BeforeEach
    void setUp() {
        limiter = new RateLimitConfig.LoginAttemptService();
    }

    @Test
    @DisplayName("Initially not locked")
    void initiallyNotLocked() {
        assertFalse(limiter.isLocked("test@user.com"));
    }

    @Test
    @DisplayName("5 remaining attempts initially")
    void fiveAttemptsInitially() {
        assertEquals(5, limiter.getRemainingAttempts("test@user.com"));
    }

    @Test
    @DisplayName("Failed attempt decrements remaining count")
    void failedAttempt_decrementsCount() {
        limiter.recordFailedAttempt("test@user.com");
        assertEquals(4, limiter.getRemainingAttempts("test@user.com"));
    }

    @Test
    @DisplayName("5 failed attempts locks the account")
    void fiveFailedAttempts_locks() {
        String email = "test@user.com";
        for (int i = 0; i < 5; i++) {
            limiter.recordFailedAttempt(email);
        }
        assertTrue(limiter.isLocked(email));
        assertEquals(0, limiter.getRemainingAttempts(email));
    }

    @Test
    @DisplayName("4 failed attempts does NOT lock")
    void fourFailedAttempts_notLocked() {
        String email = "test@user.com";
        for (int i = 0; i < 4; i++) {
            limiter.recordFailedAttempt(email);
        }
        assertFalse(limiter.isLocked(email));
        assertEquals(1, limiter.getRemainingAttempts(email));
    }

    @Test
    @DisplayName("Successful login resets attempts")
    void successResets() {
        String email = "test@user.com";
        limiter.recordFailedAttempt(email);
        limiter.recordFailedAttempt(email);
        limiter.recordSuccess(email);
        assertEquals(5, limiter.getRemainingAttempts(email));
        assertFalse(limiter.isLocked(email));
    }

    @Test
    @DisplayName("Different emails are tracked independently")
    void independentTracking() {
        limiter.recordFailedAttempt("user1@test.com");
        limiter.recordFailedAttempt("user1@test.com");
        limiter.recordFailedAttempt("user1@test.com");

        assertEquals(2, limiter.getRemainingAttempts("user1@test.com"));
        assertEquals(5, limiter.getRemainingAttempts("user2@test.com"));
    }
}
