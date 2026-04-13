/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.RecurringQuestDTO;
import com.example.taskmanagement.service.RecurringQuestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring")
public class RecurringQuestController {

    @Autowired
    private RecurringQuestService recurringQuestService;

    // POST /api/recurring — Create a recurring quest template
    @PostMapping
    public ResponseEntity<RecurringQuestDTO.Response> create(
            @Valid @RequestBody RecurringQuestDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recurringQuestService.create(request, userDetails.getUsername()));
    }

    // GET /api/recurring — List all recurring quests
    @GetMapping
    public ResponseEntity<List<RecurringQuestDTO.Response>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recurringQuestService.getAll(userDetails.getUsername()));
    }

    // GET /api/recurring/{id} — Get a specific recurring quest
    @GetMapping("/{id}")
    public ResponseEntity<RecurringQuestDTO.Response> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recurringQuestService.getById(id, userDetails.getUsername()));
    }

    // PUT /api/recurring/{id} — Update a recurring quest
    @PutMapping("/{id}")
    public ResponseEntity<RecurringQuestDTO.Response> update(
            @PathVariable Long id,
            @RequestBody RecurringQuestDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                recurringQuestService.update(id, request, userDetails.getUsername()));
    }

    // DELETE /api/recurring/{id} — Deactivate (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        recurringQuestService.deactivate(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // POST /api/recurring/spawn — Manually trigger daily quest creation
    @PostMapping("/spawn")
    public ResponseEntity<RecurringQuestDTO.SpawnResult> spawnDaily(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                recurringQuestService.spawnDailyQuestsForUser(userDetails.getUsername()));
    }
}
