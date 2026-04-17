/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.OnboardingDTO;
import com.example.taskmanagement.dto.TaskDTO;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class OnboardingService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Constructs a prompt string for the LLM based on user's onboarding data.
     * The prompt asks the LLM to generate exactly 3 beginner-friendly daily tasks
     * and 2 milestones based on their debuffs and goals.
     */
    public String constructPrompt(String className, List<String> debuffs, String mainGoal) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a gamified task management assistant. ");
        prompt.append("Generate a personalized onboarding plan for a new user.\n\n");
        prompt.append("USER PROFILE:\n");
        prompt.append("- Class: ").append(className).append("\n");
        prompt.append("- Debuffs (weaknesses to overcome): ").append(String.join(", ", debuffs)).append("\n");
        prompt.append("- Main Goal: ").append(mainGoal).append("\n\n");
        prompt.append("Generate exactly 3 beginner-friendly DAILY TASKS and 2 MILESTONES.\n");
        prompt.append("- Daily tasks should be small, achievable actions that can be completed within a day.\n");
        prompt.append("- Milestones should be larger goals that take multiple days or weeks.\n\n");
        prompt.append("Respond with a STRICT JSON array of exactly 5 objects in this format:\n");
        prompt.append("[\n");
        prompt.append("  {\n");
        prompt.append("    \"title\": \"Task title here\",\n");
        prompt.append("    \"description\": \"Detailed description of what to do\",\n");
        prompt.append("    \"priority\": \"LOW\",\n");
        prompt.append("    \"isMilestone\": false\n");
        prompt.append("  },\n");
        prompt.append("  ... (4 more objects)\n");
        prompt.append("]\n\n");
        prompt.append("Rules:\n");
        prompt.append("- Exactly 3 tasks must have \"isMilestone\": false (daily tasks)\n");
        prompt.append("- Exactly 2 tasks must have \"isMilestone\": true (milestones)\n");
        prompt.append("- Priority must be one of: LOW, MEDIUM, HIGH\n");
        prompt.append("- Tasks should address the user's debuffs and help them reach their main goal\n");
        prompt.append("- Keep tasks beginner-friendly and achievable\n");
        prompt.append("- Do NOT include any text outside the JSON array\n");
        prompt.append("- Do NOT include markdown code blocks or backticks\n");

        return prompt.toString();
    }

    /**
     * Simulates an HTTP call to a local LLM API (Ollama/Claude).
     * In production, this would make an actual HTTP request.
     */
    public String callOllamaModel(String prompt) {
        // TODO: Replace with actual HTTP call to your local LLM
        // Example for Ollama:
        // HttpClient client = HttpClient.newHttpClient();
        // HttpRequest request = HttpRequest.newBuilder()
        //     .uri(URI.create("http://localhost:11434/api/generate"))
        //     .header("Content-Type", "application/json")
        //     .POST(HttpRequest.BodyPublishers.ofString(
        //         "{\"model\": \"llama3.2\", \"prompt\": \"" + prompt + "\", \"stream\": false}"
        //     ))
        //     .build();
        // HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        // return response.body();

        // SIMULATED RESPONSE for development/testing
        // This mimics what a real LLM would return
        return """
            [
              {
                "title": "Set Up Your Task Management System",
                "description": "Create your account, explore the interface, and set up your first category for organizing tasks.",
                "priority": "HIGH",
                "isMilestone": false
              },
              {
                "title": "Complete One Small Task Today",
                "description": "Pick one simple task you can finish in under 30 minutes and mark it as done. Experience the satisfaction of completion!",
                "priority": "HIGH",
                "isMilestone": false
              },
              {
                "title": "Review and Plan Tomorrow's Tasks",
                "description": "Spend 10 minutes each evening reviewing what you accomplished and writing down 2-3 tasks for tomorrow.",
                "priority": "MEDIUM",
                "isMilestone": false
              },
              {
                "title": "Complete Your First Week Streak",
                "description": "Complete at least one task every day for 7 consecutive days. Build the habit of daily progress!",
                "priority": "HIGH",
                "isMilestone": true
              },
              {
                "title": "Reach Level 5 Hunter Rank",
                "description": "Accumulate enough XP by completing tasks to advance from E-rank to D-rank hunter. This shows you've built consistent habits.",
                "priority": "MEDIUM",
                "isMilestone": true
              }
            ]
            """;
    }

    /**
     * Parses the LLM's JSON response into a list of task objects.
     */
    public List<OnboardingDTO.LlmTask> parseLlmResponse(String jsonResponse) {
        try {
            return objectMapper.readValue(jsonResponse.trim(), new TypeReference<List<OnboardingDTO.LlmTask>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse LLM response: " + e.getMessage(), e);
        }
    }

    /**
     * Main onboarding flow: generates tasks from LLM and saves them to the database.
     */
    @Transactional
    public OnboardingDTO.AwakenResponse awakenUser(String email, OnboardingDTO.AwakenRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Step 1: Construct the prompt
        String prompt = constructPrompt(request.getClassName(), request.getDebuffs(), request.getMainGoal());

        // Step 2: Call the LLM (simulated)
        String llmResponse = callOllamaModel(prompt);

        // Step 3: Parse the response
        List<OnboardingDTO.LlmTask> llmTasks = parseLlmResponse(llmResponse);

        // Step 4: Map to Task entities and save
        List<TaskDTO.Response> dailyTasks = new ArrayList<>();
        List<TaskDTO.Response> milestones = new ArrayList<>();

        for (OnboardingDTO.LlmTask llmTask : llmTasks) {
            Task task = new Task();
            task.setTitle(llmTask.getTitle());
            task.setDescription(llmTask.getDescription());
            task.setPriority(Task.Priority.valueOf(llmTask.getPriority()));
            task.setStatus(Task.Status.TODO);
            task.setXpReward(determineXpReward(llmTask.getPriority()));
            task.setDueDate(LocalDate.now().plusDays(7)); // Default due date
            task.setUser(user);

            Task savedTask = taskRepository.save(task);

            TaskDTO.Response taskDto = TaskDTO.Response.fromTask(savedTask);

            // Separate daily tasks from milestones based on isMilestone flag
            if (llmTask.isMilestone()) {
                milestones.add(taskDto);
            } else {
                dailyTasks.add(taskDto);
            }
        }

        // Build response
        OnboardingDTO.AwakenResponse response = new OnboardingDTO.AwakenResponse();
        response.setMessage("Welcome, " + user.getName() + "! Your onboarding quest line has been generated.");
        response.setDailyTasks(dailyTasks);
        response.setMilestones(milestones);

        return response;
    }

    /**
     * Determines XP reward based on task priority.
     */
    private int determineXpReward(String priority) {
        return switch (priority) {
            case "LOW" -> 50;
            case "MEDIUM" -> 100;
            case "HIGH" -> 150;
            default -> 75;
        };
    }
}
