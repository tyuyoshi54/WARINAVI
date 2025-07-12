import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoadingScreen from './src/components/screens/LoadingScreen';
import LoginScreen from './src/components/screens/LoginScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import AuthService from './src/services/AuthService';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // デバッグ用：認証データをクリア（開発時のみ）
      await AuthService.clearAuthData();
      
      const loggedIn = await AuthService.isLoggedIn();
      
      if (loggedIn) {
        const userData = await AuthService.getUserData();
        setUser(userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('認証状態確認エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <HomeScreen user={user} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});