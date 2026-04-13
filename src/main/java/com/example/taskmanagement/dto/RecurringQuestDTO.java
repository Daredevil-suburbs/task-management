/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.RecurringQuest;
import com.example.taskmanagement.model.Task;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class RecurringQuestDTO {

    // ── Request ────────────────────────────────────────────────────────────
    public static class Request {

        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        private Task.Priority priority;
        @Min(0) private Integer xpReward;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Task.Priority getPriority() { return priority; }
        public void setPriority(Task.Priority priority) { this.priority = priority; }
        public Integer getXpReward() { return xpReward; }
        public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }
    }

    // ── Response ───────────────────────────────────────────────────────────
    public static class Response {

        private Long id;
        private String title;
        private String description;
        private Task.Priority priority;
        private int xpReward;
        private boolean active;
        private LocalDate lastSpawnedDate;
        private LocalDateTime createdAt;

        public static Response from(RecurringQuest rq) {
            Response r = new Response();
            r.id = rq.getId();
            r.title = rq.getTitle();
            r.description = rq.getDescription();
            r.priority = rq.getPriority();
            r.xpReward = rq.getXpReward();
            r.active = rq.isActive();
            r.lastSpawnedDate = rq.getLastSpawnedDate();
            r.createdAt = rq.getCreatedAt();
            return r;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public Task.Priority getPriority() { return priority; }
        public int getXpReward() { return xpReward; }
        public boolean isActive() { return active; }
        public LocalDate getLastSpawnedDate() { return lastSpawnedDate; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    // ── Spawn result (returned when daily quests are created) ──────────────
    public static class SpawnResult {
        private int questsSpawned;
        private String message;

        public SpawnResult(int questsSpawned) {
            this.questsSpawned = questsSpawned;
            this.message = questsSpawned > 0
                    ? questsSpawned + " daily quest(s) created!"
                    : "No new quests to spawn — already up to date.";
        }

        public int getQuestsSpawned() { return questsSpawned; }
        public String getMessage() { return message; }
    }
}
