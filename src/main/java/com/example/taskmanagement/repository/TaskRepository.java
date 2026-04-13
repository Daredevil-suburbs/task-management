package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long userId);

    List<Task> findByUserIdAndStatus(Long userId, Task.Status status);

    List<Task> findByUserIdAndPriority(Long userId, Task.Priority priority);

    Optional<Task> findByIdAndUserId(Long id, Long userId);
    Optional<Task> findByIdAndUserEmail(Long id, String email);

    // Count completed tasks for a user (used in status panel)
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = 'DONE'")
    int countCompletedByUserId(@Param("userId") Long userId);

    // Search quests by title or description
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Task> searchByUserId(@Param("userId") Long userId, @Param("query") String query);

    // Count consecutive days with completed tasks
    @Query("SELECT t.completedAt FROM Task t WHERE t.user.id = :userId AND t.status = 'DONE' AND t.completedAt IS NOT NULL ORDER BY t.completedAt DESC")
    List<LocalDateTime> findCompletedDatesByUserId(@Param("userId") Long userId);
}
