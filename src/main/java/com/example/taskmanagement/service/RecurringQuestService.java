package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.RecurringQuestDTO;
import com.example.taskmanagement.model.RecurringQuest;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.RecurringQuestRepository;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecurringQuestService {

    @Autowired private RecurringQuestRepository recurringQuestRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;

    // ── CRUD ───────────────────────────────────────────────────────────────

    public RecurringQuestDTO.Response create(RecurringQuestDTO.Request request, String email) {
        User user = getUser(email);

        RecurringQuest rq = new RecurringQuest();
        rq.setTitle(request.getTitle());
        rq.setDescription(request.getDescription());
        rq.setUser(user);

        if (request.getPriority() != null) rq.setPriority(request.getPriority());
        if (request.getXpReward() != null) rq.setXpReward(request.getXpReward());

        return RecurringQuestDTO.Response.from(recurringQuestRepository.save(rq));
    }

    public List<RecurringQuestDTO.Response> getAll(String email) {
        User user = getUser(email);
        return recurringQuestRepository.findByUserId(user.getId())
                .stream().map(RecurringQuestDTO.Response::from).collect(Collectors.toList());
    }

    public RecurringQuestDTO.Response getById(Long id, String email) {
        User user = getUser(email);
        RecurringQuest rq = recurringQuestRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Recurring quest not found"));
        return RecurringQuestDTO.Response.from(rq);
    }

    public RecurringQuestDTO.Response update(Long id, RecurringQuestDTO.Request request, String email) {
        User user = getUser(email);
        RecurringQuest rq = recurringQuestRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Recurring quest not found"));

        if (request.getTitle()       != null) rq.setTitle(request.getTitle());
        if (request.getDescription() != null) rq.setDescription(request.getDescription());
        if (request.getPriority()    != null) rq.setPriority(request.getPriority());
        if (request.getXpReward()    != null) rq.setXpReward(request.getXpReward());

        return RecurringQuestDTO.Response.from(recurringQuestRepository.save(rq));
    }

    public void deactivate(Long id, String email) {
        User user = getUser(email);
        RecurringQuest rq = recurringQuestRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Recurring quest not found"));
        rq.setActive(false);
        recurringQuestRepository.save(rq);
    }

    // ── Spawn daily quests ─────────────────────────────────────────────────

    /**
     * Spawn today's tasks from all active recurring quests for a single user.
     * Idempotent — won't create duplicates if already spawned today.
     */
    @Transactional
    public RecurringQuestDTO.SpawnResult spawnDailyQuestsForUser(String email) {
        User user = getUser(email);
        return spawnForUser(user);
    }

    /**
     * Spawn daily quests for ALL users — called by the scheduler at midnight.
     */
    @Transactional
    public int spawnDailyQuestsForAllUsers() {
        LocalDate today = LocalDate.now();
        List<RecurringQuest> activeQuests = recurringQuestRepository.findByActiveTrue();

        int totalSpawned = 0;
        for (RecurringQuest rq : activeQuests) {
            if (rq.getLastSpawnedDate() == null || rq.getLastSpawnedDate().isBefore(today)) {
                spawnTask(rq, today);
                totalSpawned++;
            }
        }
        return totalSpawned;
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private RecurringQuestDTO.SpawnResult spawnForUser(User user) {
        LocalDate today = LocalDate.now();
        List<RecurringQuest> activeQuests = recurringQuestRepository
                .findByUserIdAndActiveTrue(user.getId());

        int spawned = 0;
        for (RecurringQuest rq : activeQuests) {
            if (rq.getLastSpawnedDate() == null || rq.getLastSpawnedDate().isBefore(today)) {
                spawnTask(rq, today);
                spawned++;
            }
        }
        return new RecurringQuestDTO.SpawnResult(spawned);
    }

    private void spawnTask(RecurringQuest rq, LocalDate today) {
        Task task = new Task();
        task.setTitle("🔄 " + rq.getTitle());
        task.setDescription(rq.getDescription());
        task.setPriority(rq.getPriority());
        task.setXpReward(rq.getXpReward());
        task.setDueDate(today);
        task.setUser(rq.getUser());
        task.setRecurringQuestId(rq.getId());
        taskRepository.save(task);

        rq.setLastSpawnedDate(today);
        recurringQuestRepository.save(rq);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
