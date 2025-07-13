import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Colors } from '../../styles/colors';

const { width: screenWidth } = Dimensions.get('window');
const scannerSize = screenWidth * 0.8;

export default function QRScanner({ onScanSuccess, onClose }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'friend_add' && qrData.userId) {
        onScanSuccess(qrData);
      } else {
        Alert.alert(
          'エラー',
          '無効なQRコードです。友達追加用のQRコードをスキャンしてください。',
          [
            {
              text: 'もう一度スキャン',
              onPress: () => setScanned(false)
            },
            {
              text: '閉じる',
              onPress: onClose
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'エラー',
        'QRコードの読み取りに失敗しました。',
        [
          {
            text: 'もう一度スキャン',
            onPress: () => setScanned(false)
          },
          {
            text: '閉じる',
            onPress: onClose
          }
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>カメラの権限を確認中...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          QRコードをスキャンするにはカメラの権限が必要です
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={onClose}
        >
          <Text style={styles.permissionButtonText}>閉じる</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QRコードをスキャン</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
          type={BarCodeScanner.Constants.Type.back}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          友達のQRコードを画面中央の枠内に合わせてください
        </Text>
        
        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanButtonText}>もう一度スキャン</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  scanArea: {
    width: scannerSize,
    height: scannerSize,
    position: 'relative',
  },
  
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.primary,
    borderWidth: 3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: -3,
    left: -3,
  },
  
  topRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    top: -3,
    right: -3,
    left: 'auto',
  },
  
  bottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    bottom: -3,
    left: -3,
    top: 'auto',
  },
  
  bottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: -3,
    right: -3,
    top: 'auto',
    left: 'auto',
  },
  
  instructions: {
    padding: 20,
    alignItems: 'center',
  },
  
  instructionText: {
    fontSize: 16,
    color: Colors.textInverse,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  
  rescanButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  
  rescanButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: Colors.background,
  },
  
  permissionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  
  permissionButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});