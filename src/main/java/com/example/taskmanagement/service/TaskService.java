/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.AchievementDTO;
import com.example.taskmanagement.dto.TaskDTO;
import com.example.taskmanagement.model.*;
import com.example.taskmanagement.repository.CategoryRepository;
import com.example.taskmanagement.repository.TagRepository;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private TagRepository tagRepository;
    @Autowired private LevelService levelService;
    @Autowired private AchievementService achievementService;
    @Autowired private UserService userService;

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

    // ── Search Quests ──────────────────────────────────────────────────────
    public List<TaskDTO.Response> searchTasks(String email, String query) {
        User user = getUser(email);
        if (query == null || query.trim().isEmpty()) {
            return getAllTasks(email, null, null);
        }
        List<Task> tasks = taskRepository.searchByUserId(user.getId(), query.trim());
        return tasks.stream().map(TaskDTO.Response::fromTask).collect(Collectors.toList());
    }

    // ── Get Quests with Sorting and Pagination ─────────────────────────────
    public List<TaskDTO.Response> getTasksWithSortAndPage(String email,
                                                           String sortBy,
                                                           String sortDir,
                                                           Integer page,
                                                           Integer size) {
        User user = getUser(email);
        List<Task> tasks = new ArrayList<>(taskRepository.findByUserId(user.getId()));

        // Apply sorting
        if (sortBy != null && !sortBy.isEmpty()) {
            tasks.sort((a, b) -> {
                int cmp;
                switch (sortBy.toLowerCase()) {
                    case "duedate":
                        if (a.getDueDate() == null && b.getDueDate() == null) return 0;
                        if (a.getDueDate() == null) return 1;
                        if (b.getDueDate() == null) return -1;
                        cmp = a.getDueDate().compareTo(b.getDueDate());
                        break;
                    case "priority":
                        cmp = a.getPriority().compareTo(b.getPriority());
                        break;
                    case "xpreward":
                        cmp = Integer.compare(a.getXpReward(), b.getXpReward());
                        break;
                    case "createdat":
                    default:
                        cmp = a.getCreatedAt().compareTo(b.getCreatedAt());
                }
                return "desc".equalsIgnoreCase(sortDir) ? cmp * -1 : cmp;
            });
        }

        // Apply pagination
        if (page != null && size != null && page > 0 && size > 0) {
            int start = (page - 1) * size;
            if (start >= tasks.size()) {
                return Collections.emptyList();
            }
            int end = Math.min(start + size, tasks.size());
            tasks = tasks.subList(start, end);
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

        // Calculate XP earned using dynamic formula:
        // Base XP × Priority Multiplier × Deadline Multiplier
        int baseXp = task.getXpReward();
        LocalDate dueDate = task.getDueDate();
        LocalDate completedAt = LocalDate.now();

        int xpEarned = levelService.calculateDynamicXp(baseXp, task.getPriority(), dueDate, completedAt);

        // Mark task done
        task.setStatus(Task.Status.DONE);
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);

        // Award XP with dynamic calculation → mutates user fields in place
        levelService.awardXp(user, baseXp, task.getPriority(), dueDate, completedAt);

        // Update streak
        userService.updateStreakOnQuestCompletion(user);

        // Check for newly unlocked achievements
        List<AchievementDTO.UnlockNotification> newAchievements =
                achievementService.checkAndAward(user);

        // Check for rank up and trigger event if applicable
        boolean rankUpOccurred = userService.checkRankUp(user, rankBefore);
        HunterRank rankAfter = user.getHunterRank();

        // Build response
        TaskDTO.CompleteResponse response = new TaskDTO.CompleteResponse();
        response.setTask(TaskDTO.Response.fromTask(task));
        response.setXpEarned(xpEarned);
        response.setTotalXp(user.getTotalXp());
        response.setLevel(user.getLevel());
        response.setHunterRank(rankAfter.getDisplayName());
        response.setRankUpOccurred(rankUpOccurred);
        if (rankUpOccurred) {
            response.setRankUpMessage(
                "RANK UP! You are now " + rankAfter.getDisplayName() + "!"
            );
        }
        response.setNewAchievements(newAchievements);

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
}
