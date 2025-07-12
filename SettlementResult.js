import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SettlementResult({ members, payments }) {
  // 精算計算ロジックをインポート
  const calculateSettlement = (members, payments) => {
    if (!payments || payments.length === 0) {
      return {
        memberBalances: members.reduce((acc, member) => {
          acc[member] = { paid: 0, shouldPay: 0, balance: 0 };
          return acc;
        }, {}),
        settlements: [],
        totalAmount: 0,
        perPersonAmount: 0,
      };
    }

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const perPersonAmount = Math.round(totalAmount / members.length);

    const memberPayments = members.reduce((acc, member) => {
      acc[member] = 0;
      return acc;
    }, {});

    payments.forEach(payment => {
      if (memberPayments.hasOwnProperty(payment.payer)) {
        memberPayments[payment.payer] += payment.amount;
      }
    });

    const memberBalances = {};
    members.forEach(member => {
      const paid = memberPayments[member];
      const shouldPay = perPersonAmount;
      const balance = paid - shouldPay;
      
      memberBalances[member] = {
        paid: paid,
        shouldPay: shouldPay,
        balance: balance,
      };
    });

    const settlements = generateSettlementPlan(memberBalances);

    return {
      memberBalances,
      settlements,
      totalAmount,
      perPersonAmount,
    };
  };

  const generateSettlementPlan = (memberBalances) => {
    const creditors = [];
    const debtors = [];

    Object.entries(memberBalances).forEach(([member, balance]) => {
      if (balance.balance > 0) {
        creditors.push({ name: member, amount: balance.balance });
      } else if (balance.balance < 0) {
        debtors.push({ name: member, amount: Math.abs(balance.balance) });
      }
    });

    const settlements = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      const settlementAmount = Math.min(creditor.amount, debtor.amount);

      if (settlementAmount > 0) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: settlementAmount,
        });

        creditor.amount -= settlementAmount;
        debtor.amount -= settlementAmount;
      }

      if (creditor.amount === 0) {
        creditorIndex++;
      }
      if (debtor.amount === 0) {
        debtorIndex++;
      }
    }

    return settlements;
  };

  const settlement = calculateSettlement(members, payments);

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
      <Text style={styles.sectionTitle}>精算結果</Text>
      
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

      {settlement.settlements.length > 0 && (
        <View style={styles.settlementContainer}>
          <Text style={styles.subTitle}>精算方法</Text>
          {settlement.settlements.map((settlement, index) => (
            <View key={index} style={styles.settlementItem}>
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
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
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
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
  },
  settlementItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
});