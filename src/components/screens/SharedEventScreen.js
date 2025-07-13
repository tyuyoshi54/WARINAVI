import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import EventInfo from '../common/EventInfo';
import PaymentItem from '../common/PaymentItem';
import SettlementResult from '../common/SettlementResult';
import AddPaymentModal from '../modals/AddPaymentModal';
import EventShareService from '../../services/EventShareService';

export default function SharedEventScreen({ shareId, onBack, onNavigateToPayPay }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [userName, setUserName] = useState('');
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadSharedEvent();
  }, [shareId]);

  const loadSharedEvent = async () => {
    try {
      setLoading(true);
      const sharedEvent = await EventShareService.getSharedEvent(shareId);
      
      if (!sharedEvent) {
        Alert.alert('エラー', 'イベントが見つかりませんでした');
        onBack();
        return;
      }
      
      setEvent(sharedEvent);
      setPayments(sharedEvent.payments || []);
    } catch (error) {
      console.error('共有イベント読み込みエラー:', error);
      Alert.alert('エラー', 'イベントの読み込みに失敗しました');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!userName.trim()) {
      Alert.alert('エラー', 'お名前を入力してください');
      return;
    }

    try {
      const updatedEvent = await EventShareService.joinSharedEvent(shareId, userName.trim());
      setEvent(updatedEvent);
      setIsJoined(true);
      Alert.alert('参加完了', `「${event.name}」に参加しました！`);
    } catch (error) {
      console.error('イベント参加エラー:', error);
      Alert.alert('エラー', error.message || 'イベントへの参加に失敗しました');
    }
  };

  const handleAddPayment = () => {
    if (!isJoined) {
      Alert.alert('エラー', 'イベントに参加してから支払いを追加できます');
      return;
    }
    setIsPaymentModalVisible(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      const newPayments = [...payments, paymentData];
      setPayments(newPayments);
      
      // 共有イベントを更新
      await EventShareService.updateSharedEvent(shareId, {
        payments: newPayments
      });
      
      const updatedEvent = await EventShareService.getSharedEvent(shareId);
      setEvent(updatedEvent);
      
      setIsPaymentModalVisible(false);
    } catch (error) {
      console.error('支払い追加エラー:', error);
      Alert.alert('エラー', '支払いの追加に失敗しました');
    }
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>イベントが見つかりませんでした</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>共有イベント</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <EventInfo event={event} />

        {!isJoined && (
          <View style={styles.joinSection}>
            <Text style={styles.joinTitle}>イベントに参加する</Text>
            <Text style={styles.joinDescription}>
              「{event.name}」に参加して、支払いを追加したり精算結果を確認できます。
            </Text>
            <TextInput
              style={styles.nameInput}
              placeholder="お名前を入力してください"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="words"
            />
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinEvent}>
              <Text style={styles.joinButtonText}>参加する</Text>
            </TouchableOpacity>
          </View>
        )}

        {isJoined && (
          <View style={styles.participantInfo}>
            <Text style={styles.participantText}>
              ✅ {userName} として参加中
            </Text>
          </View>
        )}

        <View style={styles.paymentsSection}>
          <View style={styles.paymentsSectionHeader}>
            <Text style={styles.paymentsSectionTitle}>支払い記録</Text>
            {isJoined && (
              <TouchableOpacity style={styles.addPaymentButton} onPress={handleAddPayment}>
                <Text style={styles.addPaymentButtonText}>追加</Text>
              </TouchableOpacity>
            )}
          </View>

          {payments.length === 0 ? (
            <View style={styles.emptyPayments}>
              <Text style={styles.emptyPaymentsText}>まだ支払い記録がありません</Text>
            </View>
          ) : (
            <View style={styles.paymentsList}>
              {payments.map((payment, index) => (
                <PaymentItem key={index} payment={payment} />
              ))}
            </View>
          )}
        </View>

        <SettlementResult 
          members={event.members || []} 
          payments={payments} 
          onNavigateToPayPay={onNavigateToPayPay}
        />
      </ScrollView>

      {isJoined && (
        <AddPaymentModal
          visible={isPaymentModalVisible}
          onClose={handleClosePaymentModal}
          onSave={handleSavePayment}
          members={event.members || []}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerBackButton: {
    paddingVertical: 8,
  },
  headerBackButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 60,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  joinSection: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  joinTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  joinDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  nameInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  participantInfo: {
    backgroundColor: '#d4edda',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  participantText: {
    fontSize: 16,
    color: '#155724',
    fontWeight: '500',
    textAlign: 'center',
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
    fontSize: 14,
    fontWeight: '500',
  },
  emptyPayments: {
    padding: 20,
    alignItems: 'center',
  },
  emptyPaymentsText: {
    fontSize: 16,
    color: '#666',
  },
  paymentsList: {
    gap: 10,
  },
});