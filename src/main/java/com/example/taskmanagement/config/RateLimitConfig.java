/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Configuration
public class RateLimitConfig {

    /**
     * Simple in-memory rate limiter for login attempts.
     * Tracks failed login attempts per IP/email and locks after threshold.
     */
    @Bean
    public LoginAttemptService loginAttemptService() {
        return new LoginAttemptService();
    }

    public static class LoginAttemptService {
        private static final int MAX_ATTEMPTS = 5;
        private static final long LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

        private final Map<String, Integer> attemptCounts = new ConcurrentHashMap<>();
        private final Map<String, Long> lockTimes = new ConcurrentHashMap<>();
        private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        public LoginAttemptService() {
            // Clean up old entries every 5 minutes
            scheduler.scheduleAtFixedRate(this::cleanupOldEntries, 5, 5, TimeUnit.MINUTES);
        }

        public void recordFailedAttempt(String key) {
            int attempts = attemptCounts.getOrDefault(key, 0) + 1;
            attemptCounts.put(key, attempts);

            if (attempts >= MAX_ATTEMPTS) {
                lockTimes.put(key, System.currentTimeMillis() + LOCK_TIME_MS);
            }
        }

        public void recordSuccess(String key) {
            attemptCounts.remove(key);
            lockTimes.remove(key);
        }

        public boolean isLocked(String key) {
            Long lockTime = lockTimes.get(key);
            if (lockTime == null) {
                return false;
            }

            if (System.currentTimeMillis() > lockTime) {
                // Lock expired
                attemptCounts.remove(key);
                lockTimes.remove(key);
                return false;
            }

            return true;
        }

        public int getRemainingAttempts(String key) {
            if (isLocked(key)) {
                return 0;
            }
            return Math.max(0, MAX_ATTEMPTS - attemptCounts.getOrDefault(key, 0));
        }

        private void cleanupOldEntries() {
            long now = System.currentTimeMillis();
            lockTimes.entrySet().removeIf(entry -> now > entry.getValue());
        }
    }
}
