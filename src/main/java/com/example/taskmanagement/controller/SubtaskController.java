/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.SubtaskDTO;
import com.example.taskmanagement.service.SubtaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/subtasks")
public class SubtaskController {

    @Autowired
    private SubtaskService subtaskService;

    @GetMapping
    public ResponseEntity<List<SubtaskDTO.Response>> getSubtasks(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(subtaskService.getSubtasksByTaskId(taskId, userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<SubtaskDTO.Response> createSubtask(
            @PathVariable Long taskId,
            @RequestBody SubtaskDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subtaskService.createSubtask(taskId, request, userDetails.getUsername()));
    }

    @PutMapping("/{subtaskId}")
    public ResponseEntity<SubtaskDTO.Response> updateSubtask(
            @PathVariable Long taskId,
            @PathVariable Long subtaskId,
            @RequestBody SubtaskDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(subtaskService.updateSubtask(taskId, subtaskId, request, userDetails.getUsername()));
    }

    @PatchMapping("/{subtaskId}/toggle")
    public ResponseEntity<SubtaskDTO.Response> toggleSubtask(
            @PathVariable Long taskId,
            @PathVariable Long subtaskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(subtaskService.toggleSubtask(taskId, subtaskId, userDetails.getUsername()));
    }

    @DeleteMapping("/{subtaskId}")
    public ResponseEntity<Void> deleteSubtask(
            @PathVariable Long taskId,
            @PathVariable Long subtaskId,
            @AuthenticationPrincipal UserDetails userDetails) {
        subtaskService.deleteSubtask(taskId, subtaskId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
