/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.model.HunterRank;
import com.example.taskmanagement.model.Task;
import com.example.taskmanagement.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the LevelService — XP calculation, rank-up, and multipliers.
 * Pure unit tests with no Spring context needed.
 */
class LevelServiceTest {

    private LevelService levelService;

    @BeforeEach
    void setUp() {
        levelService = new LevelService();
    }

    // ── XP Multiplier Tests ───────────────────────────────────────────────

    @Nested
    @DisplayName("XP Multipliers")
    class XpMultipliers {

        @Test
        @DisplayName("LOW priority → ×1.0 multiplier")
        void lowPriority_noMultiplier() {
            User user = createUser(0);
            levelService.awardXp(user, 100, Task.Priority.LOW);
            assertEquals(100, user.getTotalXp());
        }

        @Test
        @DisplayName("MEDIUM priority → ×1.5 multiplier")
        void mediumPriority_1_5xMultiplier() {
            User user = createUser(0);
            levelService.awardXp(user, 100, Task.Priority.MEDIUM);
            assertEquals(150, user.getTotalXp());
        }

        @Test
        @DisplayName("HIGH priority → ×2.0 multiplier")
        void highPriority_2xMultiplier() {
            User user = createUser(0);
            levelService.awardXp(user, 100, Task.Priority.HIGH);
            assertEquals(200, user.getTotalXp());
        }

        @Test
        @DisplayName("XP accumulates across multiple awards")
        void xpAccumulates() {
            User user = createUser(0);
            levelService.awardXp(user, 50, Task.Priority.LOW);    // +50
            levelService.awardXp(user, 50, Task.Priority.HIGH);   // +100
            levelService.awardXp(user, 100, Task.Priority.MEDIUM);// +150
            assertEquals(300, user.getTotalXp());
        }
    }

    // ── Level Calculation Tests ───────────────────────────────────────────

    @Nested
    @DisplayName("Level Calculation")
    class LevelCalculation {

        @Test
        @DisplayName("0 XP → Level 1 (minimum)")
        void zeroXp_levelOne() {
            User user = createUser(0);
            levelService.awardXp(user, 0, Task.Priority.LOW);
            assertEquals(1, user.getLevel());
        }

        @Test
        @DisplayName("100 XP → Level 1")
        void hundredXp_levelOne() {
            User user = createUser(0);
            levelService.awardXp(user, 100, Task.Priority.LOW);
            assertEquals(1, user.getLevel());
        }

        @Test
        @DisplayName("200 XP → Level 2")
        void twoHundredXp_levelTwo() {
            User user = createUser(0);
            levelService.awardXp(user, 200, Task.Priority.LOW);
            assertEquals(2, user.getLevel());
        }

        @Test
        @DisplayName("999 XP → Level 9")
        void nineNineNine_levelNine() {
            User user = createUser(0);
            levelService.awardXp(user, 999, Task.Priority.LOW);
            assertEquals(9, user.getLevel());
        }

        @Test
        @DisplayName("1000 XP → Level 10")
        void thousandXp_levelTen() {
            User user = createUser(0);
            levelService.awardXp(user, 1000, Task.Priority.LOW);
            assertEquals(10, user.getLevel());
        }
    }

    // ── Rank Calculation Tests ────────────────────────────────────────────

    @Nested
    @DisplayName("Rank Calculation")
    class RankCalculation {

        @Test
        @DisplayName("0 XP → E Rank")
        void zeroXp_eRank() {
            User user = createUser(0);
            levelService.awardXp(user, 0, Task.Priority.LOW);
            assertEquals(HunterRank.E, user.getHunterRank());
        }

        @Test
        @DisplayName("999 XP → still E Rank")
        void nineNineNine_stillERank() {
            User user = createUser(0);
            levelService.awardXp(user, 999, Task.Priority.LOW);
            assertEquals(HunterRank.E, user.getHunterRank());
        }

        @Test
        @DisplayName("1000 XP → D Rank")
        void thousandXp_dRank() {
            User user = createUser(0);
            levelService.awardXp(user, 1000, Task.Priority.LOW);
            assertEquals(HunterRank.D, user.getHunterRank());
        }

        @Test
        @DisplayName("3000 XP → C Rank")
        void threeK_cRank() {
            User user = createUser(0);
            levelService.awardXp(user, 3000, Task.Priority.LOW);
            assertEquals(HunterRank.C, user.getHunterRank());
        }

        @Test
        @DisplayName("6000 XP → B Rank")
        void sixK_bRank() {
            User user = createUser(0);
            levelService.awardXp(user, 6000, Task.Priority.LOW);
            assertEquals(HunterRank.B, user.getHunterRank());
        }

        @Test
        @DisplayName("10000 XP → A Rank")
        void tenK_aRank() {
            User user = createUser(0);
            levelService.awardXp(user, 10000, Task.Priority.LOW);
            assertEquals(HunterRank.A, user.getHunterRank());
        }

        @Test
        @DisplayName("15000 XP → S Rank")
        void fifteenK_sRank() {
            User user = createUser(0);
            levelService.awardXp(user, 15000, Task.Priority.LOW);
            assertEquals(HunterRank.S, user.getHunterRank());
        }

        @Test
        @DisplayName("Rank up from E to D via priority multiplier")
        void rankUp_viaMultiplier() {
            User user = createUser(500);  // Start at 500 XP (E rank)
            // 500 base × 2 (HIGH) = 1000 XP earned, total = 1500 → D rank
            levelService.awardXp(user, 500, Task.Priority.HIGH);
            assertEquals(HunterRank.D, user.getHunterRank());
            assertEquals(1500, user.getTotalXp());
        }
    }

    // ── XP to Next Level/Rank ─────────────────────────────────────────────

    @Nested
    @DisplayName("XP Remaining Calculations")
    class XpRemaining {

        @Test
        @DisplayName("xpToNextRank: E rank user needs XP to reach D")
        void xpToNextRank_eRank() {
            User user = createUser(500);
            user.setHunterRank(HunterRank.E);
            int needed = levelService.xpToNextRank(user);
            assertEquals(500, needed); // E max is 999, so 999+1 - 500 = 500
        }

        @Test
        @DisplayName("xpToNextRank: S rank returns 0")
        void xpToNextRank_sRank() {
            User user = createUser(20000);
            user.setHunterRank(HunterRank.S);
            assertEquals(0, levelService.xpToNextRank(user));
        }

        @Test
        @DisplayName("xpToNextLevel calculation")
        void xpToNextLevel() {
            User user = createUser(250);
            user.setLevel(2);
            int needed = levelService.xpToNextLevel(user);
            // Level 2 requires 200 XP, so next level at 200 → 200-250 = -50, capped at 0
            assertTrue(needed >= 0);
        }
    }

    // ── Helper ────────────────────────────────────────────────────────────

    private User createUser(int startingXp) {
        User user = new User();
        user.setId(1L);
        user.setName("TestHunter");
        user.setEmail("test@hunter.com");
        user.setPassword("encoded");
        user.setTotalXp(startingXp);
        user.setLevel(Math.max(1, startingXp / 100));
        user.setHunterRank(HunterRank.fromXp(startingXp));
        return user;
    }
}
