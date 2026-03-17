package com.example.taskmanagement.model;

public enum HunterRank {

    E("E Rank", 0,      999),
    D("D Rank", 1000,   2999),
    C("C Rank", 3000,   5999),
    B("B Rank", 6000,   9999),
    A("A Rank", 10000,  14999),
    S("S Rank", 15000,  Integer.MAX_VALUE);

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

    // Determine rank from total XP
    public static HunterRank fromXp(int totalXp) {
        HunterRank result = E;
        for (HunterRank rank : values()) {
            if (totalXp >= rank.minXp) result = rank;
        }
        return result;
    }

    // Determine level from total XP (every 100 XP = 1 level, min level 1)
    public static int levelFromXp(int totalXp) {
        return Math.max(1, totalXp / 100);
    }

    // How much XP needed to reach next rank (0 if already S)
    public int xpToNextRank(int currentXp) {
        if (this == S) return 0;
        return maxXp + 1 - currentXp;
    }
}
