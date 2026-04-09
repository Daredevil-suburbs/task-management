package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.User;

public class LeaderboardDTO {

    public static class Entry {
        private Long userId;
        private String name;
        private String email;
        private int totalXp;
        private int level;
        private String hunterRank;
        private int rank; // Position on leaderboard

        public static Entry fromUser(User user, int rank) {
            Entry entry = new Entry();
            entry.userId = user.getId();
            entry.name = user.getName();
            entry.email = user.getEmail();
            entry.totalXp = user.getTotalXp();
            entry.level = user.getLevel();
            entry.hunterRank = user.getHunterRank().getDisplayName();
            entry.rank = rank;
            return entry;
        }

        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public int getTotalXp() { return totalXp; }
        public int getLevel() { return level; }
        public String getHunterRank() { return hunterRank; }
        public int getRank() { return rank; }
    }
}
