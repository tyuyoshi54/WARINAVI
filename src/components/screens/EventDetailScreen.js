import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import AddPaymentModal from '../modals/AddPaymentModal';
import EditPaymentModal from '../modals/EditPaymentModal';
import InviteFriendsModal from '../modals/InviteFriendsModal';
import SettlementResult from '../common/SettlementResult';
import EventInfo from '../common/EventInfo';
import PaymentItem from '../common/PaymentItem';
import EventShareService from '../../services/EventShareService';

export default function EventDetailScreen({ event, onBack, onUpdateEvent, onNavigateToPayPay }) {
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [payments, setPayments] = useState(event.payments || []);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isEditPaymentModalVisible, setIsEditPaymentModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

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

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setIsEditPaymentModalVisible(true);
  };

  const handleSaveEditedPayment = (updatedPayment) => {
    const newPayments = payments.map(payment => 
      payment.id === updatedPayment.id ? updatedPayment : payment
    );
    setPayments(newPayments);
    
    const updatedEvent = {
      ...event,
      payments: newPayments,
    };
    onUpdateEvent(updatedEvent);
    setIsEditPaymentModalVisible(false);
    setEditingPayment(null);
  };

  const handleCloseEditPaymentModal = () => {
    setIsEditPaymentModalVisible(false);
    setEditingPayment(null);
  };

  const handleInviteFriends = () => {
    setIsInviteModalVisible(true);
  };

  const handleShareEvent = async () => {
    try {
      // 共有リンクを生成
      const shareLink = await EventShareService.generateShareLink(event);
      
      await Share.share({
        message: `イベント「${event.name}」に参加しませんか？\n\nイベント詳細を確認して参加できます：\n${shareLink}`,
        title: 'イベント招待',
        url: shareLink,
      });
    } catch (error) {
      console.error('シェアエラー:', error);
      Alert.alert('エラー', 'イベントの共有に失敗しました');
    }
  };

  const handleInviteFriendsComplete = (friendIds, eventData) => {
    console.log('友達招待:', friendIds, 'イベント:', eventData.name);
    // TODO: 実際の招待処理を実装
    alert(`${friendIds.length}人の友達に招待を送信しました！`);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleInviteFriends}>
            <Text style={styles.headerButtonText}>招待</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShareEvent}>
            <Text style={styles.headerButtonText}>共有</Text>
          </TouchableOpacity>
        </View>
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
                <PaymentItem key={payment.id} payment={payment} onEdit={handleEditPayment} />
              ))}
            </View>
          )}
        </View>

        <SettlementResult 
          members={event.members} 
          payments={payments} 
          onNavigateToPayPay={onNavigateToPayPay}
        />
      </ScrollView>

      <AddPaymentModal
        visible={isPaymentModalVisible}
        onClose={handleClosePaymentModal}
        onSave={handleSavePayment}
        members={event.members}
      />

      <EditPaymentModal
        visible={isEditPaymentModalVisible}
        onClose={handleCloseEditPaymentModal}
        onSave={handleSaveEditedPayment}
        members={event.members}
        payment={editingPayment}
      />

      <InviteFriendsModal
        visible={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
        event={event}
        onInviteFriends={handleInviteFriendsComplete}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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