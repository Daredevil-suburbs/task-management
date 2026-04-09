package com.example.taskmanagement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Runs at midnight every day to spawn daily quests from all active recurring quest templates.
 */
@Component
public class DailyQuestScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DailyQuestScheduler.class);

    @Autowired
    private RecurringQuestService recurringQuestService;

    /**
     * Fires at 00:00:00 every day.
     * Spawns Task instances from all active RecurringQuest templates across all users.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void spawnDailyQuests() {
        logger.info("⏰ Daily Quest Scheduler — spawning recurring quests...");
        int count = recurringQuestService.spawnDailyQuestsForAllUsers();
        logger.info("✅ Daily Quest Scheduler — spawned {} quest(s)", count);
    }
}
