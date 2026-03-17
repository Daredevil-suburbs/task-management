package com.example.taskmanagement.service;

import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.User;
import org.springframework.stereotype.Service;

/**
 * Core engine for the Hunter levelling system.
 *
 * XP rules:
 *   - Every 100 XP earned = 1 level gained (min level 1)
 *   - Rank is determined by total XP thresholds (see HunterRank enum)
 *
 * Priority XP multipliers (applied on top of base xpReward):
 *   - LOW    → ×1.0 (no change)
 *   - MEDIUM → ×1.5
 *   - HIGH   → ×2.0
 */
@Service
public class LevelService {

    /**
     * Award XP to a user and recalculate their level + rank.
     *
     * @param user      the user to update
     * @param baseXp    the raw xpReward on the task
     * @param priority  the task's priority (affects XP multiplier)
     * @return the same user object with updated fields (caller must save)
     */
    public User awardXp(User user, int baseXp,
                        com.example.taskmanagement.model.Task.Priority priority) {

        int earned = applyMultiplier(baseXp, priority);
        int newTotal = user.getTotalXp() + earned;

        user.setTotalXp(newTotal);
        user.setLevel(HunterRank.levelFromXp(newTotal));
        user.setHunterRank(HunterRank.fromXp(newTotal));

        return user;
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private int applyMultiplier(int base, com.example.taskmanagement.model.Task.Priority priority) {
        return switch (priority) {
            case LOW    -> base;
            case MEDIUM -> (int) (base * 1.5);
            case HIGH   -> base * 2;
        };
    }

    /**
     * How much XP until the user's next rank? Returns 0 at S rank.
     */
    public int xpToNextRank(User user) {
        return user.getHunterRank().xpToNextRank(user.getTotalXp());
    }

    /**
     * XP needed to reach the next level (next multiple of 100).
     */
    public int xpToNextLevel(User user) {
        int currentXp = user.getTotalXp();
        int nextLevelXp = (user.getLevel()) * 100; // level N requires N*100 XP
        return Math.max(0, nextLevelXp - currentXp);
    }
}
