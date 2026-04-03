package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TagDTO;
import com.example.taskmanagement.model.Tag;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.TagRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    public TagDTO.Response createTag(TagDTO.Request request, String email) {
        User user = getUser(email);

        if (tagRepository.existsByNameAndUserId(request.getName(), user.getId())) {
            throw new RuntimeException("Tag '" + request.getName() + "' already exists");
        }

        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setUser(user);

        return TagDTO.Response.fromTag(tagRepository.save(tag));
    }

    public List<TagDTO.Response> getAllTags(String email) {
        User user = getUser(email);
        return tagRepository.findByUserId(user.getId())
                .stream()
                .map(TagDTO.Response::fromTag)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public TagDTO.Response updateTag(Long id, TagDTO.Request request, String email) {
        User user = getUser(email);
        Tag tag = tagRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        tag.setName(request.getName());
        return TagDTO.Response.fromTag(tagRepository.save(tag));
    }

    @SuppressWarnings("null")
    public void deleteTag(Long id, String email) {
        User user = getUser(email);
        Tag tag = tagRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        tagRepository.delete(tag);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
