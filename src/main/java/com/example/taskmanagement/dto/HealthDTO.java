package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.HealthRecord;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class HealthDTO {

    // ── Request: what the mobile app sends ──────────────
    public static class SyncRequest {
        @Min(0) private int steps;
        @Min(0) private int heartRate;
        @Min(0) private int sleepMinutes;

        public int getSteps() { return steps; }
        public void setSteps(int steps) { this.steps = steps; }
        public int getHeartRate() { return heartRate; }
        public void setHeartRate(int heartRate) { this.heartRate = heartRate; }
        public int getSleepMinutes() { return sleepMinutes; }
        public void setSleepMinutes(int sleepMinutes) { this.sleepMinutes = sleepMinutes; }
    }

    // ── Response: what the backend returns ──────────────
    public static class HealthResponse {
        private Long id;
        private LocalDate recordDate;
        private int steps;
        private int avgHeartRate;
        private int sleepMinutes;
        private LocalDateTime syncedAt;

        public static HealthResponse from(HealthRecord record) {
            HealthResponse res = new HealthResponse();
            res.id = record.getId();
            res.recordDate = record.getRecordDate();
            res.steps = record.getSteps();
            res.avgHeartRate = record.getAvgHeartRate();
            res.sleepMinutes = record.getSleepMinutes();
            res.syncedAt = record.getSyncedAt();
            return res;
        }

        public Long getId() { return id; }
        public LocalDate getRecordDate() { return recordDate; }
        public int getSteps() { return steps; }
        public int getAvgHeartRate() { return avgHeartRate; }
        public int getSleepMinutes() { return sleepMinutes; }
        public LocalDateTime getSyncedAt() { return syncedAt; }
    }
}
