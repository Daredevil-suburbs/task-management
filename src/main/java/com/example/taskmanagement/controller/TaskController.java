/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.TaskDTO;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // POST /api/tasks — Create quest
    @PostMapping
    public ResponseEntity<TaskDTO.Response> createTask(
            @Valid @RequestBody TaskDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(request, userDetails.getUsername()));
    }

    // GET /api/tasks — Get all quests (optional filters)
    @GetMapping
    public ResponseEntity<List<TaskDTO.Response>> getAllTasks(
            @RequestParam(required = false) Task.Status status,
            @RequestParam(required = false) Task.Priority priority,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @AuthenticationPrincipal UserDetails userDetails) {

        // If sorting or pagination params are present, use the new method
        if (sortBy != null || page != null || size != null) {
            return ResponseEntity.ok(
                    taskService.getTasksWithSortAndPage(userDetails.getUsername(), sortBy, sortDir, page, size));
        }

        return ResponseEntity.ok(
                taskService.getAllTasks(userDetails.getUsername(), status, priority));
    }

    // GET /api/tasks/search — Search quests by title or description
    @GetMapping("/search")
    public ResponseEntity<List<TaskDTO.Response>> searchTasks(
            @RequestParam String q,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.searchTasks(userDetails.getUsername(), q));
    }

    // GET /api/tasks/{id} — Get quest by ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO.Response> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTaskById(id, userDetails.getUsername()));
    }

    // PUT /api/tasks/{id} — Update quest
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO.Response> updateTask(
            @PathVariable Long id,
            @RequestBody TaskDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                taskService.updateTask(id, request, userDetails.getUsername()));
    }

    // PATCH /api/tasks/{id}/complete — Complete quest + award XP ⭐
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskDTO.CompleteResponse> completeTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                taskService.completeTask(id, userDetails.getUsername()));
    }

    // DELETE /api/tasks/{id} — Delete quest
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
