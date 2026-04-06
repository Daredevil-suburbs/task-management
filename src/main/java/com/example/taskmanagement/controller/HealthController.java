package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.HealthDTO;
import com.example.taskmanagement.service.HealthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private HealthService healthService;

    /**
     * POST /api/health/sync — Receive today's health data from the phone
     */
    @PostMapping("/sync")
    public ResponseEntity<HealthDTO.HealthResponse> syncHealth(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HealthDTO.SyncRequest request) {
        return ResponseEntity.ok(healthService.syncToday(userDetails.getUsername(), request));
    }

    /**
     * GET /api/health/today — Get today's health record
     */
    @GetMapping("/today")
    public ResponseEntity<HealthDTO.HealthResponse> getToday(
            @AuthenticationPrincipal UserDetails userDetails) {
        HealthDTO.HealthResponse today = healthService.getToday(userDetails.getUsername());
        if (today == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(today);
    }

    /**
     * GET /api/health/history?days=7 — Get health history for the last N days
     */
    @GetMapping("/history")
    public ResponseEntity<List<HealthDTO.HealthResponse>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(healthService.getHistory(userDetails.getUsername(), days));
    }
}
