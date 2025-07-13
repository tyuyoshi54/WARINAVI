import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../styles/colors';

export default function QRCodeDisplay({ user, size = 200, showUserInfo = true }) {
  // QRコード用のデータを生成
  const qrData = JSON.stringify({
    type: 'friend_add',
    userId: user.userId,
    displayName: user.displayName,
    pictureUrl: user.pictureUrl,
    timestamp: Date.now()
  });

  return (
    <View style={styles.container}>
      {showUserInfo && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.displayName}</Text>
          <Text style={styles.userId}>ID: {user.userId}</Text>
        </View>
      )}
      
      <View style={[styles.qrContainer, { width: size + 40, height: size + 40 }]}>
        <QRCode
          value={qrData}
          size={size}
          color={Colors.textPrimary}
          backgroundColor={Colors.background}
          logo={null}
        />
      </View>
      
      {showUserInfo && (
        <Text style={styles.instruction}>
          このQRコードを相手にスキャンしてもらってください
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  
  userId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  
  qrContainer: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  
  instruction: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});