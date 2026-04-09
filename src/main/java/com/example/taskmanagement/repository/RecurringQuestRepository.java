package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.RecurringQuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringQuestRepository extends JpaRepository<RecurringQuest, Long> {

    /** All active recurring quests for a user */
    List<RecurringQuest> findByUserIdAndActiveTrue(Long userId);

    /** All recurring quests for a user (active + inactive) */
    List<RecurringQuest> findByUserId(Long userId);

    /** Find by ID scoped to user */
    Optional<RecurringQuest> findByIdAndUserId(Long id, Long userId);

    /** All active recurring quests across all users (used by scheduler) */
    List<RecurringQuest> findByActiveTrue();
}
