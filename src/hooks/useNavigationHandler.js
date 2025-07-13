import { useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const useNavigationHandler = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.65)).current;

  // サイドメニュー表示
  const showSideMenu = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // サイドメニュー非表示
  const hideSideMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -screenWidth * 0.65,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
    });
  };

  // 設定画面表示
  const showSettings = () => {
    setIsSettingsVisible(true);
  };

  // 設定画面非表示
  const hideSettings = () => {
    setIsSettingsVisible(false);
  };

  // 設定画面への遷移（タブ使用時は外部コールバック呼び出し）
  const navigateToSettings = (hideTabBar, onNavigateToSettings) => {
    if (hideTabBar && onNavigateToSettings) {
      // タブバー使用時は外部のコールバックを呼び出し
      onNavigateToSettings();
    } else if (!hideTabBar) {
      // 従来通りローカル状態で管理
      showSettings();
    }
  };

  return {
    // 状態
    isMenuVisible,
    isSettingsVisible,
    slideAnim,
    
    // アクション
    showSideMenu,
    hideSideMenu,
    showSettings,
    hideSettings,
    navigateToSettings,
  };
};