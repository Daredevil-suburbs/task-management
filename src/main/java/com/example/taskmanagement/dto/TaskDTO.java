package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Task;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TaskDTO {

    public static class Request {
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        private Task.Status status;
        private Task.Priority priority;
        private LocalDate dueDate;
        @Min(0) private Integer xpReward;
        private Long categoryId;
        private List<Long> tagIds;

        public String getTitle() { return title; }
        public void setTitle(String t) { this.title = t; }
        public String getDescription() { return description; }
        public void setDescription(String d) { this.description = d; }
        public Task.Status getStatus() { return status; }
        public void setStatus(Task.Status s) { this.status = s; }
        public Task.Priority getPriority() { return priority; }
        public void setPriority(Task.Priority p) { this.priority = p; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate d) { this.dueDate = d; }
        public Integer getXpReward() { return xpReward; }
        public void setXpReward(Integer x) { this.xpReward = x; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long c) { this.categoryId = c; }
        public List<Long> getTagIds() { return tagIds; }
        public void setTagIds(List<Long> t) { this.tagIds = t; }
    }

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

        public static Response fromTask(Task t) {
            Response r = new Response();
            r.id = t.getId();
            r.title = t.getTitle();
            r.description = t.getDescription();
            r.status = t.getStatus();
            r.priority = t.getPriority();
            r.dueDate = t.getDueDate();
            r.xpReward = t.getXpReward();
            r.completed = t.getStatus() == Task.Status.DONE;
            r.completedAt = t.getCompletedAt();
            r.createdAt = t.getCreatedAt();
            r.updatedAt = t.getUpdatedAt();
            if (t.getCategory() != null)
                r.category = CategoryDTO.Response.fromCategory(t.getCategory());
            if (t.getTags() != null)
                r.tags = t.getTags().stream().map(TagDTO.Response::fromTag).collect(Collectors.toList());
            return r;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public Task.Status getStatus() { return status; }
        public Task.Priority getPriority() { return priority; }
        public LocalDate getDueDate() { return dueDate; }
        public int getXpReward() { return xpReward; }
        public boolean isCompleted() { return completed; }
        public LocalDateTime getCompletedAt() { return completedAt; }
        public CategoryDTO.Response getCategory() { return category; }
        public List<TagDTO.Response> getTags() { return tags; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
    }

    public static class CompleteResponse {
        private Response task;
        private int xpEarned;
        private int totalXp;
        private int level;
        private String hunterRank;
        private boolean rankUpOccurred;
        private String rankUpMessage;

        public Response getTask() { return task; }
        public void setTask(Response t) { this.task = t; }
        public int getXpEarned() { return xpEarned; }
        public void setXpEarned(int x) { this.xpEarned = x; }
        public int getTotalXp() { return totalXp; }
        public void setTotalXp(int x) { this.totalXp = x; }
        public int getLevel() { return level; }
        public void setLevel(int l) { this.level = l; }
        public String getHunterRank() { return hunterRank; }
        public void setHunterRank(String r) { this.hunterRank = r; }
        public boolean isRankUpOccurred() { return rankUpOccurred; }
        public void setRankUpOccurred(boolean r) { this.rankUpOccurred = r; }
        public String getRankUpMessage() { return rankUpMessage; }
        public void setRankUpMessage(String m) { this.rankUpMessage = m; }
    }
}
