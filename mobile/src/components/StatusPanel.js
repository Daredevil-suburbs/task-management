import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { userAPI } from '../services/api';
import { Colors, Ranks, RankColors } from '../theme';
import XPProgressBar from './XPProgressBar';

const getRankLetter = (displayName) => displayName?.split(' ')[0] || 'E';

export default function StatusPanel({ refreshTrigger }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rankUp, setRankUp] = useState(false);

  useEffect(() => {
    userAPI.getStatus()
      .then(res => {
        if (status) {
          const prev = getRankLetter(status.hunterRank);
          const next = getRankLetter(res.data.hunterRank);
          if (Ranks.indexOf(next) > Ranks.indexOf(prev)) {
            setRankUp(true);
          }
        }
        setStatus(res.data);
      })
      .catch(err => {
        console.error('Failed to get status', err);
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  useEffect(() => {
    if (rankUp) {
      const t = setTimeout(() => setRankUp(false), 3000);
      return () => clearTimeout(t);
    }
  }, [rankUp]);

  if (loading) return (
    <View style={styles.panel}>
      <ActivityIndicator color={Colors.purple} />
    </View>
  );

  if (!status) return null;

  const rankLetter = getRankLetter(status.hunterRank);
  const rankColor = RankColors[rankLetter] || Colors.rankE;
  const xpProgress = status.xpToNextLevel > 0
    ? Math.round(((100 - status.xpToNextLevel) / 100) * 100)
    : 100;

  return (
    <View style={styles.panel}>
      {rankUp && (
        <View style={styles.rankUpBanner}>
          <Text style={styles.rankUpText}>⚡ RANK UP! You are now {status.hunterRank}!</Text>
        </View>
      )}

      <View style={styles.top}>
        <View style={[styles.rankBadge, { borderColor: rankColor }]}>
          <Text style={[styles.rankLetter, { color: rankColor }]}>{rankLetter}</Text>
          <Text style={styles.rankLabel}>RANK</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{status.name}</Text>
          <Text style={styles.rankName}>{status.hunterRank}</Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelNum}>LV.{status.level}</Text>
        </View>
      </View>

      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>EXP</Text>
          <View style={styles.xpRight}>
             <Text style={styles.xpNumbers}>{status.totalXp.toLocaleString()} XP</Text>
             {!status.maxRank && <Text style={styles.xpNext}> · {status.xpToNextRank} to next rank</Text>}
          </View>
        </View>
        <XPProgressBar progress={xpProgress} />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{status.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Quests Done</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{status.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={[styles.stat]}>
          <Text style={[styles.statValue, { color: rankColor }]}>{rankLetter}</Text>
          <Text style={styles.statLabel}>Rank</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
    elevation: 4,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  rankUpBanner: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
    borderColor: Colors.purple,
    borderWidth: 1,
  },
  rankUpText: {
    color: Colors.purpleLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankBadge: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  rankLetter: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rankLabel: {
    fontSize: 8,
    color: '#aaa',
    fontWeight: 'bold',
    marginTop: -4,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rankName: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  levelBadge: {
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelNum: {
    color: Colors.gold,
    fontWeight: 'bold',
    fontSize: 14,
  },
  xpSection: {
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  xpRight: {
    flexDirection: 'row',
  },
  xpNumbers: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  xpNext: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
