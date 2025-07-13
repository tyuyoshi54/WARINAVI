import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import EventService from '../../services/EventService';

export default function TalkListScreen({ onSelectTalk }) {
  const [talkRooms, setTalkRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipatingEvents();
  }, []);

  const loadParticipatingEvents = async () => {
    try {
      setLoading(true);
      const events = await EventService.getParticipatingEvents();
      
      const talkRoomData = events.map(event => {
        const participants = [];
        
        // ホストを追加
        if (event.hostUser) {
          participants.push(event.hostUser.displayName || 'ホスト');
        }
        
        // 参加者を追加
        if (event.participants) {
          event.participants.forEach(participant => {
            if (participant.displayName && !participants.includes(participant.displayName)) {
              participants.push(participant.displayName);
            }
          });
        }
        
        return {
          id: event.id || event.shareId,
          title: event.name,
          lastMessage: '',
          lastMessageTime: '',
          participants: participants,
          unreadCount: 0,
          eventType: 'event',
          eventIcon: event.icon || '💬',
          eventData: event
        };
      });
      
      setTalkRooms(talkRoomData);
    } catch (error) {
      console.error('参加イベント取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'party':
        return '🎉';
      case 'work':
        return '💼';
      case 'outdoor':
        return '🏕️';
      case 'event':
        return '💬';
      default:
        return '💬';
    }
  };

  const renderTalkRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.talkRoomItem}
      onPress={() => onSelectTalk(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.eventIcon}>{item.eventIcon || getEventIcon(item.eventType)}</Text>
      </View>
      
      <View style={styles.talkContent}>
        <View style={styles.headerRow}>
          <Text style={styles.talkTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.timeText}>{item.lastMessageTime}</Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.participantsText} numberOfLines={1}>
          参加者: {item.participants.slice(0, 3).join(', ')}
          {item.participants.length > 3 && ` 他${item.participants.length - 3}人`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>トーク</Text>
        <Text style={styles.roomCount}>{talkRooms.length}件のトーク</Text>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyText}>読み込み中...</Text>
        </View>
      ) : talkRooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyText}>まだトークがありません</Text>
          <Text style={styles.emptySubText}>イベントに参加するとトークが表示されます</Text>
        </View>
      ) : (
        <FlatList
          data={talkRooms}
          renderItem={renderTalkRoom}
          keyExtractor={(item) => item.id}
          style={styles.talkList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  roomCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  talkList: {
    flex: 1,
  },
  talkRoomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventIcon: {
    fontSize: 24,
  },
  talkContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  talkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#5a6c7d',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  participantsText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});