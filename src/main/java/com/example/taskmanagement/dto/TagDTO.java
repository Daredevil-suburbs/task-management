package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.Tag;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class TagDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Tag name is required")
        private String name;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;

        public static Response fromTag(Tag tag) {
            Response res = new Response();
            res.setId(tag.getId());
            res.setName(tag.getName());
            return res;
        }
    }
}
