package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.CategoryDTO;
import com.example.taskmanagement.model.Category;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.CategoryRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public CategoryDTO.Response createCategory(CategoryDTO.Request request, String email) {
        User user = getUser(email);

        if (categoryRepository.existsByNameAndUserId(request.getName(), user.getId())) {
            throw new RuntimeException("Category '" + request.getName() + "' already exists");
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setColor(request.getColor());
        category.setUser(user);

        return CategoryDTO.Response.fromCategory(categoryRepository.save(category));
    }

    public List<CategoryDTO.Response> getAllCategories(String email) {
        User user = getUser(email);
        return categoryRepository.findByUserId(user.getId())
                .stream()
                .map(CategoryDTO.Response::fromCategory)
                .collect(Collectors.toList());
    }

    public CategoryDTO.Response updateCategory(Long id, CategoryDTO.Request request, String email) {
        User user = getUser(email);
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (request.getName() != null) category.setName(request.getName());
        if (request.getColor() != null) category.setColor(request.getColor());

        return CategoryDTO.Response.fromCategory(categoryRepository.save(category));
    }

    public void deleteCategory(Long id, String email) {
        User user = getUser(email);
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
