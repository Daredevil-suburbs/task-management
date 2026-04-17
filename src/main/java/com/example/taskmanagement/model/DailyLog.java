/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_logs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "log_date"})
})
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(nullable = false)
    private int mood;

    @Column(name = "energy_level", nullable = false)
    private int energyLevel;

    @Column(name = "focus_level", nullable = false)
    private int focusLevel;

    @Column(name = "sleep_hours", nullable = false)
    private double sleepHours;

    @Column(name = "meds_taken", nullable = false)
    private boolean medsTaken;

    // ── Getters & Setters ──────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDate getLogDate() { return logDate; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
    public int getMood() { return mood; }
    public void setMood(int mood) { this.mood = mood; }
    public int getEnergyLevel() { return energyLevel; }
    public void setEnergyLevel(int energyLevel) { this.energyLevel = energyLevel; }
    public int getFocusLevel() { return focusLevel; }
    public void setFocusLevel(int focusLevel) { this.focusLevel = focusLevel; }
    public double getSleepHours() { return sleepHours; }
    public void setSleepHours(double sleepHours) { this.sleepHours = sleepHours; }
    public boolean isMedsTaken() { return medsTaken; }
    public void setMedsTaken(boolean medsTaken) { this.medsTaken = medsTaken; }
}
