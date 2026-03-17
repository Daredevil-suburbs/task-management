package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Category;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class CategoryDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Category name is required")
        private String name;

        private String color;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String color;

        public static Response fromCategory(Category category) {
            Response res = new Response();
            res.setId(category.getId());
            res.setName(category.getName());
            res.setColor(category.getColor());
            return res;
        }
    }
}
