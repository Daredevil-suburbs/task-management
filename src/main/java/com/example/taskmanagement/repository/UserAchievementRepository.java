package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    List<UserAchievement> findByUserId(Long userId);

    boolean existsByUserIdAndAchievementId(Long userId, Long achievementId);

    boolean existsByUserIdAndAchievementKey(Long userId, String achievementKey);
}
