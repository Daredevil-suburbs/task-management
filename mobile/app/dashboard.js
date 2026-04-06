import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Colors } from '../src/theme';
import StatusPanel from '../src/components/StatusPanel';
import QuestList from '../src/components/QuestList';
import AddQuest from '../src/components/AddQuest';
import { questAPI } from '../src/services/api';
import { LogOut, Filter } from 'lucide-react-native';

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
});
