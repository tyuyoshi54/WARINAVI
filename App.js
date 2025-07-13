import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoadingScreen from './src/components/screens/LoadingScreen';
import LoginScreen from './src/components/screens/LoginScreen';
import ProfileSetupScreen from './src/components/screens/ProfileSetupScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import MyPageScreen from './src/components/screens/MyPageScreen';
import MainTabScreen from './src/components/screens/MainTabScreen';
import PayPayLinkScreen from './src/components/screens/PayPayLinkScreen';
import AuthService from './src/services/AuthService';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [payPayParams, setPayPayParams] = useState(null);

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
        const profileCompleted = await AuthService.isProfileCompleted();
        
        setUser(userData);
        setIsLoggedIn(true);
        setIsProfileCompleted(profileCompleted);
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
    setIsProfileCompleted(false);
  };

  const handleProfileComplete = (userData) => {
    setUser(userData);
    setIsProfileCompleted(true);
  };

  const handleNavigateToMyPage = () => {
    setCurrentScreen('mypage');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleNavigateToPayPay = (params) => {
    setPayPayParams(params);
    setCurrentScreen('paypay');
  };

  const handleBackFromPayPay = () => {
    setCurrentScreen('home');
    setPayPayParams(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (!isProfileCompleted) {
    return <ProfileSetupScreen user={user} onProfileComplete={handleProfileComplete} />;
  }

  if (currentScreen === 'mypage') {
    return (
      <MyPageScreen 
        user={user} 
        onBack={handleBackToHome}
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  if (currentScreen === 'paypay') {
    return (
      <PayPayLinkScreen 
        route={{ params: payPayParams }}
        navigation={{
          setOptions: () => {},
          goBack: handleBackFromPayPay
        }}
      />
    );
  }

  return (
    <MainTabScreen 
      user={user} 
      onNavigateToMyPage={handleNavigateToMyPage}
      onNavigateToPayPay={handleNavigateToPayPay}
    />
  );
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