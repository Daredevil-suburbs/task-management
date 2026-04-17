/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * Core engine for the Hunter levelling system.
 *
 * XP Calculation Formula:
 *   Final XP = Base XP (50) × Priority Multiplier × Deadline Multiplier
 *
 * Priority Multipliers:
 *   - LOW    → ×1.0
 *   - MEDIUM → ×1.5
 *   - HIGH   → ×2.0
 *
 * Deadline Multipliers:
 *   - Completed before deadline day → ×1.0
 *   - Completed ON the exact deadline day → ×1.5 (clutch bonus)
 *   - Completed late → ×0.5 (penalty)
 *
 * Rank thresholds (see HunterRank enum):
 *   E-Rank: 0 - 1000 XP
 *   D-Rank: 1001 - 5000 XP
 *   C-Rank: 5001 - 15000 XP
 *   B-Rank: 15001 - 50000 XP
 *   A-Rank: 50001+ XP
 */
@Service
public class LevelService {

    /**
     * Award XP to a user and recalculate their level + rank.
     * Uses dynamic XP calculation with priority and deadline multipliers.
     *
     * @param user      the user to update
     * @param baseXp    the raw xpReward on the task (default 50)
     * @param priority  the task's priority (affects XP multiplier)
     * @param dueDate   the task's due date (affects deadline multiplier)
     * @param completedAt when the task was completed
     * @return the same user object with updated fields (caller must save)
     */
    public User awardXp(User user, int baseXp, Task.Priority priority,
                        LocalDate dueDate, LocalDate completedAt) {

        int earned = calculateDynamicXp(baseXp, priority, dueDate, completedAt);
        int newTotal = user.getTotalXp() + earned;

        user.setTotalXp(newTotal);
        user.setLevel(HunterRank.levelFromXp(newTotal));
        user.setHunterRank(HunterRank.fromXp(newTotal));

        return user;
    }

    /**
     * Legacy method for backwards compatibility.
     * Uses only priority multiplier, assumes no deadline pressure.
     */
    public User awardXp(User user, int baseXp, Task.Priority priority) {
        return awardXp(user, baseXp, priority, null, LocalDate.now());
    }

    // ── XP Calculation ─────────────────────────────────────────────────────

    /**
     * Calculate XP with dynamic multipliers for priority and deadline.
     */
    public int calculateDynamicXp(int baseXp, Task.Priority priority,
                                   LocalDate dueDate, LocalDate completedAt) {
        double priorityMultiplier = getPriorityMultiplier(priority);
        double deadlineMultiplier = getDeadlineMultiplier(dueDate, completedAt);

        return (int) Math.round(baseXp * priorityMultiplier * deadlineMultiplier);
    }

    /**
     * Get priority multiplier.
     * LOW=1.0, MEDIUM=1.5, HIGH=2.0
     */
    public double getPriorityMultiplier(Task.Priority priority) {
        return switch (priority) {
            case LOW    -> 1.0;
            case MEDIUM -> 1.5;
            case HIGH   -> 2.0;
        };
    }

    /**
     * Get deadline multiplier based on when task was completed.
     * - Before deadline day: 1.0
     * - ON exact deadline day: 1.5 (clutch bonus)
     * - Late: 0.5 (penalty)
     */
    public double getDeadlineMultiplier(LocalDate dueDate, LocalDate completedAt) {
        if (dueDate == null || completedAt == null) {
            return 1.0; // No deadline pressure
        }

        int daysComparison = completedAt.compareTo(dueDate);

        if (daysComparison < 0) {
            // Completed before deadline day
            return 1.0;
        } else if (daysComparison == 0) {
            // Completed ON the exact deadline day - clutch bonus!
            return 1.5;
        } else {
            // Completed late - penalty
            return 0.5;
        }
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /**
     * How much XP until the user's next rank? Returns 0 at max rank.
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
