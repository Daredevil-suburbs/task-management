/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.model;

/**
 * Hunter Rank system based on absolute XP thresholds.
 *
 * Rank thresholds:
 *   E-Rank: 0 - 1000 XP
 *   D-Rank: 1001 - 5000 XP
 *   C-Rank: 5001 - 15000 XP
 *   B-Rank: 15001 - 50000 XP
 *   A-Rank: 50001+ XP
 */
public enum HunterRank {

    E("E Rank", 0, 999),
    D("D Rank", 1000, 2999),
    C("C Rank", 3000, 5999),
    B("B Rank", 6000, 9999),
    A("A Rank", 10000, 14999),
    S("S Rank", 15000, Integer.MAX_VALUE);

    private final String displayName;
    private final int minXp;
    private final int maxXp;

    HunterRank(String displayName, int minXp, int maxXp) {
        this.displayName = displayName;
        this.minXp = minXp;
        this.maxXp = maxXp;
    }

    public String getDisplayName() { return displayName; }
    public int getMinXp()          { return minXp; }
    public int getMaxXp()          { return maxXp; }

    /**
     * Determine rank from total XP based on absolute thresholds.
     */
    public static HunterRank fromXp(int totalXp) {
        for (HunterRank rank : values()) {
            if (totalXp >= rank.minXp && totalXp <= rank.maxXp) {
                return rank;
            }
        }
        // Fallback for edge cases
        return totalXp < E.minXp ? E : S;
    }

    /**
     * Determine level from total XP (every 100 XP = 1 level, min level 1).
     */
    public static int levelFromXp(int totalXp) {
        return Math.max(1, totalXp / 100);
    }

    /**
     * How much XP needed to reach next rank (0 if already at max rank).
     */
    public int xpToNextRank(int currentXp) {
        if (this == S) return 0;

        // Find next rank
        HunterRank nextRank = null;
        for (HunterRank rank : values()) {
            if (rank.ordinal() == this.ordinal() + 1) {
                nextRank = rank;
                break;
            }
        }

        return nextRank != null ? nextRank.minXp - currentXp : 0;
    }
}
