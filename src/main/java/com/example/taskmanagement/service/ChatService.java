/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.ChatDTO;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Chat assistant service — powers the frontend chatbot.
 *
 * Flow:
 *   1. Receive the user's chat message.
 *   2. Fetch their Hunter Rank, pending tasks today, and completed tasks today.
 *   3. Construct a Solo Leveling "System Guide" prompt with the context.
 *   4. Send to the LLM via OnboardingService.callOllamaModel().
 *   5. Return the AI response to the frontend.
 */
@Service
@SuppressWarnings("null")
public class ChatService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private OnboardingService onboardingService;

    /**
     * Process a chat message from the authenticated user.
     *
     * @param email   the authenticated user's email
     * @param request the chat request containing the user's message
     * @return ChatDTO.Response with the AI reply and user context
     */
    public ChatDTO.Response chat(String email, ChatDTO.Request request) {
        // ── Step 1: Fetch user context ──────────────────────────────────────
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String hunterRank = user.getHunterRank().getDisplayName();

        // Today's task stats
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay   = startOfDay.plusDays(1);

        int completedToday = taskRepository.countCompletedTodayByUserId(
                user.getId(), startOfDay, endOfDay);
        int pendingToday = taskRepository.countPendingTodayByUserId(
                user.getId(), LocalDate.now());

        // ── Step 2: Construct the system prompt ─────────────────────────────
        String systemPrompt = buildSystemPrompt(
                hunterRank, pendingToday, completedToday, request.getMessage());

        // ── Step 3: Call the LLM ────────────────────────────────────────────
        String aiReply = onboardingService.callOllamaModel(systemPrompt);

        // ── Step 4: Build and return response ───────────────────────────────
        ChatDTO.Response response = new ChatDTO.Response();
        response.setReply(aiReply.trim());
        response.setHunterRank(hunterRank);
        response.setPendingTasksToday(pendingToday);
        response.setCompletedTasksToday(completedToday);

        return response;
    }

    /**
     * Construct the unified system prompt in the Solo Leveling tone.
     */
    private String buildSystemPrompt(String rank, int pendingTasks,
                                     int completedTasks, String userMessage) {
        return String.format(
            "You are the System Guide from Solo Leveling. " +
            "The user is Rank [%s]. " +
            "They have [%d] tasks left today and have completed [%d]. " +
            "Answer their prompt in a cold, analytical, but supportive tone. " +
            "Keep responses concise and motivating. " +
            "If they ask about their progress, reference their rank and task stats. " +
            "User Prompt: %s",
            rank, pendingTasks, completedTasks, userMessage
        );
    }
}
