import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import AuthService from '../../services/AuthService';

export default function LoginScreen({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false);

  useEffect(() => {
    checkAppleLoginAvailability();
  }, []);

  const checkAppleLoginAvailability = async () => {
    if (Platform.OS === 'ios') {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setIsAppleLoginAvailable(isAvailable);
    }
  };

  const handleLineLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await AuthService.loginWithLine();
      
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        Alert.alert('ログインエラー', result.error || 'ログインに失敗しました');
      }
    } catch (error) {
      Alert.alert('エラー', 'ログイン処理中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await AuthService.loginWithApple();
      
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        Alert.alert('ログインエラー', result.error || 'ログインに失敗しました');
      }
    } catch (error) {
      Alert.alert('エラー', 'ログイン処理中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.appTitle}>ワリナビ</Text>
        <Text style={styles.subtitle}>割り勘を簡単に</Text>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.welcomeText}>
          アカウント登録して{'\n'}
          ワリナビを始めよう
        </Text>

        {isAppleLoginAvailable && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={styles.appleButton}
            onPress={handleAppleLogin}
          />
        )}

        <TouchableOpacity
          style={[styles.lineButton, isLoading && styles.disabledButton]}
          onPress={handleLineLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <View style={styles.lineIcon}>
                <Text style={styles.lineIconText}>LINE</Text>
              </View>
              <Text style={styles.lineButtonText}>LINEでログイン</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          登録することで利用規約とプライバシーポリシーに同意したものとみなします
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  loginContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '600',
    lineHeight: 28,
  },
  appleButton: {
    width: '100%',
    height: 50,
    marginBottom: 16,
  },
  lineButton: {
    backgroundColor: '#00C300',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  lineIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 12,
  },
  lineIconText: {
    color: '#00C300',
    fontWeight: 'bold',
    fontSize: 12,
  },
  lineButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});