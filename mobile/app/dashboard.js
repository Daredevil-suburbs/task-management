import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { healthService } from '../src/services/health';
import { Colors } from '../src/theme';
import StatusPanel from '../src/components/StatusPanel';
import QuestList from '../src/components/QuestList';
import AddQuest from '../src/components/AddQuest';
import { questAPI, healthAPI } from '../src/services/api';
import { LogOut, Filter, Activity, Heart, Moon, RefreshCw } from 'lucide-react-native';

const FILTERS = [
  { label: 'ALL', value: {} },
  { label: 'ACTIVE', value: { status: 'TODO' } },
  { label: 'HIGH', value: { priority: 'HIGH' } },
  { label: 'DONE', value: { status: 'DONE' } },
];

export default function Dashboard() {
  const { logout, user } = useAuth();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [healthData, setHealthData] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const fetchQuests = useCallback(async (filterValue = FILTERS[activeFilter].value) => {
    setLoading(true);
    try {
      const res = await questAPI.getAll(filterValue);
      setQuests(res.data);
    } catch (err) {
      console.error('Failed to fetch quests', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests, refreshTrigger]);

  // Load today's health data from backend on mount
  useEffect(() => {
    healthAPI.getToday()
      .then(res => { if (res.data) setHealthData(res.data); })
      .catch(() => {}); // 204 No Content = not synced yet
  }, []);

  const handleQuestAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleComplete = async (id) => {
    try {
      await questAPI.complete(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to complete', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await questAPI.delete(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleFilterChange = (index) => {
    setActiveFilter(index);
    fetchQuests(FILTERS[index].value);
  };

  const syncHealth = async () => {
    setSyncing(true);
    try {
      const isAvailable = await healthService.checkAvailability();
      if (!isAvailable) { setSyncing(false); return; }

      await healthService.initialize();
      await healthService.requestPermissions();
      
      const data = await healthService.fetchTodayData();
      if (data) {
        // Send to Spring Boot backend
        const res = await healthAPI.sync({
          steps: data.steps,
          heartRate: data.heartRate,
          sleepMinutes: data.sleepMinutes,
        });
        setHealthData(res.data);
        console.log('Health data synced to backend:', res.data);
      }
    } catch (err) {
      console.error('Sync failed', err);
      Alert.alert('Sync Failed', 'Could not sync health data. Make sure Health Connect is set up.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>QUEST BOARD</Text>
          <Text style={styles.headerSubtitle}>RANK ASCENSION IN PROGRESS</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut color={Colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <StatusPanel refreshTrigger={refreshTrigger} />

        <View style={styles.healthStats}>
          <TouchableOpacity style={styles.syncCard} onPress={syncHealth} disabled={syncing}>
            <View style={styles.syncHeader}>
              <Text style={styles.healthTitle}>HEALTH STATS (DAILY)</Text>
              {syncing ? <ActivityIndicator size="small" color={Colors.gold} /> : <RefreshCw size={12} color={Colors.gold} />}
            </View>
            
            <View style={styles.healthItems}>
              <View style={styles.healthItem}>
                <Activity size={16} color={Colors.rankC} />
                <Text style={styles.healthValue}>{healthData?.steps || '--'}</Text>
                <Text style={styles.healthLabel}>Steps</Text>
              </View>
              <View style={styles.healthDivider} />
              <View style={styles.healthItem}>
                <Heart size={16} color={Colors.danger} />
                <Text style={styles.healthValue}>{healthData?.avgHeartRate || healthData?.heartRate || '--'} bpm</Text>
                <Text style={styles.healthLabel}>Avg HR</Text>
              </View>
              <View style={styles.healthDivider} />
              <View style={styles.healthItem}>
                <Moon size={16} color={Colors.purpleLight} />
                <Text style={styles.healthValue}>{healthData ? Math.floor(healthData.sleepMinutes / 60) + 'h ' + (healthData.sleepMinutes % 60) + 'm' : '--'}</Text>
                <Text style={styles.healthLabel}>Sleep</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.boardHeader}>
          <View style={styles.filterRow}>
            {FILTERS.map((f, i) => (
              <TouchableOpacity 
                key={f.label} 
                style={[styles.filterTab, activeFilter === i && styles.filterTabActive]}
                onPress={() => handleFilterChange(i)}
              >
                <Text style={[styles.filterTabText, activeFilter === i && styles.filterTabTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.listContainer}>
          <QuestList 
            quests={quests} 
            loading={loading} 
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            onComplete={handleComplete}
            onDelete={handleDelete}
         />
        </View>
      </View>

      <View style={styles.fabContainer}>
        <AddQuest onQuestAdded={handleQuestAdded} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: Colors.gold,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.bgSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  boardHeader: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSecondary,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterTabActive: {
    backgroundColor: Colors.purpleDark,
  },
  filterTabText: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  filterTabTextActive: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
    marginTop: 4,
  },
  fabContainer: {
    padding: 20,
    backgroundColor: Colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  healthStats: {
    marginBottom: 20,
  },
  syncCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTitle: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  healthItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  healthLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    textTransform: 'uppercase',
  },
  healthDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
  }
});
