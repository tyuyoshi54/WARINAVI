import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { calculateSettlement } from '../../utils/settlementCalculator';
import { showPayPaySendInfo } from '../../utils/payPayUtils';

export default function SettlementResult({ members, payments, onNavigateToPayPay }) {
  const [showDetails, setShowDetails] = useState(false);
  const settlement = calculateSettlement(members, payments);

  const handlePayPayPress = (settlementItem) => {
    if (onNavigateToPayPay) {
      onNavigateToPayPay({
        fromUser: settlementItem.from,
        toUser: settlementItem.to,
        amount: settlementItem.amount,
      });
    }
  };

  const handlePayPayDirectPress = (settlementItem) => {
    showPayPaySendInfo({
      to: settlementItem.to,
      amount: settlementItem.amount
    });
  };

  if (settlement.totalAmount === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>精算結果</Text>
        <Text style={styles.emptyText}>支払い記録がありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {settlement.settlements.length > 0 && (
        <View style={styles.settlementContainer}>
          <Text style={styles.sectionTitle}>精算方法</Text>
          {settlement.settlements.map((settlement, index) => (
            <View key={index} style={styles.settlementItem}>
              <View style={styles.settlementTextContainer}>
                <Text style={styles.settlementText}>
                  <Text style={styles.fromName}>{settlement.from}</Text>
                  {' → '}
                  <Text style={styles.toName}>{settlement.to}</Text>
                  {': '}
                  <Text style={styles.settlementAmount}>
                    ¥{settlement.amount.toLocaleString()}
                  </Text>
                </Text>
              </View>
              {onNavigateToPayPay && (
                <View style={styles.payPayButtonContainer}>
                  <TouchableOpacity
                    style={styles.payPayDirectButton}
                    onPress={() => handlePayPayDirectPress(settlement)}
                  >
                    <Text style={styles.payPayButtonText}>PayPayを開く</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.showDetailsButton} 
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.showDetailsButtonText}>
              {showDetails ? '精算結果を非表示' : '精算結果を表示'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {showDetails && (
        <View style={styles.detailsContainer}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              総額: ¥{settlement.totalAmount.toLocaleString()}
            </Text>
            <Text style={styles.summaryText}>
              一人当たり: ¥{settlement.perPersonAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.subTitle}>メンバー別収支</Text>
            {members.map(member => {
              const balance = settlement.memberBalances[member];
              const balanceText = balance.balance > 0 
                ? `+¥${balance.balance.toLocaleString()}` 
                : balance.balance < 0 
                ? `-¥${Math.abs(balance.balance).toLocaleString()}`
                : '±¥0';
              const balanceColor = balance.balance > 0 ? '#4CAF50' : balance.balance < 0 ? '#F44336' : '#666';

              return (
                <View key={member} style={styles.memberBalance}>
                  <Text style={styles.memberName}>{member}</Text>
                  <View style={styles.memberBalanceDetails}>
                    <Text style={styles.memberBalanceText}>
                      支払い: ¥{balance.paid.toLocaleString()}
                    </Text>
                    <Text style={[styles.memberBalanceAmount, { color: balanceColor }]}>
                      {balanceText}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  balanceContainer: {
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  memberBalance: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  memberBalanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberBalanceText: {
    fontSize: 12,
    color: '#666',
  },
  memberBalanceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  settlementContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
  },
  detailsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  showDetailsButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 15,
    alignItems: 'center',
  },
  showDetailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settlementItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementTextContainer: {
    flex: 1,
  },
  settlementText: {
    fontSize: 14,
    color: '#333',
  },
  fromName: {
    fontWeight: 'bold',
    color: '#F44336',
  },
  toName: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  settlementAmount: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  payPayButtonContainer: {
    marginLeft: 8,
  },
  payPayButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  payPayDirectButton: {
    backgroundColor: '#00A0FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  payPayButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});