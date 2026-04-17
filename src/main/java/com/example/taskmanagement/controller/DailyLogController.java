/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.AiCoachingDTO;
import com.example.taskmanagement.dto.DailyLogDTO;
import com.example.taskmanagement.service.AiCoachingService;
import com.example.taskmanagement.service.DailyLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class DailyLogController {

    @Autowired
    private DailyLogService dailyLogService;

    @Autowired
    private AiCoachingService aiCoachingService;

    /**
     * POST /api/health/log — Save or update today's daily log (mood, energy, focus, sleep, meds).
     */
    @PostMapping("/log")
    public ResponseEntity<DailyLogDTO.LogResponse> logDaily(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DailyLogDTO.LogRequest request) {
        return ResponseEntity.ok(dailyLogService.saveOrUpdateToday(userDetails.getUsername(), request));
    }

    /**
     * GET /api/health/log/recent — Get the last 7 daily logs for the authenticated user.
     */
    @GetMapping("/log/recent")
    public ResponseEntity<List<DailyLogDTO.LogResponse>> getRecentLogs(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(dailyLogService.getLast7Logs(userDetails.getUsername()));
    }

    /**
     * GET /api/health/prediction — AI System Guide analyzes the Hunter's
     * last 7 days of logs + today's quest completions and returns a tactical recommendation.
     */
    @GetMapping("/prediction")
    public ResponseEntity<AiCoachingDTO.PredictionResponse> getPrediction(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiCoachingService.predictAndRecommend(userDetails.getUsername()));
    }
}
