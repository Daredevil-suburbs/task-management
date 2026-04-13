/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Achievement;
import com.example.taskmanagement.model.UserAchievement;

import java.time.LocalDateTime;

public class AchievementDTO {

    // ── Response — single achievement with unlock status ───────────────────
    public static class Response {

        private Long id;
        private String key;
        private String name;
        private String description;
        private String icon;
        private Achievement.AchievementCategory category;
        private boolean unlocked;
        private LocalDateTime unlockedAt;

        public static Response from(Achievement a, boolean unlocked, LocalDateTime unlockedAt) {
            Response r = new Response();
            r.id = a.getId();
            r.key = a.getKey();
            r.name = a.getName();
            r.description = a.getDescription();
            r.icon = a.getIcon();
            r.category = a.getCategory();
            r.unlocked = unlocked;
            r.unlockedAt = unlockedAt;
            return r;
        }

        public static Response fromUnlocked(UserAchievement ua) {
            Achievement a = ua.getAchievement();
            return from(a, true, ua.getUnlockedAt());
        }

        public Long getId() { return id; }
        public String getKey() { return key; }
        public String getName() { return name; }
        public String getDescription() { return description; }
        public String getIcon() { return icon; }
        public Achievement.AchievementCategory getCategory() { return category; }
        public boolean isUnlocked() { return unlocked; }
        public LocalDateTime getUnlockedAt() { return unlockedAt; }
    }

    // ── Notification — lightweight object for "just unlocked" popups ──────
    public static class UnlockNotification {

        private String key;
        private String name;
        private String icon;
        private String message;

        public UnlockNotification(Achievement a) {
            this.key = a.getKey();
            this.name = a.getName();
            this.icon = a.getIcon();
            this.message = "🏆 Achievement Unlocked: " + a.getName() + "!";
        }

        public String getKey() { return key; }
        public String getName() { return name; }
        public String getIcon() { return icon; }
        public String getMessage() { return message; }
    }
}
