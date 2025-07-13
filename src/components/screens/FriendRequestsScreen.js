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
import { Colors } from '../../styles/colors';
import { CommonStyles } from '../../styles/common';

export default function FriendRequestsScreen({ user, onBack, onRequestHandled }) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const requestsList = await FriendService.getFriendRequests(user.userId);
      setRequests(requestsList);
    } catch (error) {
      Alert.alert('エラー', 'フレンド申請の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId, fromUserData) => {
    try {
      const result = await FriendService.respondToFriendRequest(requestId, 'accepted', user);
      
      if (result.success) {
        Alert.alert(
          '友達追加完了',
          `${fromUserData.displayName}を友達に追加しました`,
          [
            {
              text: 'OK',
              onPress: () => {
                loadRequests();
                if (onRequestHandled) onRequestHandled();
              }
            }
          ]
        );
      } else {
        Alert.alert('エラー', result.error);
      }
    } catch (error) {
      Alert.alert('エラー', 'フレンド申請の承認に失敗しました');
    }
  };

  const handleDeclineRequest = async (requestId, fromUserData) => {
    Alert.alert(
      'フレンド申請を拒否',
      `${fromUserData.displayName}からの友達申請を拒否しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '拒否',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await FriendService.respondToFriendRequest(requestId, 'declined', user);
              
              if (result.success) {
                loadRequests();
                if (onRequestHandled) onRequestHandled();
              } else {
                Alert.alert('エラー', result.error);
              }
            } catch (error) {
              Alert.alert('エラー', 'フレンド申請の拒否に失敗しました');
            }
          }
        }
      ]
    );
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <ProfileAvatar
        user={item.fromUserData}
        size="md"
        style={styles.requestAvatar}
      />
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{item.fromUserData.displayName}</Text>
        <Text style={styles.requestId}>ID: {item.fromUserData.userId}</Text>
        <Text style={styles.requestDate}>
          {new Date(item.createdAt).toLocaleDateString('ja-JP')}に申請
        </Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item.id, item.fromUserData)}
        >
          <Text style={styles.acceptButtonText}>承認</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDeclineRequest(item.id, item.fromUserData)}
        >
          <Text style={styles.declineButtonText}>拒否</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📬</Text>
      <Text style={styles.emptyStateTitle}>フレンド申請はありません</Text>
      <Text style={styles.emptyStateText}>
        新しい友達申請が届くとここに表示されます
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CommonHeader
        title="フレンド申請"
        onBack={onBack}
      />

      <View style={styles.container}>
        {requests.length > 0 && (
          <View style={styles.requestsCount}>
            <Text style={styles.requestsCountText}>
              {requests.length}件の申請
            </Text>
          </View>
        )}

        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          style={styles.requestsList}
          ListEmptyComponent={renderEmptyState}
          refreshing={isLoading}
          onRefresh={loadRequests}
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
  
  requestsCount: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  requestsCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  
  requestsList: {
    flex: 1,
  },
  
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  requestAvatar: {
    marginRight: 16,
  },
  
  requestInfo: {
    flex: 1,
  },
  
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  
  requestId: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  
  requestDate: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  
  requestActions: {
    flexDirection: 'column',
    gap: 8,
  },
  
  acceptButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  
  acceptButtonText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  
  declineButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  
  declineButtonText: {
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
  },
});