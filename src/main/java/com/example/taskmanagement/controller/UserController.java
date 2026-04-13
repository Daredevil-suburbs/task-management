/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.UserDTO;
import com.example.taskmanagement.dto.UserStatusDTO;
import com.example.taskmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/user/status — Hunter status panel
    @GetMapping("/status")
    public ResponseEntity<UserStatusDTO> getStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getStatus(userDetails.getUsername()));
    }

    // GET /api/user/profile — Get user profile
    @GetMapping("/profile")
    public ResponseEntity<UserDTO.ProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getUsername()));
    }

    // PUT /api/user/profile — Update profile (name, password)
    @PutMapping("/profile")
    public ResponseEntity<UserDTO.ProfileResponse> updateProfile(
            @RequestBody UserDTO.ProfileUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), request));
    }

    // POST /api/user/password/reset-request — Request password reset
    @PostMapping("/password/reset-request")
    public ResponseEntity<Map<String, String>> requestPasswordReset(
            @RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String token = userService.initiatePasswordReset(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset initiated. In production, check your email.");
        response.put("resetToken", token); // Remove in production
        return ResponseEntity.ok(response);
    }

    // POST /api/user/password/reset-confirm — Confirm password reset with token
    @PostMapping("/password/reset-confirm")
    public ResponseEntity<Map<String, String>> confirmPasswordReset(
            @RequestBody UserDTO.PasswordResetConfirmRequest request) {
        userService.confirmPasswordReset(request.getToken(), request.getNewPassword());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password has been reset successfully");
        return ResponseEntity.ok(response);
    }

    // GET /api/user/streak — Get current streak
    @GetMapping("/streak")
    public ResponseEntity<Map<String, Integer>> getStreak(
            @AuthenticationPrincipal UserDetails userDetails) {
        int streak = userService.getStreak(userDetails.getUsername());
        Map<String, Integer> response = new HashMap<>();
        response.put("currentStreak", streak);
        return ResponseEntity.ok(response);
    }
}
