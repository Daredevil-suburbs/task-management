/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.model;

import jakarta.persistence.*;

/**
 * Achievement definition — a badge that can be unlocked.
 * Examples: "Complete 10 Quests", "Reach B Rank", "7-Day Streak"
 *
 * Seeded on startup by AchievementSeeder.
 */
@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique machine key, e.g. "QUESTS_10", "RANK_B", "STREAK_7" */
    @Column(name = "achievement_key", nullable = false, unique = true)
    private String key;

    /** Display name shown to users */
    @Column(nullable = false)
    private String name;

    /** Description of how to earn it */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Icon identifier (emoji or icon name for frontend) */
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AchievementCategory category;

    public enum AchievementCategory {
        QUEST,      // based on quest completion count
        RANK,       // based on hunter rank
        STREAK,     // based on daily streak
        SPECIAL     // one-off achievements
    }

    // ── Getters & Setters ──────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public AchievementCategory getCategory() { return category; }
    public void setCategory(AchievementCategory category) { this.category = category; }
}
