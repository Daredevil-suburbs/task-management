/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.model.Achievement;
import com.example.taskmanagement.model.Achievement.AchievementCategory;
import com.example.taskmanagement.repository.AchievementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds the achievements table on startup with all badge definitions.
 * Idempotent — skips any achievement that already exists (by key).
 * Uses ApplicationReadyEvent to ensure JPA is fully initialized.
 */
@Component
public class AchievementSeeder {

    private static final Logger logger = LoggerFactory.getLogger(AchievementSeeder.class);

    @Autowired
    private AchievementRepository achievementRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        // Only seed once
        if (achievementRepository.count() > 0) {
            return;
        }

        logger.info("🌱 Seeding achievements...");
        int created = 0;

        // ── Quest milestones ──────────────────────────────────────────────
        created += seedIfMissing("FIRST_QUEST", "First Blood",
                "Complete your first quest", "⚔️", AchievementCategory.QUEST);
        created += seedIfMissing("QUESTS_10", "Rising Hunter",
                "Complete 10 quests", "🗡️", AchievementCategory.QUEST);
        created += seedIfMissing("QUESTS_25", "Seasoned Hunter",
                "Complete 25 quests", "🏹", AchievementCategory.QUEST);
        created += seedIfMissing("QUESTS_50", "Veteran Hunter",
                "Complete 50 quests", "🛡️", AchievementCategory.QUEST);
        created += seedIfMissing("QUESTS_100", "Elite Hunter",
                "Complete 100 quests", "👑", AchievementCategory.QUEST);
        created += seedIfMissing("QUESTS_500", "Legendary Hunter",
                "Complete 500 quests", "🌟", AchievementCategory.QUEST);

        // ── Rank milestones ───────────────────────────────────────────────
        created += seedIfMissing("RANK_D", "D-Rank Awakening",
                "Reach D Rank", "🔵", AchievementCategory.RANK);
        created += seedIfMissing("RANK_C", "C-Rank Breakthrough",
                "Reach C Rank", "🟢", AchievementCategory.RANK);
        created += seedIfMissing("RANK_B", "B-Rank Power",
                "Reach B Rank", "🟡", AchievementCategory.RANK);
        created += seedIfMissing("RANK_A", "A-Rank Authority",
                "Reach A Rank", "🟠", AchievementCategory.RANK);
        created += seedIfMissing("RANK_S", "S-Rank Sovereign",
                "Reach S Rank — the pinnacle", "🔴", AchievementCategory.RANK);

        // ── XP milestones ─────────────────────────────────────────────────
        created += seedIfMissing("XP_1000", "XP Grinder",
                "Earn 1,000 total XP", "💎", AchievementCategory.SPECIAL);
        created += seedIfMissing("XP_5000", "XP Hoarder",
                "Earn 5,000 total XP", "💰", AchievementCategory.SPECIAL);
        created += seedIfMissing("XP_10000", "XP Titan",
                "Earn 10,000 total XP", "🏆", AchievementCategory.SPECIAL);

        // ── Streak milestones (evaluated when streak tracking is added) ───
        created += seedIfMissing("STREAK_7", "Week Warrior",
                "Maintain a 7-day completion streak", "🔥", AchievementCategory.STREAK);
        created += seedIfMissing("STREAK_30", "Monthly Machine",
                "Maintain a 30-day completion streak", "⚡", AchievementCategory.STREAK);

        logger.info("🌱 Achievement seeding complete — {} total seeded this run", created);
    }

    private int seedIfMissing(String key, String name, String description,
                               String icon, AchievementCategory category) {
        // Redundant check because of if(count > 0) but good for safety
        if (achievementRepository.existsByKey(key)) return 0;

        Achievement a = new Achievement();
        a.setKey(key);
        a.setName(name);
        a.setDescription(description);
        a.setIcon(icon);
        a.setCategory(category);
        achievementRepository.save(a);
        return 1;
    }
}
