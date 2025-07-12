import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PaymentItem({ payment }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{payment.title}</Text>
        <Text style={styles.amount}>¥{payment.amount.toLocaleString()}</Text>
      </View>
      <Text style={styles.payer}>支払い者: {payment.payer}</Text>
      <Text style={styles.date}>{payment.createdAt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  payer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});