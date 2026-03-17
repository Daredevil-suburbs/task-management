package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Task;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TaskDTO {

    // ── Request DTO (create / update) ─────────────────────────────────────
    @Data
    public static class Request {

        @NotBlank(message = "Title is required")
        private String title;

        private String description;

        private Task.Status status;

        private Task.Priority priority;

        private LocalDate dueDate;

        @Min(value = 0, message = "XP reward cannot be negative")
        private Integer xpReward;      // null = keep existing or use default 50

        private Long categoryId;

        private List<Long> tagIds;
    }

    // ── Response DTO ──────────────────────────────────────────────────────
    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private Task.Status status;
        private Task.Priority priority;
        private LocalDate dueDate;
        private int xpReward;
        private boolean completed;
        private LocalDateTime completedAt;
        private CategoryDTO.Response category;
        private List<TagDTO.Response> tags;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response fromTask(Task task) {
            Response res = new Response();
            res.setId(task.getId());
            res.setTitle(task.getTitle());
            res.setDescription(task.getDescription());
            res.setStatus(task.getStatus());
            res.setPriority(task.getPriority());
            res.setDueDate(task.getDueDate());
            res.setXpReward(task.getXpReward());
            res.setCompleted(task.getStatus() == Task.Status.DONE);
            res.setCompletedAt(task.getCompletedAt());
            res.setCreatedAt(task.getCreatedAt());
            res.setUpdatedAt(task.getUpdatedAt());

            if (task.getCategory() != null) {
                res.setCategory(CategoryDTO.Response.fromCategory(task.getCategory()));
            }
            if (task.getTags() != null) {
                res.setTags(task.getTags().stream()
                        .map(TagDTO.Response::fromTag)
                        .collect(java.util.stream.Collectors.toList()));
            }
            return res;
        }
    }

    // ── Quest Complete Response ───────────────────────────────────────────
    // Returned when PATCH /api/tasks/{id}/complete is called
    @Data
    public static class CompleteResponse {
        private TaskDTO.Response task;
        private int xpEarned;
        private int totalXp;
        private int level;
        private String hunterRank;
        private boolean rankUpOccurred;
        private String rankUpMessage;
    }
}
