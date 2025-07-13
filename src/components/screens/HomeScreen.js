import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import AddEventModal from '../modals/AddEventModal';
import EventDetailScreen from './EventDetailScreen';
import SideMenu from '../common/SideMenu';
import SettingsScreen from './SettingsScreen';
import EventList from '../ui/EventList';
import ProfileAvatar from '../ui/ProfileAvatar';
import CommonHeader from '../ui/CommonHeader';
import { useEventManager } from '../ui/EventManager';
import { useNavigationHandler } from '../../hooks/useNavigationHandler';
import { Colors } from '../../styles/colors';
import { CommonStyles, Dimensions } from '../../styles/common';

export default function HomeScreen({ user, onNavigateToMyPage, hideTabBar = false, onNavigateToSettings }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // カスタムフック使用
  const {
    events,
    selectedEvent,
    addEvent,
    updateEvent,
    selectEvent,
    clearSelection
  } = useEventManager();
  
  const {
    isMenuVisible,
    isSettingsVisible,
    slideAnim,
    showSideMenu,
    hideSideMenu,
    hideSettings,
    navigateToSettings
  } = useNavigationHandler();

  // イベント関連ハンドラー
  const handleAddEvent = () => {
    setIsModalVisible(true);
  };

  const handleSaveEvent = (eventData) => {
    addEvent(eventData);
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // ナビゲーションハンドラー
  const handleSettingsPress = () => {
    navigateToSettings(hideTabBar, onNavigateToSettings);
  };

  // 画面条件分岐
  if (selectedEvent) {
    return (
      <EventDetailScreen
        event={selectedEvent}
        onBack={clearSelection}
        onUpdateEvent={updateEvent}
      />
    );
  }

  if (isSettingsVisible) {
    return (
      <SettingsScreen
        onNavigateBack={hideSettings}
      />
    );
  }

  // メインUI
  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <ProfileAvatar
          user={user}
          size="sm"
          onPress={showSideMenu}
          style={styles.profileAvatar}
        />
        <Text style={styles.headerTitle}>イベント一覧</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* イベント一覧 */}
      <EventList
        events={events}
        onEventPress={selectEvent}
        style={styles.eventList}
      />

      {/* 追加ボタン */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      {/* モーダル */}
      <AddEventModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
      />

      {/* サイドメニュー */}
      <SideMenu
        isVisible={isMenuVisible}
        onClose={hideSideMenu}
        user={user}
        slideAnim={slideAnim}
        onNavigateToMyPage={onNavigateToMyPage}
        onNavigateToSettings={handleSettingsPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  profileAvatar: {
    // プロフィールアイコンをタッチしやすくするためのパディング
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  
  headerSpacer: {
    width: 40, // ProfileAvatarと同じ幅でバランス調整
  },
  
  eventList: {
    flex: 1,
  },
  
  addButton: {
    position: 'absolute',
    bottom: Dimensions.spacing.xl,
    right: Dimensions.spacing.xl,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...CommonStyles.shadow,
  },
  
  addButtonText: {
    color: Colors.textInverse,
    fontSize: 30,
    fontWeight: 'bold',
  },
});