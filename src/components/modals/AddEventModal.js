import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';

export default function AddEventModal({ visible, onClose, onSave }) {
  const [eventName, setEventName] = useState('');
  const [members, setMembers] = useState(['']);
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎉');

  const eventIcons = [
    '🎉', '🍻', '🍽️', '🏠', '🎵', '🎮',
    '⚽', '🏀', '🎾', '🏊', '🎿', '🏕️',
    '🌸', '🍔', '🍕', '☕', '🎂', '🎊',
    '💼', '📚', '🎯', '🎪', '🎨', '🎭'
  ];

  const addMember = () => {
    if (newMemberName.trim()) {
      setMembers([...members, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers.length > 0 ? updatedMembers : ['']);
  };

  const updateMember = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleSave = () => {
    if (!eventName.trim()) {
      Alert.alert('エラー', 'イベント名を入力してください');
      return;
    }

    const validMembers = members.filter(member => member.trim());
    if (validMembers.length === 0) {
      Alert.alert('エラー', 'メンバーを最低1人追加してください');
      return;
    }

    const eventData = {
      id: Date.now().toString(),
      name: eventName.trim(),
      members: validMembers,
      icon: selectedIcon,
      createdAt: new Date().toLocaleDateString(),
    };

    onSave(eventData);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setEventName('');
    setMembers(['']);
    setNewMemberName('');
    setSelectedIcon('🎉');
  };

  const renderMember = ({ item, index }) => (
    <View style={styles.memberRow}>
      <TextInput
        style={styles.memberInput}
        value={item}
        onChangeText={(value) => updateMember(index, value)}
        placeholder="メンバー名"
        returnKeyType="done"
      />
      {members.length > 1 && (
        <TouchableOpacity
          style={styles.removeMemberButton}
          onPress={() => removeMember(index)}
        >
          <Text style={styles.removeMemberText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.modalTitle}>新しいイベントを作成</Text>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>イベント名</Text>
              <TextInput
                style={styles.eventNameInput}
                value={eventName}
                onChangeText={setEventName}
                placeholder="飲み会、バーベキューなど"
                returnKeyType="next"
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

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>メンバー</Text>
              <FlatList
                data={members}
                renderItem={renderMember}
                keyExtractor={(item, index) => index.toString()}
                style={styles.membersList}
                scrollEnabled={false}
                nestedScrollEnabled={true}
              />
              
              <View style={styles.addMemberRow}>
                <TextInput
                  style={styles.newMemberInput}
                  value={newMemberName}
                  onChangeText={setNewMemberName}
                  placeholder="新しいメンバー名"
                  returnKeyType="done"
                  onSubmitEditing={addMember}
                />
                <TouchableOpacity style={styles.addMemberButton} onPress={addMember}>
                  <Text style={styles.addMemberText}>追加</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>作成</Text>
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
    maxHeight: '75%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingBottom: 100,
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
  membersList: {
    maxHeight: 120,
    flexGrow: 0,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  memberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  removeMemberButton: {
    backgroundColor: '#ff4444',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMemberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  newMemberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addMemberButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addMemberText: {
    color: '#fff',
    fontWeight: 'bold',
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
});