import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AddPaymentModal from './AddPaymentModal';
import SettlementResult from './SettlementResult';

export default function EventDetailScreen({ event, onBack, onUpdateEvent }) {
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [payments, setPayments] = useState(event.payments || []);

  const addPayment = () => {
    setIsPaymentModalVisible(true);
  };

  const handleSavePayment = (paymentData) => {
    const newPayments = [...payments, paymentData];
    setPayments(newPayments);
    
    const updatedEvent = {
      ...event,
      payments: newPayments,
    };
    onUpdateEvent(updatedEvent);
    setIsPaymentModalVisible(false);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalVisible(false);
  };

  const renderPayment = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentTitle}>{item.title}</Text>
        <Text style={styles.paymentAmount}>¥{item.amount.toLocaleString()}</Text>
      </View>
      <Text style={styles.paymentPayer}>支払い者: {item.payer}</Text>
      <Text style={styles.paymentDate}>{item.createdAt}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{event.name}</Text>
          <View style={styles.membersContainer}>
            <Text style={styles.membersTitle}>メンバー:</Text>
            <View style={styles.membersList}>
              {event.members.map((member, index) => (
                <View key={index} style={styles.memberChip}>
                  <Text style={styles.memberName}>{member}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.paymentsSection}>
          <View style={styles.paymentsSectionHeader}>
            <Text style={styles.paymentsSectionTitle}>支払い記録</Text>
            <TouchableOpacity style={styles.addPaymentButton} onPress={addPayment}>
              <Text style={styles.addPaymentButtonText}>支払い追加</Text>
            </TouchableOpacity>
          </View>

          {payments.length === 0 ? (
            <View style={styles.emptyPaymentsContainer}>
              <Text style={styles.emptyPaymentsText}>まだ支払い記録がありません</Text>
              <Text style={styles.emptyPaymentsSubText}>「支払い追加」で記録を追加しましょう</Text>
            </View>
          ) : (
            <View>
              {payments.map((payment) => renderPayment({ item: payment }))}
            </View>
          )}
        </View>

        <SettlementResult members={event.members} payments={payments} />
      </ScrollView>

      <AddPaymentModal
        visible={isPaymentModalVisible}
        onClose={handleClosePaymentModal}
        onSave={handleSavePayment}
        members={event.members}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  eventInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  membersContainer: {
    marginTop: 10,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 14,
    color: '#333',
  },
  paymentsSection: {
    padding: 20,
  },
  paymentsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPaymentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addPaymentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyPaymentsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPaymentsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptyPaymentsSubText: {
    fontSize: 14,
    color: '#999',
  },
  paymentItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  paymentPayer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  paymentDate: {
    fontSize: 12,
    color: '#999',
  },
});