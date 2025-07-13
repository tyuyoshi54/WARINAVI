import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './HomeScreen';
import TalkScreen from './TalkScreen';
import SettingsScreen from './SettingsScreen';
import TabBar from '../common/TabBar';

export default function MainTabScreen({ user, onNavigateToMyPage }) {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            user={user} 
            onNavigateToMyPage={onNavigateToMyPage}
            hideTabBar={true}
          />
        );
      case 'talk':
        return <TalkScreen user={user} />;
      case 'settings':
        return <SettingsScreen onNavigateBack={() => setActiveTab('home')} />;
      default:
        return (
          <HomeScreen 
            user={user} 
            onNavigateToMyPage={onNavigateToMyPage}
            hideTabBar={true}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {renderCurrentScreen()}
      </View>
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screenContainer: {
    flex: 1,
  },
});