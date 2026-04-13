package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.SubtaskDTO;
import com.example.taskmanagement.model.Subtask;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.repository.SubtaskRepository;
import com.example.taskmanagement.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class SubtaskService {

    @Autowired
    private SubtaskRepository subtaskRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<SubtaskDTO.Response> getSubtasksByTaskId(Long taskId, String email) {
        taskRepository.findByIdAndUserEmail(taskId, email)
            .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));

        List<Subtask> subtasks = subtaskRepository.findByTaskId(taskId);
        return subtasks.stream().map(SubtaskDTO.Response::fromSubtask).collect(Collectors.toList());
    }

    @Transactional
    public SubtaskDTO.Response createSubtask(Long taskId, SubtaskDTO.Request request, String email) {
        Task task = taskRepository.findByIdAndUserEmail(taskId, email)
            .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));

        Subtask subtask = new Subtask();
        subtask.setTitle(request.getTitle());
        subtask.setDescription(request.getDescription());
        subtask.setCompleted(request.isCompleted());
        subtask.setOrderIndex(request.getOrderIndex());
        subtask.setTask(task);

        if (request.isCompleted()) {
            subtask.setCompletedAt(LocalDateTime.now());
        }

        return SubtaskDTO.Response.fromSubtask(subtaskRepository.save(subtask));
    }

    @Transactional
    public SubtaskDTO.Response updateSubtask(Long taskId, Long subtaskId, SubtaskDTO.Request request, String email) {
        taskRepository.findByIdAndUserEmail(taskId, email)
            .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));

        Subtask subtask = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
            .orElseThrow(() -> new RuntimeException("Subtask not found"));

        if (request.getTitle() != null) subtask.setTitle(request.getTitle());
        if (request.getDescription() != null) subtask.setDescription(request.getDescription());
        if (request.getOrderIndex() > 0) subtask.setOrderIndex(request.getOrderIndex());

        if (request.isCompleted() && !subtask.isCompleted()) {
            subtask.setCompleted(true);
            subtask.setCompletedAt(LocalDateTime.now());
        } else if (!request.isCompleted()) {
            subtask.setCompleted(false);
            subtask.setCompletedAt(null);
        }

        return SubtaskDTO.Response.fromSubtask(subtaskRepository.save(subtask));
    }

    @Transactional
    public void deleteSubtask(Long taskId, Long subtaskId, String email) {
        taskRepository.findByIdAndUserEmail(taskId, email)
            .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));

        Subtask subtask = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
            .orElseThrow(() -> new RuntimeException("Subtask not found"));

        subtaskRepository.delete(subtask);
    }

    @Transactional
    public SubtaskDTO.Response toggleSubtask(Long taskId, Long subtaskId, String email) {
        taskRepository.findByIdAndUserEmail(taskId, email)
            .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));

        Subtask subtask = subtaskRepository.findByIdAndTaskId(subtaskId, taskId)
            .orElseThrow(() -> new RuntimeException("Subtask not found"));

        subtask.setCompleted(!subtask.isCompleted());
        subtask.setCompletedAt(subtask.isCompleted() ? LocalDateTime.now() : null);

        return SubtaskDTO.Response.fromSubtask(subtaskRepository.save(subtask));
    }
}
