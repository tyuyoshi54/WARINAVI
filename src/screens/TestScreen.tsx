import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ワリナビ</Text>
      <Text style={styles.subtitle}>割り勘精算アプリ</Text>
      <Text style={styles.status}>✅ 初期設定完了</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  status: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
  },
});