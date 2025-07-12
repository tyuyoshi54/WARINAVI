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
} from 'react-native';

export default function AddEventModal({ visible, onClose, onSave }) {
  const [eventName, setEventName] = useState('');
  const [members, setMembers] = useState(['']);
  const [newMemberName, setNewMemberName] = useState('');

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
            <Text style={styles.sectionTitle}>メンバー</Text>
            <FlatList
              data={members}
              renderItem={renderMember}
              keyExtractor={(item, index) => index.toString()}
              style={styles.membersList}
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
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
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
    maxHeight: 150,
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
});