/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.model.HunterRank;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the HunterRank enum — XP thresholds, rank determination.
 */
class HunterRankTest {

    @ParameterizedTest
    @DisplayName("fromXp returns correct rank for XP thresholds")
    @CsvSource({
        "0, E",
        "500, E",
        "999, E",
        "1000, D",
        "2999, D",
        "3000, C",
        "5999, C",
        "6000, B",
        "9999, B",
        "10000, A",
        "14999, A",
        "15000, S",
        "99999, S"
    })
    void fromXp_correctRank(int xp, String expectedRank) {
        HunterRank rank = HunterRank.fromXp(xp);
        assertEquals(HunterRank.valueOf(expectedRank), rank);
    }

    @ParameterizedTest
    @DisplayName("levelFromXp returns correct level")
    @CsvSource({
        "0, 1",     // min level is 1
        "50, 1",    // 50/100 = 0, but min is 1
        "100, 1",   // 100/100 = 1
        "200, 2",
        "999, 9",
        "1000, 10",
        "15000, 150"
    })
    void levelFromXp_correctLevel(int xp, int expectedLevel) {
        assertEquals(expectedLevel, HunterRank.levelFromXp(xp));
    }

    @Test
    @DisplayName("xpToNextRank: E rank at 500 XP needs 500 more")
    void xpToNextRank_eRank() {
        assertEquals(500, HunterRank.E.xpToNextRank(500));
    }

    @Test
    @DisplayName("xpToNextRank: S rank returns 0")
    void xpToNextRank_sRank() {
        assertEquals(0, HunterRank.S.xpToNextRank(20000));
    }

    @Test
    @DisplayName("Display names are correct")
    void displayNames() {
        assertEquals("E Rank", HunterRank.E.getDisplayName());
        assertEquals("S Rank", HunterRank.S.getDisplayName());
    }
}
