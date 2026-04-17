/**
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.event;

import com.example.taskmanagement.model.HunterRank;
import org.springframework.context.ApplicationEvent;

/**
 * Event triggered when a user ranks up in the Hunter system.
 * Can be listened to by other components for notifications, logging, etc.
 */
public class RankUpEvent extends ApplicationEvent {

    private final Long userId;
    private final String userEmail;
    private final HunterRank previousRank;
    private final HunterRank newRank;
    private final int totalXp;

    public RankUpEvent(Object source, Long userId, String userEmail,
                       HunterRank previousRank, HunterRank newRank, int totalXp) {
        super(source);
        this.userId = userId;
        this.userEmail = userEmail;
        this.previousRank = previousRank;
        this.newRank = newRank;
        this.totalXp = totalXp;
    }

    public Long getUserId() { return userId; }
    public String getUserEmail() { return userEmail; }
    public HunterRank getPreviousRank() { return previousRank; }
    public HunterRank getNewRank() { return newRank; }
    public int getTotalXp() { return totalXp; }

    /**
     * Convenience method to get a formatted rank-up message.
     */
    public String getRankUpMessage() {
        return String.format("Congratulations! You've ranked up from %s to %s!",
                previousRank.getDisplayName(), newRank.getDisplayName());
    }
}
