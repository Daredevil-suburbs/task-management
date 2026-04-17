/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class OnboardingDTO {

    /**
     * Request payload for the onboarding awaken endpoint
     */
    public static class AwakenRequest {
        @NotBlank(message = "Class name is required")
        private String className;

        @NotEmpty(message = "At least one debuff is required")
        private List<String> debuffs;

        @NotBlank(message = "Main goal is required")
        private String mainGoal;

        public String getClassName() { return className; }
        public void setClassName(String className) { this.className = className; }

        public List<String> getDebuffs() { return debuffs; }
        public void setDebuffs(List<String> debuffs) { this.debuffs = debuffs; }

        public String getMainGoal() { return mainGoal; }
        public void setMainGoal(String mainGoal) { this.mainGoal = mainGoal; }
    }

    /**
     * Response containing the generated onboarding tasks
     */
    public static class AwakenResponse {
        private String message;
        private List<TaskDTO.Response> dailyTasks;
        private List<TaskDTO.Response> milestones;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public List<TaskDTO.Response> getDailyTasks() { return dailyTasks; }
        public void setDailyTasks(List<TaskDTO.Response> dailyTasks) { this.dailyTasks = dailyTasks; }

        public List<TaskDTO.Response> getMilestones() { return milestones; }
        public void setMilestones(List<TaskDTO.Response> milestones) { this.milestones = milestones; }
    }

    /**
     * Internal DTO for parsing LLM response
     */
    public static class LlmTask {
        private String title;
        private String description;
        private String priority;
        private boolean isMilestone;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }

        public boolean isMilestone() { return isMilestone; }
        public void setMilestone(boolean milestone) { isMilestone = milestone; }
    }
}
