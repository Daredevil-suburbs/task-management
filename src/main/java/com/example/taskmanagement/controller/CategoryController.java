package com.example.taskmanagement.controller;

import com.example.taskmanagement.dto.CategoryDTO;
import com.example.taskmanagement.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // POST /api/categories — Create category
    @PostMapping
    public ResponseEntity<CategoryDTO.Response> create(
            @Valid @RequestBody CategoryDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request, userDetails.getUsername()));
    }

    // GET /api/categories — List all categories
    @GetMapping
    public ResponseEntity<List<CategoryDTO.Response>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(categoryService.getAllCategories(userDetails.getUsername()));
    }

    // PUT /api/categories/{id} — Update category
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO.Response> update(
            @PathVariable Long id,
            @RequestBody CategoryDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request, userDetails.getUsername()));
    }

    // DELETE /api/categories/{id} — Delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        categoryService.deleteCategory(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
