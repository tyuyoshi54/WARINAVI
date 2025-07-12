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
import AddPaymentModal from '../modals/AddPaymentModal';
import SettlementResult from '../common/SettlementResult';
import EventInfo from '../common/EventInfo';
import PaymentItem from '../common/PaymentItem';

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


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <EventInfo event={event} />

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
              {payments.map((payment) => (
                <PaymentItem key={payment.id} payment={payment} />
              ))}
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
});