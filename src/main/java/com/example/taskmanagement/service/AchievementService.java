package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.AchievementDTO;
import com.example.taskmanagement.model.Achievement;
import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.model.UserAchievement;
import com.example.taskmanagement.repository.AchievementRepository;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserAchievementRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private static final Logger logger = LoggerFactory.getLogger(AchievementService.class);

    @Autowired private AchievementRepository achievementRepository;
    @Autowired private UserAchievementRepository userAchievementRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;

    // ── Check and award achievements after quest completion ────────────────

    /**
     * Evaluates all achievement conditions for a user and unlocks any newly met ones.
     * Called after every quest completion.
     *
     * @return list of newly unlocked achievement notifications (for popup display)
     */
    @Transactional
    public List<AchievementDTO.UnlockNotification> checkAndAward(User user) {
        List<AchievementDTO.UnlockNotification> newUnlocks = new ArrayList<>();
        int completedCount = taskRepository.countCompletedByUserId(user.getId());

        // ── Quest milestones ──────────────────────────────────────────────
        checkQuestMilestone(user, completedCount, "FIRST_QUEST",  1,   newUnlocks);
        checkQuestMilestone(user, completedCount, "QUESTS_10",    10,  newUnlocks);
        checkQuestMilestone(user, completedCount, "QUESTS_25",    25,  newUnlocks);
        checkQuestMilestone(user, completedCount, "QUESTS_50",    50,  newUnlocks);
        checkQuestMilestone(user, completedCount, "QUESTS_100",   100, newUnlocks);
        checkQuestMilestone(user, completedCount, "QUESTS_500",   500, newUnlocks);

        // ── Rank milestones ───────────────────────────────────────────────
        checkRankMilestone(user, "RANK_D", HunterRank.D, newUnlocks);
        checkRankMilestone(user, "RANK_C", HunterRank.C, newUnlocks);
        checkRankMilestone(user, "RANK_B", HunterRank.B, newUnlocks);
        checkRankMilestone(user, "RANK_A", HunterRank.A, newUnlocks);
        checkRankMilestone(user, "RANK_S", HunterRank.S, newUnlocks);

        // ── XP milestones ─────────────────────────────────────────────────
        checkXpMilestone(user, "XP_1000",  1000,  newUnlocks);
        checkXpMilestone(user, "XP_5000",  5000,  newUnlocks);
        checkXpMilestone(user, "XP_10000", 10000, newUnlocks);

        if (!newUnlocks.isEmpty()) {
            logger.info("🏆 {} unlocked {} new achievement(s)!", user.getName(), newUnlocks.size());
        }

        return newUnlocks;
    }

    // ── Get all achievements with unlock status for a user ─────────────────

    public List<AchievementDTO.Response> getAllForUser(String email) {
        User user = getUser(email);
        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> userUnlocks = userAchievementRepository.findByUserId(user.getId());

        return allAchievements.stream().map(a -> {
            UserAchievement unlock = userUnlocks.stream()
                    .filter(ua -> ua.getAchievement().getId().equals(a.getId()))
                    .findFirst().orElse(null);
            return AchievementDTO.Response.from(a,
                    unlock != null,
                    unlock != null ? unlock.getUnlockedAt() : null);
        }).collect(Collectors.toList());
    }

    // ── Get only unlocked achievements ─────────────────────────────────────

    public List<AchievementDTO.Response> getUnlockedForUser(String email) {
        User user = getUser(email);
        return userAchievementRepository.findByUserId(user.getId())
                .stream().map(AchievementDTO.Response::fromUnlocked)
                .collect(Collectors.toList());
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private void checkQuestMilestone(User user, int completedCount, String key,
                                      int required, List<AchievementDTO.UnlockNotification> out) {
        if (completedCount >= required) {
            tryUnlock(user, key, out);
        }
    }

    private void checkRankMilestone(User user, String key, HunterRank requiredRank,
                                     List<AchievementDTO.UnlockNotification> out) {
        if (user.getHunterRank().ordinal() >= requiredRank.ordinal()) {
            tryUnlock(user, key, out);
        }
    }

    private void checkXpMilestone(User user, String key, int requiredXp,
                                   List<AchievementDTO.UnlockNotification> out) {
        if (user.getTotalXp() >= requiredXp) {
            tryUnlock(user, key, out);
        }
    }

    private void tryUnlock(User user, String achievementKey,
                           List<AchievementDTO.UnlockNotification> out) {
        // Skip if already unlocked
        if (userAchievementRepository.existsByUserIdAndAchievementKey(user.getId(), achievementKey)) {
            return;
        }

        Achievement achievement = achievementRepository.findByKey(achievementKey).orElse(null);
        if (achievement == null) {
            logger.warn("Achievement definition not found: {}", achievementKey);
            return;
        }

        UserAchievement ua = new UserAchievement();
        ua.setUser(user);
        ua.setAchievement(achievement);
        userAchievementRepository.save(ua);

        out.add(new AchievementDTO.UnlockNotification(achievement));
        logger.info("🏆 {} unlocked: {}", user.getName(), achievement.getName());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
