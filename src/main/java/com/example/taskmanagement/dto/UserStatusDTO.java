package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.User;

public class UserStatusDTO {

    private String name;
    private String email;
    private int totalXp;
    private int level;
    private String hunterRank;
    private int xpToNextLevel;
    private int xpToNextRank;
    private int tasksCompleted;
    private boolean maxRank;

    public static UserStatusDTO from(User user, int xpToNextLevel,
                                     int xpToNextRank, int tasksCompleted) {
        UserStatusDTO dto = new UserStatusDTO();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.totalXp = user.getTotalXp();
        dto.level = user.getLevel();
        dto.hunterRank = user.getHunterRank().getDisplayName();
        dto.xpToNextLevel = xpToNextLevel;
        dto.xpToNextRank = xpToNextRank;
        dto.tasksCompleted = tasksCompleted;
        dto.maxRank = user.getHunterRank() == HunterRank.S;
        return dto;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getTotalXp() { return totalXp; }
    public int getLevel() { return level; }
    public String getHunterRank() { return hunterRank; }
    public int getXpToNextLevel() { return xpToNextLevel; }
    public int getXpToNextRank() { return xpToNextRank; }
    public int getTasksCompleted() { return tasksCompleted; }
    public boolean isMaxRank() { return maxRank; }
}
