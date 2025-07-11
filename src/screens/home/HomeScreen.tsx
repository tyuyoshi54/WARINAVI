import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../../components/common/Button';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  totalAmount: number;
  hasActiveSettlement: boolean;
  lastActivity: string;
}

// テスト用データ
const mockGroups: Group[] = [
  {
    id: '1',
    name: '旅行グループ',
    memberCount: 4,
    totalAmount: 48000,
    hasActiveSettlement: true,
    lastActivity: '2日前'
  },
  {
    id: '2',
    name: '飲み会',
    memberCount: 6,
    totalAmount: 12000,
    hasActiveSettlement: false,
    lastActivity: '1週間前'
  },
  {
    id: '3',
    name: '映画鑑賞',
    memberCount: 3,
    totalAmount: 3600,
    hasActiveSettlement: true,
    lastActivity: '3日前'
  }
];

export const HomeScreen = () => {
  const handleCreateGroup = () => {
    // TODO: グループ作成画面への遷移
    console.log('グループ作成');
  };

  const handleGroupPress = (groupId: string) => {
    // TODO: グループ詳細画面への遷移
    console.log('グループ詳細:', groupId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ワリナビ</Text>
        <Text style={styles.subtitle}>グループ一覧</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="新しいグループを作成"
          onPress={handleCreateGroup}
          variant="primary"
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {mockGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            onPress={() => handleGroupPress(group.id)}
          >
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{group.name}</Text>
              {group.hasActiveSettlement && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>精算中</Text>
                </View>
              )}
            </View>
            
            <View style={styles.groupInfo}>
              <Text style={styles.memberCount}>
                メンバー: {group.memberCount}人
              </Text>
              <Text style={styles.totalAmount}>
                合計: ¥{group.totalAmount.toLocaleString()}
              </Text>
            </View>
            
            <Text style={styles.lastActivity}>
              最終更新: {group.lastActivity}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {mockGroups.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>まだグループがありません</Text>
          <Text style={styles.emptySubtext}>
            新しいグループを作成して割り勘を始めましょう
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e6f3ff',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  lastActivity: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});