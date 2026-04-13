/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.dto;

public class UserDTO {

    public static class ProfileUpdateRequest {
        private String name;
        private String currentPassword;
        private String newPassword;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class ProfileResponse {
        private Long id;
        private String name;
        private String email;
        private int totalXp;
        private int level;
        private String hunterRank;
        private int currentStreak;

        public static ProfileResponse fromUser(com.example.taskmanagement.model.User user) {
            ProfileResponse r = new ProfileResponse();
            r.id = user.getId();
            r.name = user.getName();
            r.email = user.getEmail();
            r.totalXp = user.getTotalXp();
            r.level = user.getLevel();
            r.hunterRank = user.getHunterRank().getDisplayName();
            r.currentStreak = user.getCurrentStreak();
            return r;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public int getTotalXp() { return totalXp; }
        public int getLevel() { return level; }
        public String getHunterRank() { return hunterRank; }
        public int getCurrentStreak() { return currentStreak; }
    }

    public static class PasswordResetRequest {
        private String email;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class PasswordResetConfirmRequest {
        private String token;
        private String newPassword;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
