import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, PriorityColors } from '../theme';
import { Check, Trash2, Clock } from 'lucide-react-native';

const PRIORITY_LABELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

const STATUS_LABELS = {
  TODO: 'TODO',
  IN_PROGRESS: 'PROGRESS',
  DONE: 'DONE'
};

export default function QuestCard({ quest, onComplete, onDelete }) {
  const priorityColor = PriorityColors[quest.priority] || Colors.textSecondary;
  const isDone = quest.status === 'DONE';

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.header}>
        <View style={[styles.priorityBadge, { borderColor: priorityColor }]}>
          <Text style={[styles.priorityText, { color: priorityColor }]}>{PRIORITY_LABELS[quest.priority]}</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{quest.xpReward} XP</Text>
        </View>
      </View>

      <Text style={[styles.title, isDone && styles.titleDone]}>{quest.title}</Text>
      {quest.description && <Text style={styles.description}>{quest.description}</Text>}

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Clock size={12} color={Colors.textMuted} />
          <Text style={styles.dateText}>{new Date(quest.dueDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.actions}>
          {!isDone && (
            <TouchableOpacity 
              style={styles.completeBtn} 
              onPress={() => onComplete(quest.id)}
            >
              <Check size={18} color={Colors.success} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={() => onDelete(quest.id)}
          >
            <Trash2 size={18} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {isDone && <View style={styles.completedOverlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardDone: {
    opacity: 0.6,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  priorityText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  xpBadge: {
    backgroundColor: Colors.purpleGlow,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.purpleDark,
  },
  xpText: {
    color: Colors.purpleLight,
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  completeBtn: {
    padding: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  completedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    pointerEvents: 'none',
  },
});
