import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default function TabBar({ activeTab, onTabPress }) {
  const tabs = [
    { key: 'home', label: 'ホーム', icon: '🏠' },
    { key: 'talk', label: 'トーク', icon: '💬' },
    { key: 'settings', label: '設定', icon: '⚙️' }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === tab.key && styles.activeTabItem
          ]}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.6}
        >
          <View style={styles.iconContainer}>
            <Text style={[
              styles.icon,
              activeTab === tab.key && styles.activeIcon
            ]}>
              {tab.icon}
            </Text>
          </View>
          <Text style={[
            styles.label,
            activeTab === tab.key && styles.activeLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTabItem: {
    backgroundColor: 'transparent',
  },
  iconContainer: {
    marginBottom: 4,
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#3498db',
    fontWeight: '600',
  },
});