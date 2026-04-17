/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.repository;

import com.example.taskmanagement.model.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {

    Optional<DailyLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    /**
     * Returns the last 7 daily logs for a specific user, ordered by date descending.
     */
    @Query("SELECT d FROM DailyLog d WHERE d.user.id = :userId ORDER BY d.logDate DESC LIMIT 7")
    List<DailyLog> findLast7ByUserId(@Param("userId") Long userId);
}
