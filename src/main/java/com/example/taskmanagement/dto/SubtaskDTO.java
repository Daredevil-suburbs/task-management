package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Subtask;
import java.time.LocalDateTime;

public class SubtaskDTO {

    public static class Request {
        private String title;
        private String description;
        private boolean completed;
        private int orderIndex;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
        public int getOrderIndex() { return orderIndex; }
        public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
    }

    public static class Response {
        private Long id;
        private String title;
        private String description;
        private boolean completed;
        private int orderIndex;
        private LocalDateTime createdAt;
        private LocalDateTime completedAt;

        public static Response fromSubtask(Subtask s) {
            Response r = new Response();
            r.id = s.getId();
            r.title = s.getTitle();
            r.description = s.getDescription();
            r.completed = s.isCompleted();
            r.orderIndex = s.getOrderIndex();
            r.createdAt = s.getCreatedAt();
            r.completedAt = s.getCompletedAt();
            return r;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public boolean isCompleted() { return completed; }
        public int getOrderIndex() { return orderIndex; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getCompletedAt() { return completedAt; }
    }
}
