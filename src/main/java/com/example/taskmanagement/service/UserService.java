package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.UserStatusDTO;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private LevelService levelService;

    public UserStatusDTO getStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int tasksCompleted = taskRepository.countCompletedByUserId(user.getId());
        int xpToNextLevel  = levelService.xpToNextLevel(user);
        int xpToNextRank   = levelService.xpToNextRank(user);

        return UserStatusDTO.from(user, xpToNextLevel, xpToNextRank, tasksCompleted);
    }
}
