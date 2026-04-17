/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.AiCoachingDTO;
import com.example.taskmanagement.model.DailyLog;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.DailyLogRepository;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AI Coaching Service — the "System Guide" brain.
 *
 * Flow:
 *   1. Fetch the last 7 DailyLog entries for the user.
 *   2. Fetch how many quests they completed today.
 *   3. Construct a highly structured prompt in the Solo Leveling tone.
 *   4. Send to the LLM via callLlmApi().
 *   5. Return { status: "Analyzed", recommendation: "..." }.
 */
@Service
@SuppressWarnings("null")
public class AiCoachingService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AiCoachingService.class);

    @Autowired private DailyLogRepository dailyLogRepo;
    @Autowired private TaskRepository taskRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    /**
     * Analyze the Hunter's recent data and produce a tactical recommendation.
     */
    public AiCoachingDTO.PredictionResponse predictAndRecommend(String email) {
        // ── Step 1: Resolve user ────────────────────────────────────────────
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ── Step 2: Fetch the last 7 daily logs ─────────────────────────────
        List<DailyLog> recentLogs = dailyLogRepo.findLast7ByUserId(user.getId());

        // ── Step 3: Fetch quests completed today ────────────────────────────
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay   = startOfDay.plusDays(1);
        int questsCompletedToday = taskRepo.countCompletedTodayByUserId(
                user.getId(), startOfDay, endOfDay);

        // ── Step 4: Build the prompt ────────────────────────────────────────
        String prompt = buildAnalysisPrompt(recentLogs, questsCompletedToday);

        // ── Step 5: Call the LLM ────────────────────────────────────────────
        String aiReply = callLlmApi(prompt);

        // ── Step 6: Return structured response ──────────────────────────────
        return AiCoachingDTO.PredictionResponse.analyzed(aiReply.trim());
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Prompt Construction
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Builds the highly structured System Guide prompt with the Hunter's data.
     */
    private String buildAnalysisPrompt(List<DailyLog> logs, int questsCompletedToday) {
        String logsJson = logs.stream()
                .map(this::logToJson)
                .collect(Collectors.joining(",\n    ", "[\n    ", "\n  ]"));

        return String.format(
            "You are the 'System Guide' from Solo Leveling. " +
            "Act as an analytical, slightly cold, but helpful AI. " +
            "Here is the Hunter's data for the last 7 days:\n\n" +
            "Daily Logs: %s\n\n" +
            "Quests completed today: %d\n\n" +
            "Based on their sleep, mood, and meds, predict their focus level today " +
            "and give them a 2-sentence tactical recommendation on how to tackle their quests. " +
            "Respond ONLY with the recommendation text — no JSON, no labels, no preamble.",
            logsJson, questsCompletedToday
        );
    }

    /**
     * Converts a single DailyLog entity into a compact JSON string for the prompt.
     */
    private String logToJson(DailyLog log) {
        return String.format(
            "{ \"date\": \"%s\", \"mood\": %d, \"energy\": %d, \"focus\": %d, " +
            "\"sleepHours\": %.1f, \"medsTaken\": %b }",
            log.getLogDate(),
            log.getMood(),
            log.getEnergyLevel(),
            log.getFocusLevel(),
            log.getSleepHours(),
            log.isMedsTaken()
        );
    }

    /**
     * Makes an HTTP POST request to the local Ollama instance.
     */
    public String callLlmApi(String prompt) {
        logger.info("Calling System Guide AI with prompt...");
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
                throw new RuntimeException("Ollama API error: " + response.statusCode());
            }

            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(response.body());
            return root.get("response").asText();

        } catch (Exception e) {
            logger.error("Error calling System Guide AI: {}", e.getMessage());
            return "Unable to access the System Guide at this time. Focus on your immediate quests.";
        }
    }
}
