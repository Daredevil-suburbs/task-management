/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatDTO {

    /**
     * Incoming chat message from the frontend.
     */
    public static class Request {
        @NotBlank(message = "Message cannot be empty")
        private String message;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    /**
     * AI assistant response sent back to the frontend.
     */
    public static class Response {
        private String reply;
        private String hunterRank;
        private int pendingTasksToday;
        private int completedTasksToday;

        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }
        public String getHunterRank() { return hunterRank; }
        public void setHunterRank(String hunterRank) { this.hunterRank = hunterRank; }
        public int getPendingTasksToday() { return pendingTasksToday; }
        public void setPendingTasksToday(int pendingTasksToday) { this.pendingTasksToday = pendingTasksToday; }
        public int getCompletedTasksToday() { return completedTasksToday; }
        public void setCompletedTasksToday(int completedTasksToday) { this.completedTasksToday = completedTasksToday; }
    }
}
