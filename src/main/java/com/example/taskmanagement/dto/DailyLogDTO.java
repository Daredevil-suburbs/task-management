/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.dto;

import com.example.taskmanagement.model.DailyLog;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class DailyLogDTO {

    // ── Request: what the client sends ──────────────
    public static class LogRequest {

        @NotNull @Min(1) @Max(10)
        private Integer mood;

        @NotNull @Min(1) @Max(10)
        private Integer energyLevel;

        @NotNull @Min(1) @Max(10)
        private Integer focusLevel;

        @NotNull @Min(0) @Max(24)
        private Double sleepHours;

        @NotNull
        private Boolean medsTaken;

        public Integer getMood() { return mood; }
        public void setMood(Integer mood) { this.mood = mood; }
        public Integer getEnergyLevel() { return energyLevel; }
        public void setEnergyLevel(Integer energyLevel) { this.energyLevel = energyLevel; }
        public Integer getFocusLevel() { return focusLevel; }
        public void setFocusLevel(Integer focusLevel) { this.focusLevel = focusLevel; }
        public Double getSleepHours() { return sleepHours; }
        public void setSleepHours(Double sleepHours) { this.sleepHours = sleepHours; }
        public Boolean getMedsTaken() { return medsTaken; }
        public void setMedsTaken(Boolean medsTaken) { this.medsTaken = medsTaken; }
    }

    // ── Response: what the backend returns ──────────────
    public static class LogResponse {
        private Long id;
        private LocalDate logDate;
        private int mood;
        private int energyLevel;
        private int focusLevel;
        private double sleepHours;
        private boolean medsTaken;

        public static LogResponse from(DailyLog log) {
            LogResponse res = new LogResponse();
            res.id = log.getId();
            res.logDate = log.getLogDate();
            res.mood = log.getMood();
            res.energyLevel = log.getEnergyLevel();
            res.focusLevel = log.getFocusLevel();
            res.sleepHours = log.getSleepHours();
            res.medsTaken = log.isMedsTaken();
            return res;
        }

        public Long getId() { return id; }
        public LocalDate getLogDate() { return logDate; }
        public int getMood() { return mood; }
        public int getEnergyLevel() { return energyLevel; }
        public int getFocusLevel() { return focusLevel; }
        public double getSleepHours() { return sleepHours; }
        public boolean isMedsTaken() { return medsTaken; }
    }
}
