package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Category;
import jakarta.validation.constraints.NotBlank;

public class CategoryDTO {

    public static class Request {
        @NotBlank(message = "Category name is required")
        private String name;
        private String color;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public static class Response {
        private Long id;
        private String name;
        private String color;

        public static Response fromCategory(Category c) {
            Response r = new Response();
            r.id = c.getId();
            r.name = c.getName();
            r.color = c.getColor();
            return r;
        }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getColor() { return color; }
    }
}
