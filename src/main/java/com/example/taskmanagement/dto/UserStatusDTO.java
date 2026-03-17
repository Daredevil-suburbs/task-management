package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.User;
import lombok.Data;

@Data
public class UserStatusDTO {

    private String name;
    private String email;
    private int totalXp;
    private int level;
    private String hunterRank;       // e.g. "S Rank"
    private int xpToNextLevel;
    private int xpToNextRank;
    private int tasksCompleted;
    private boolean isMaxRank;

    public static UserStatusDTO from(User user, int xpToNextLevel,
                                     int xpToNextRank, int tasksCompleted) {
        UserStatusDTO dto = new UserStatusDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setTotalXp(user.getTotalXp());
        dto.setLevel(user.getLevel());
        dto.setHunterRank(user.getHunterRank().getDisplayName());
        dto.setXpToNextLevel(xpToNextLevel);
        dto.setXpToNextRank(xpToNextRank);
        dto.setTasksCompleted(tasksCompleted);
        dto.setMaxRank(user.getHunterRank() == HunterRank.S);
        return dto;
    }
}
