import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  SafeAreaView
} from 'react-native';
import CommonHeader from '../ui/CommonHeader';

export default function SettingsScreen({ onNavigateBack, onNavigateToProfileEdit }) {
  const [notificationSettings, setNotificationSettings] = useState({
    talkNotifications: true
  });

  const [language, setLanguage] = useState('ja');

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLanguageChange = () => {
    Alert.alert(
      '言語設定',
      '言語を選択してください',
      [
        { text: '日本語', onPress: () => setLanguage('ja') },
        { text: 'English', onPress: () => setLanguage('en') },
        { text: 'キャンセル', style: 'cancel' }
      ]
    );
  };

  const handleProfileEdit = () => {
    if (onNavigateToProfileEdit) {
      onNavigateToProfileEdit();
    } else {
      Alert.alert('プロフィール編集', 'プロフィール編集画面を開きます');
    }
  };

  const handlePasswordChange = () => {
    Alert.alert('パスワード変更', 'パスワード変更画面を開きます');
  };

  const handleAccountDelete = () => {
    Alert.alert(
      'アカウント削除',
      '本当にアカウントを削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除', style: 'destructive', onPress: () => console.log('アカウント削除') }
      ]
    );
  };

  const handleTermsOfService = () => {
    Alert.alert('利用規約', '利用規約を表示します');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('プライバシーポリシー', 'プライバシーポリシーを表示します');
  };

  const handleContact = () => {
    Alert.alert('お問い合わせ', 'お問い合わせフォームを開きます');
  };

  const handleAppVersion = () => {
    Alert.alert('アプリ情報', 'ワリナビ v1.0.0');
  };

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderSettingsItem = (title, onPress, rightComponent = null, isDestructive = false) => (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={[styles.itemText, isDestructive && styles.destructiveText]}>
        {title}
      </Text>
      {rightComponent && (
        <View style={styles.rightComponent}>
          {rightComponent}
        </View>
      )}
      {!rightComponent && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title="設定"
        onBack={onNavigateBack}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSectionHeader('通知設定')}
        {renderSettingsItem(
          'トークの通知',
          () => handleNotificationToggle('talkNotifications'),
          <Switch
            value={notificationSettings.talkNotifications}
            onValueChange={() => handleNotificationToggle('talkNotifications')}
            trackColor={{ false: '#e1e8ed', true: '#3498db' }}
            thumbColor={notificationSettings.talkNotifications ? '#ffffff' : '#ffffff'}
          />
        )}

        {renderSectionHeader('アカウント設定')}
        {renderSettingsItem('プロフィール編集', handleProfileEdit)}
        {renderSettingsItem('パスワード変更', handlePasswordChange)}
        {renderSettingsItem('アカウント削除', handleAccountDelete, null, true)}

        {renderSectionHeader('言語設定')}
        {renderSettingsItem(
          '言語',
          handleLanguageChange,
          <Text style={styles.languageText}>
            {language === 'ja' ? '日本語' : 'English'}
          </Text>
        )}

        {renderSectionHeader('情報・サポート')}
        {renderSettingsItem('利用規約', handleTermsOfService)}
        {renderSettingsItem('プライバシーポリシー', handlePrivacyPolicy)}
        {renderSettingsItem('お問い合わせ', handleContact)}
        {renderSettingsItem('アプリ情報', handleAppVersion)}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  itemText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  destructiveText: {
    color: '#e74c3c',
  },
  rightComponent: {
    marginLeft: 12,
  },
  arrow: {
    fontSize: 20,
    color: '#bdc3c7',
    marginLeft: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  bottomPadding: {
    height: 40,
  },
});