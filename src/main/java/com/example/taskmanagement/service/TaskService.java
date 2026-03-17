package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TaskDTO;
import com.example.taskmanagement.model.*;
import com.example.taskmanagement.repository.CategoryRepository;
import com.example.taskmanagement.repository.TagRepository;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private TagRepository tagRepository;
    @Autowired private LevelService levelService;

    // ── Create Quest ───────────────────────────────────────────────────────
    public TaskDTO.Response createTask(TaskDTO.Request request, String email) {
        User user = getUser(email);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setUser(user);

        if (request.getStatus()   != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getXpReward() != null) task.setXpReward(request.getXpReward());
        if (request.getCategoryId() != null) {
            task.setCategory(resolveCategory(request.getCategoryId(), user.getId()));
        }
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            task.setTags(resolveTags(request.getTagIds(), user.getId()));
        }

        return TaskDTO.Response.fromTask(taskRepository.save(task));
    }

    // ── Get All Quests ─────────────────────────────────────────────────────
    public List<TaskDTO.Response> getAllTasks(String email,
                                              Task.Status status,
                                              Task.Priority priority) {
        User user = getUser(email);
        List<Task> tasks;

        if (status != null) {
            tasks = taskRepository.findByUserIdAndStatus(user.getId(), status);
        } else if (priority != null) {
            tasks = taskRepository.findByUserIdAndPriority(user.getId(), priority);
        } else {
            tasks = taskRepository.findByUserId(user.getId());
        }

        return tasks.stream().map(TaskDTO.Response::fromTask).collect(Collectors.toList());
    }

    // ── Get Quest by ID ────────────────────────────────────────────────────
    public TaskDTO.Response getTaskById(Long id, String email) {
        User user = getUser(email);
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Quest not found"));
        return TaskDTO.Response.fromTask(task);
    }

    // ── Update Quest ───────────────────────────────────────────────────────
    public TaskDTO.Response updateTask(Long id, TaskDTO.Request request, String email) {
        User user = getUser(email);
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Quest not found"));

        if (request.getTitle()       != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus()      != null) task.setStatus(request.getStatus());
        if (request.getPriority()    != null) task.setPriority(request.getPriority());
        if (request.getDueDate()     != null) task.setDueDate(request.getDueDate());
        if (request.getXpReward()    != null) task.setXpReward(request.getXpReward());
        if (request.getCategoryId()  != null) {
            task.setCategory(resolveCategory(request.getCategoryId(), user.getId()));
        }
        if (request.getTagIds() != null) {
            task.setTags(resolveTags(request.getTagIds(), user.getId()));
        }

        return TaskDTO.Response.fromTask(taskRepository.save(task));
    }

    // ── COMPLETE QUEST — awards XP and recalculates rank ──────────────────
    @Transactional
    public TaskDTO.CompleteResponse completeTask(Long id, String email) {
        User user = getUser(email);
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Quest not found"));

        if (task.getStatus() == Task.Status.DONE) {
            throw new RuntimeException("Quest already completed");
        }

        // Snapshot rank before awarding XP
        HunterRank rankBefore = user.getHunterRank();

        // Calculate XP earned (priority multiplier applied inside LevelService)
        int baseXp = task.getXpReward();
        int xpEarned = calculateEarned(baseXp, task.getPriority());

        // Mark task done
        task.setStatus(Task.Status.DONE);
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);

        // Award XP → mutates user fields in place
        levelService.awardXp(user, baseXp, task.getPriority());
        userRepository.save(user);

        // Build response
        HunterRank rankAfter = user.getHunterRank();
        boolean rankUp = rankAfter != rankBefore;

        TaskDTO.CompleteResponse response = new TaskDTO.CompleteResponse();
        response.setTask(TaskDTO.Response.fromTask(task));
        response.setXpEarned(xpEarned);
        response.setTotalXp(user.getTotalXp());
        response.setLevel(user.getLevel());
        response.setHunterRank(rankAfter.getDisplayName());
        response.setRankUpOccurred(rankUp);
        if (rankUp) {
            response.setRankUpMessage(
                "RANK UP! You are now " + rankAfter.getDisplayName() + "!"
            );
        }

        return response;
    }

    // ── Delete Quest ───────────────────────────────────────────────────────
    public void deleteTask(Long id, String email) {
        User user = getUser(email);
        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Quest not found"));
        taskRepository.delete(task);
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Category resolveCategory(Long categoryId, Long userId) {
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    private List<Tag> resolveTags(List<Long> tagIds, Long userId) {
        List<Tag> tags = new ArrayList<>();
        for (Long tagId : tagIds) {
            tags.add(tagRepository.findByIdAndUserId(tagId, userId)
                    .orElseThrow(() -> new RuntimeException("Tag not found: id=" + tagId)));
        }
        return tags;
    }

    private int calculateEarned(int base, Task.Priority priority) {
        return switch (priority) {
            case LOW    -> base;
            case MEDIUM -> (int) (base * 1.5);
            case HIGH   -> base * 2;
        };
    }
}
