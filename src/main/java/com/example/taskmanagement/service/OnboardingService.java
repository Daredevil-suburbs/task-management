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

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(OnboardingService.class);

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
     * Makes an HTTP POST request to the local Ollama instance.
     */
    public String callOllamaModel(String prompt) {
        logger.info("Calling Ollama with prompt: {}", prompt);
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            
            java.util.Map<String, Object> bodyMap = new java.util.HashMap<>();
            bodyMap.put("model", "qwen3.5:latest");
            bodyMap.put("prompt", prompt);
            bodyMap.put("stream", false);
            
            String jsonBody = objectMapper.writeValueAsString(bodyMap);

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("http://localhost:11434/api/generate"))
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            java.net.http.HttpResponse<String> response = client.send(request, 
                java.net.http.HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                logger.error("Ollama error: status {} body {}", response.statusCode(), response.body());
                throw new RuntimeException("Ollama API error: " + response.statusCode());
            }

            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(response.body());
            String out = root.get("response").asText();
            logger.info("Ollama response: {}", out);
            return out;

        } catch (Exception e) {
            logger.error("Critical error calling Ollama model: {}", e.getMessage(), e);
            throw new RuntimeException("AI Model Error: " + e.getMessage());
        }
    }

    /**
     * Parses the LLM's JSON response into a list of task objects.
     */
    public List<OnboardingDTO.LlmTask> parseLlmResponse(String jsonResponse) {
        try {
            // Robust cleaning of the response — sometimes models wrap in backticks or preamble
            String cleanJson = jsonResponse.trim();
            if (cleanJson.contains("```json")) {
                cleanJson = cleanJson.substring(cleanJson.indexOf("```json") + 7);
                if (cleanJson.contains("```")) {
                    cleanJson = cleanJson.substring(0, cleanJson.indexOf("```"));
                }
            } else if (cleanJson.contains("```")) {
                 cleanJson = cleanJson.substring(cleanJson.indexOf("```") + 3);
                 if (cleanJson.contains("```")) {
                    cleanJson = cleanJson.substring(0, cleanJson.indexOf("```"));
                }
            }
            
            return objectMapper.readValue(cleanJson.trim(), new TypeReference<List<OnboardingDTO.LlmTask>>() {});
        } catch (Exception e) {
            logger.error("Failed to parse AI response: {}", jsonResponse);
            throw new RuntimeException("Failed to decode AI response: " + e.getMessage(), e);
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
            
            // Robust priority parsing
            try {
                task.setPriority(Task.Priority.valueOf(llmTask.getPriority().toUpperCase()));
            } catch (Exception e) {
                logger.warn("Received invalid priority '{}' from AI, defaulting to MEDIUM", llmTask.getPriority());
                task.setPriority(Task.Priority.MEDIUM);
            }
            
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
