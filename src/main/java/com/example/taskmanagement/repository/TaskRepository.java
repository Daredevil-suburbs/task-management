package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long userId);

    List<Task> findByUserIdAndStatus(Long userId, Task.Status status);

    List<Task> findByUserIdAndPriority(Long userId, Task.Priority priority);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    // Count completed tasks for a user (used in status panel)
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = DONE")
    int countCompletedByUserId(@Param("userId") Long userId);
}
