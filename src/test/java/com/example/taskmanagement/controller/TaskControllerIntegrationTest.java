package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.AuthDTO;
import com.example.taskmanagement.dto.TaskDTO;
import com.example.taskmanagement.model.Task;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for TaskController — CRUD and quest completion with JWT auth.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class TaskControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        // Register a test user and get JWT
        String email = "tasktest_" + System.currentTimeMillis() + "@test.com";
        AuthDTO.RegisterRequest regReq = new AuthDTO.RegisterRequest();
        regReq.setName("Task Tester");
        regReq.setEmail(email);
        regReq.setPassword("password123");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isOk())
                .andReturn();

        AuthDTO.AuthResponse authResponse = objectMapper.readValue(
                result.getResponse().getContentAsString(), AuthDTO.AuthResponse.class);
        jwtToken = authResponse.getToken();
    }

    @Test
    @DisplayName("POST /api/tasks — create a quest")
    void createQuest() throws Exception {
        TaskDTO.Request request = new TaskDTO.Request();
        request.setTitle("Defeat Shadow Monarch");
        request.setDescription("Complete the S-rank dungeon");
        request.setPriority(Task.Priority.HIGH);
        request.setXpReward(200);

        mockMvc.perform(post("/api/tasks")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Defeat Shadow Monarch"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.xpReward").value(200))
                .andExpect(jsonPath("$.status").value("TODO"));
    }

    @Test
    @DisplayName("GET /api/tasks — list quests requires auth")
    void listQuests_requiresAuth() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/tasks — list quests with auth returns empty initially")
    void listQuests_emptyInitially() throws Exception {
        mockMvc.perform(get("/api/tasks")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @DisplayName("Create → Get → Complete → Verify XP flow")
    void fullQuestCompletionFlow() throws Exception {
        // Create quest
        TaskDTO.Request request = new TaskDTO.Request();
        request.setTitle("Train in the dungeon");
        request.setPriority(Task.Priority.MEDIUM);
        request.setXpReward(100);

        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        // Extract task ID
        String createJson = createResult.getResponse().getContentAsString();
        Long taskId = objectMapper.readTree(createJson).get("id").asLong();

        // Complete quest
        mockMvc.perform(patch("/api/tasks/" + taskId + "/complete")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xpEarned").value(150))  // MEDIUM × 1.5
                .andExpect(jsonPath("$.task.status").value("DONE"))
                .andExpect(jsonPath("$.hunterRank").isNotEmpty());

        // Verify quest shows as completed
        mockMvc.perform(get("/api/tasks/" + taskId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    @DisplayName("Complete same quest twice returns error")
    void completeQuestTwice_error() throws Exception {
        // Create quest
        TaskDTO.Request request = new TaskDTO.Request();
        request.setTitle("One-time quest");
        request.setXpReward(50);

        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long taskId = objectMapper.readTree(
                createResult.getResponse().getContentAsString()).get("id").asLong();

        // First completion — success
        mockMvc.perform(patch("/api/tasks/" + taskId + "/complete")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());

        // Second completion — error
        mockMvc.perform(patch("/api/tasks/" + taskId + "/complete")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Quest already completed"));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id} — delete a quest")
    void deleteQuest() throws Exception {
        // Create
        TaskDTO.Request request = new TaskDTO.Request();
        request.setTitle("Disposable quest");

        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long taskId = objectMapper.readTree(
                createResult.getResponse().getContentAsString()).get("id").asLong();

        // Delete
        mockMvc.perform(delete("/api/tasks/" + taskId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // Verify gone
        mockMvc.perform(get("/api/tasks/" + taskId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/achievements — lists achievements after auth")
    void listAchievements() throws Exception {
        mockMvc.perform(get("/api/achievements")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(org.hamcrest.Matchers.greaterThan(0)));
    }

    @Test
    @DisplayName("First quest completion unlocks FIRST_QUEST achievement")
    void firstQuest_unlocksAchievement() throws Exception {
        // Create and complete a quest
        TaskDTO.Request request = new TaskDTO.Request();
        request.setTitle("My first quest");
        request.setXpReward(50);

        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long taskId = objectMapper.readTree(
                createResult.getResponse().getContentAsString()).get("id").asLong();

        // Complete — should unlock FIRST_QUEST
        mockMvc.perform(patch("/api/tasks/" + taskId + "/complete")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.newAchievements").isArray())
                .andExpect(jsonPath("$.newAchievements.length()").value(
                        org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
    }
}
