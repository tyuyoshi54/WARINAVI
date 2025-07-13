import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView
} from 'react-native';
import CommonHeader from '../ui/CommonHeader';
import ProfileAvatar from '../ui/ProfileAvatar';
import FriendService from '../../services/FriendService';
import AddFriendScreen from './AddFriendScreen';
import { Colors } from '../../styles/colors';
import { CommonStyles } from '../../styles/common';

export default function FriendsScreen({ user, onBack }) {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      const friendsList = await FriendService.getFriends(user.userId);
      setFriends(friendsList);
    } catch (error) {
      Alert.alert('エラー', '友達リストの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = (friendUserId, friendName) => {
    Alert.alert(
      '友達を削除',
      `${friendName}を友達から削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: async () => {
            const result = await FriendService.removeFriend(user.userId, friendUserId);
            if (result.success) {
              loadFriends();
            } else {
              Alert.alert('エラー', '友達の削除に失敗しました');
            }
          }
        }
      ]
    );
  };

  const handleAddFriendComplete = () => {
    setShowAddFriend(false);
    loadFriends();
  };

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <ProfileAvatar
        user={item}
        size="md"
        style={styles.friendAvatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.displayName}</Text>
        <Text style={styles.friendId}>ID: {item.userId}</Text>
        <Text style={styles.addedDate}>
          {new Date(item.addedAt).toLocaleDateString('ja-JP')}に追加
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFriend(item.userId, item.displayName)}
      >
        <Text style={styles.removeButtonText}>削除</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>👥</Text>
      <Text style={styles.emptyStateTitle}>友達がいません</Text>
      <Text style={styles.emptyStateText}>
        QRコードやIDで友達を追加しましょう
      </Text>
      <TouchableOpacity 
        style={styles.addFirstFriendButton}
        onPress={() => setShowAddFriend(true)}
      >
        <Text style={styles.addFirstFriendButtonText}>友達を追加</Text>
      </TouchableOpacity>
    </View>
  );

  if (showAddFriend) {
    return (
      <AddFriendScreen
        user={user}
        onBack={() => setShowAddFriend(false)}
        onFriendAdded={handleAddFriendComplete}
      />
    );
  }

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CommonHeader
        title="友達"
        onBack={onBack}
        rightComponent={
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddFriend(true)}
          >
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {friends.length > 0 && (
          <View style={styles.friendsCount}>
            <Text style={styles.friendsCountText}>
              友達 {friends.length}人
            </Text>
          </View>
        )}

        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.userId}
          style={styles.friendsList}
          ListEmptyComponent={renderEmptyState}
          refreshing={isLoading}
          onRefresh={loadFriends}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  addButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  friendsCount: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  friendsCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  
  friendsList: {
    flex: 1,
  },
  
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  friendAvatar: {
    marginRight: 16,
  },
  
  friendInfo: {
    flex: 1,
  },
  
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  
  friendId: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  
  addedDate: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.error,
    borderRadius: 12,
  },
  
  removeButtonText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  
  addFirstFriendButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  
  addFirstFriendButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});