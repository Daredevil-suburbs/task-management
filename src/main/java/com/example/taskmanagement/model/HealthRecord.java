/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "record_date"})
})
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(nullable = false)
    private int steps = 0;

    @Column(nullable = false)
    private int avgHeartRate = 0;

    @Column(nullable = false)
    private int sleepMinutes = 0;

    @UpdateTimestamp
    @Column
    private LocalDateTime syncedAt;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public int getSteps() { return steps; }
    public void setSteps(int steps) { this.steps = steps; }
    public int getAvgHeartRate() { return avgHeartRate; }
    public void setAvgHeartRate(int avgHeartRate) { this.avgHeartRate = avgHeartRate; }
    public int getSleepMinutes() { return sleepMinutes; }
    public void setSleepMinutes(int sleepMinutes) { this.sleepMinutes = sleepMinutes; }
    public LocalDateTime getSyncedAt() { return syncedAt; }
    public void setSyncedAt(LocalDateTime syncedAt) { this.syncedAt = syncedAt; }
}
