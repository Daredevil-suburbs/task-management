/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.ChatDTO;
import com.example.taskmanagement.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * POST /api/chat/assistant
     *
     * Powers the frontend chatbot. Accepts the user's message,
     * fetches their Hunter context, and returns the AI's response.
     */
    @PostMapping("/assistant")
    public ResponseEntity<ChatDTO.Response> chatWithAssistant(
            @Valid @RequestBody ChatDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                chatService.chat(userDetails.getUsername(), request));
    }
}
