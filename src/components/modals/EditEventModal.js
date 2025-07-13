import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function EditEventModal({ visible, onClose, onSave, event }) {
  const [eventName, setEventName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎉');

  const eventIcons = [
    '🎉', '🍻', '🍽️', '🏠', '🎵', '🎮',
    '⚽', '🏀', '🎾', '🏊', '🎿', '🏕️',
    '🌸', '🍔', '🍕', '☕', '🎂', '🎊',
    '💼', '📚', '🎯', '🎪', '🎨', '🎭'
  ];

  useEffect(() => {
    if (event) {
      setEventName(event.name || '');
      setSelectedIcon(event.icon || '🎉');
    }
  }, [event]);

  const handleSave = () => {
    if (!eventName.trim()) {
      Alert.alert('エラー', 'イベント名を入力してください');
      return;
    }

    const updatedEventData = {
      ...event,
      name: eventName.trim(),
      icon: selectedIcon,
    };

    onSave(updatedEventData);
    onClose();
  };

  const handleCancel = () => {
    if (event) {
      setEventName(event.name || '');
      setSelectedIcon(event.icon || '🎉');
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.modalTitle}>イベントを編集</Text>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>イベント名</Text>
              <TextInput
                style={styles.eventNameInput}
                value={eventName}
                onChangeText={setEventName}
                placeholder="飲み会、バーベキューなど"
                returnKeyType="done"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>アイコン</Text>
              <View style={styles.iconGrid}>
                {eventIcons.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.iconButton,
                      selectedIcon === icon && styles.selectedIconButton
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '60%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventNameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconButton: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  iconText: {
    fontSize: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 0.45,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 0.45,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});