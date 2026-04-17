/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.DailyLogDTO;
import com.example.taskmanagement.model.DailyLog;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.DailyLogRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DailyLogService {

    @Autowired private DailyLogRepository dailyLogRepo;
    @Autowired private UserRepository userRepo;

    /**
     * Save or update today's daily log — upserts the record for today.
     */
    public DailyLogDTO.LogResponse saveOrUpdateToday(String email, DailyLogDTO.LogRequest request) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        DailyLog log = dailyLogRepo.findByUserIdAndLogDate(user.getId(), today)
                .orElseGet(() -> {
                    DailyLog newLog = new DailyLog();
                    newLog.setUser(user);
                    newLog.setLogDate(today);
                    return newLog;
                });

        // Update fields from the request
        log.setMood(request.getMood());
        log.setEnergyLevel(request.getEnergyLevel());
        log.setFocusLevel(request.getFocusLevel());
        log.setSleepHours(request.getSleepHours());
        log.setMedsTaken(request.getMedsTaken());

        dailyLogRepo.save(log);
        return DailyLogDTO.LogResponse.from(log);
    }

    /**
     * Get the last 7 daily logs for a user (for AI analysis).
     */
    public List<DailyLogDTO.LogResponse> getLast7Logs(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return dailyLogRepo.findLast7ByUserId(user.getId())
                .stream()
                .map(DailyLogDTO.LogResponse::from)
                .collect(Collectors.toList());
    }
}
