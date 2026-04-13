/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.AchievementDTO;
import com.example.taskmanagement.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    /**
     * GET /api/achievements — All achievements with unlock status for the current user
     */
    @GetMapping
    public ResponseEntity<List<AchievementDTO.Response>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(achievementService.getAllForUser(userDetails.getUsername()));
    }

    /**
     * GET /api/achievements/unlocked — Only the user's unlocked badges
     */
    @GetMapping("/unlocked")
    public ResponseEntity<List<AchievementDTO.Response>> getUnlocked(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(achievementService.getUnlockedForUser(userDetails.getUsername()));
    }
}
