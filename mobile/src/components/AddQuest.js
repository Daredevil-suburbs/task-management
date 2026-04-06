import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Colors } from '../theme';
import { questAPI } from '../services/api';
import { PlusCircle, X } from 'lucide-react-native';

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: 'LOW',
  dueDate: new Date().toISOString().split('T')[0],
  xpReward: 100,
};

export default function AddQuest({ onQuestAdded }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return Alert.alert('Title is required');
    
    setLoading(true);
    try {
      await questAPI.create(formData);
      setModalVisible(false);
      setFormData(INITIAL_FORM);
      onQuestAdded();
    } catch (err) {
      console.error('Failed to create quest', err);
      Alert.alert('Error', 'Something went wrong creating the quest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setModalVisible(true)}
      >
        <PlusCircle color="#fff" size={20} />
        <Text style={styles.addButtonText}>NEW QUEST</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>POST NEW QUEST</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>QUEST TITLE</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Drink water, slay goblins..."
                  placeholderTextColor={Colors.textMuted}
                  value={formData.title}
                  onChangeText={(t) => setFormData({...formData, title: t})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>DESCRIPTION (OPTIONAL)</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Details about your quest..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(t) => setFormData({...formData, description: t})}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>PRIORITY</Text>
                  <View style={styles.pickerRow}>
                    {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                      <TouchableOpacity 
                        key={p} 
                        style={[styles.pickerBtn, formData.priority === p && styles.pickerBtnActive]}
                        onPress={() => setFormData({...formData, priority: p})}
                      >
                        <Text style={[styles.pickerBtnText, formData.priority === p && styles.pickerBtnTextActive]}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                   <Text style={styles.label}>XP REWARD</Text>
                   <TextInput 
                    style={styles.input} 
                    keyboardType="numeric"
                    value={formData.xpReward.toString()}
                    onChangeText={(t) => setFormData({...formData, xpReward: parseInt(t) || 0})}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitBtnText}>{loading ? 'CREATING...' : 'ACCEPT QUEST'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: Colors.purpleDark,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.purple,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.purple,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: Colors.gold,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 12,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    alignItems: 'center',
  },
  pickerBtnActive: {
    borderColor: Colors.purple,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  pickerBtnText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  pickerBtnTextActive: {
    color: Colors.purpleLight,
  },
  submitBtn: {
    backgroundColor: Colors.gold,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
  },
});
