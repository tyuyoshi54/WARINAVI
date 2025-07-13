import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function PaymentItem({ payment, onEdit }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{payment.title}</Text>
        <View style={styles.rightSection}>
          <Text style={styles.amount}>¥{payment.amount.toLocaleString()}</Text>
          {onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(payment)}>
              <Text style={styles.editButtonText}>編集</Text>
            </TouchableOpacity>
          )}
        </View>
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});