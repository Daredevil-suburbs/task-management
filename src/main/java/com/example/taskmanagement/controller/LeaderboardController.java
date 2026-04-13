/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.LeaderboardDTO;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<LeaderboardDTO.Entry>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(limit));
    }

    @GetMapping("/my-rank")
    public ResponseEntity<Map<String, Object>> getMyRank(
            @AuthenticationPrincipal UserDetails userDetails) {

        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElse(null);

        if (user != null) {
            int rank = leaderboardService.getUserRank(user.getId());
            response.put("rank", rank);
            response.put("email", userDetails.getUsername());
            response.put("totalXp", user.getTotalXp());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }
}
