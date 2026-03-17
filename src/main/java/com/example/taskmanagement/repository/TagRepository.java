package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
    Optional<Tag> findByIdAndUserId(Long id, Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
}
