package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Tag;
import jakarta.validation.constraints.NotBlank;

public class TagDTO {

    public static class Request {
        @NotBlank(message = "Tag name is required")
        private String name;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class Response {
        private Long id;
        private String name;

        public static Response fromTag(Tag t) {
            Response r = new Response();
            r.id = t.getId();
            r.name = t.getName();
            return r;
        }
        public Long getId() { return id; }
        public String getName() { return name; }
    }
}
