package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.HealthDTO;
import com.example.taskmanagement.model.HealthRecord;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.HealthRecordRepository;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthService {

    @Autowired private HealthRecordRepository healthRepo;
    @Autowired private UserRepository userRepo;

    /**
     * Sync today's health data — upserts (creates or updates) the record for today.
     */
    public HealthDTO.HealthResponse syncToday(String email, HealthDTO.SyncRequest request) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        HealthRecord record = healthRepo.findByUserIdAndRecordDate(user.getId(), today)
                .orElseGet(() -> {
                    HealthRecord r = new HealthRecord();
                    r.setUser(user);
                    r.setRecordDate(today);
                    return r;
                });

        // Update with the latest values from the phone
        record.setSteps(request.getSteps());
        record.setAvgHeartRate(request.getHeartRate());
        record.setSleepMinutes(request.getSleepMinutes());

        healthRepo.save(record);
        return HealthDTO.HealthResponse.from(record);
    }

    /**
     * Get today's health record, or null if not synced yet.
     */
    public HealthDTO.HealthResponse getToday(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return healthRepo.findByUserIdAndRecordDate(user.getId(), LocalDate.now())
                .map(HealthDTO.HealthResponse::from)
                .orElse(null);
    }

    /**
     * Get health history for the last N days.
     */
    public List<HealthDTO.HealthResponse> getHistory(String email, int days) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days);

        return healthRepo.findByUserIdAndRecordDateBetweenOrderByRecordDateAsc(
                        user.getId(), start, end)
                .stream()
                .map(HealthDTO.HealthResponse::from)
                .collect(Collectors.toList());
    }
}
