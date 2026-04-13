/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    Optional<HealthRecord> findByUserIdAndRecordDate(Long userId, LocalDate recordDate);

    List<HealthRecord> findByUserIdOrderByRecordDateDesc(Long userId);

    List<HealthRecord> findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(
            Long userId, LocalDate start, LocalDate end);
}
