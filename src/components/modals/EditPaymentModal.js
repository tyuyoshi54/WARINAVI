import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

export default function EditPaymentModal({ visible, onClose, onSave, members, payment }) {
  const [selectedPayer, setSelectedPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (payment) {
      setSelectedPayer(payment.payer);
      setAmount(payment.amount.toString());
      setTitle(payment.title);
    }
  }, [payment]);

  const handleSave = () => {
    if (!selectedPayer) {
      Alert.alert('エラー', '支払った人を選択してください');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('エラー', '正しい金額を入力してください');
      return;
    }

    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }

    const updatedPayment = {
      ...payment,
      payer: selectedPayer,
      amount: parseFloat(amount),
      title: title.trim(),
    };

    onSave(updatedPayment);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const renderPayerOption = (member) => (
    <TouchableOpacity
      key={member}
      style={[
        styles.payerOption,
        selectedPayer === member && styles.selectedPayerOption,
      ]}
      onPress={() => setSelectedPayer(member)}
    >
      <Text
        style={[
          styles.payerOptionText,
          selectedPayer === member && styles.selectedPayerOptionText,
        ]}
      >
        {member}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>支払いを編集</Text>

          <ScrollView style={styles.scrollContainer}>
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>支払った人</Text>
              <View style={styles.payerGrid}>
                {members.map(renderPayerOption)}
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>金額</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="1000"
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>タイトル</Text>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="昼食代、タクシー代など"
                returnKeyType="done"
              />
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>保存</Text>
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
  scrollContainer: {
    maxHeight: 400,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  payerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  payerOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPayerOption: {
    backgroundColor: '#007AFF',
    borderColor: '#0056CC',
  },
  payerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedPayerOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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