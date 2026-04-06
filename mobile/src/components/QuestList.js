import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../theme';
import QuestCard from './QuestCard';

export default function QuestList({ quests, loading, onRefresh, onComplete, onDelete }) {
  if (loading && quests.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.purple} size="large" />
      </View>
    );
  }

  if (!loading && quests.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>- NO QUESTS AVAILABLE -</Text>
        <Text style={styles.emptySub}>Check your filters or create a new quest</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={quests}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <QuestCard 
          quest={item} 
          onComplete={onComplete} 
          onDelete={onDelete} 
        />
      )}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl 
          refreshing={loading} 
          onRefresh={onRefresh} 
          tintColor={Colors.purple} 
          colors={[Colors.purple]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
