package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.TagDTO;
import com.example.taskmanagement.service.TagService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    // POST /api/tags — Create tag
    @PostMapping
    public ResponseEntity<TagDTO.Response> create(
            @Valid @RequestBody TagDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tagService.createTag(request, userDetails.getUsername()));
    }

    // GET /api/tags — List all tags
    @GetMapping
    public ResponseEntity<List<TagDTO.Response>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tagService.getAllTags(userDetails.getUsername()));
    }

    // PUT /api/tags/{id} — Rename tag
    @PutMapping("/{id}")
    public ResponseEntity<TagDTO.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody TagDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tagService.updateTag(id, request, userDetails.getUsername()));
    }

    // DELETE /api/tags/{id} — Delete tag
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        tagService.deleteTag(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
