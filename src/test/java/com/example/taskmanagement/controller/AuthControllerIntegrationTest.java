package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.AuthDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController — register, login, and validation.
 * Uses real Spring context with H2 in-memory database.
 *
 * NOTE: These tests require a test profile with H2 database.
 * For now they serve as a template. To run without MySQL,
 * add H2 to test scope and create application-test.properties.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
@SuppressWarnings("null")
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/register — success")
    void register_success() throws Exception {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setName("Test Hunter");
        request.setEmail("newuser_" + System.currentTimeMillis() + "@test.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(request.getEmail()))
                .andExpect(jsonPath("$.name").value("Test Hunter"));
    }

    @Test
    @DisplayName("POST /api/auth/register — missing name returns 400")
    void register_missingName() throws Exception {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/register — duplicate email returns 400")
    void register_duplicateEmail() throws Exception {
        String email = "dup_" + System.currentTimeMillis() + "@test.com";

        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setName("Hunter 1");
        request.setEmail(email);
        request.setPassword("password123");

        // First registration
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Duplicate
        request.setName("Hunter 2");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Email already registered"));
    }

    @Test
    @DisplayName("POST /api/auth/login — success")
    void login_success() throws Exception {
        String email = "login_" + System.currentTimeMillis() + "@test.com";

        // Register first
        AuthDTO.RegisterRequest regReq = new AuthDTO.RegisterRequest();
        regReq.setName("Login Test");
        regReq.setEmail(email);
        regReq.setPassword("password123");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isOk());

        // Login
        AuthDTO.LoginRequest loginReq = new AuthDTO.LoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("password123");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    @DisplayName("POST /api/auth/login — wrong password returns 400")
    void login_wrongPassword() throws Exception {
        String email = "wrong_" + System.currentTimeMillis() + "@test.com";

        // Register
        AuthDTO.RegisterRequest regReq = new AuthDTO.RegisterRequest();
        regReq.setName("Wrong Pass");
        regReq.setEmail(email);
        regReq.setPassword("password123");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isOk());

        // Login with wrong password
        AuthDTO.LoginRequest loginReq = new AuthDTO.LoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("wrongpassword");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/health — public endpoint accessible without auth")
    void healthEndpoint_public() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}
