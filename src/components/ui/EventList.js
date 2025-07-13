import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { Colors } from '../../styles/colors';
import { TextStyles } from '../../styles/typography';
import { CommonStyles, Dimensions } from '../../styles/common';

export default function EventList({ 
  events, 
  onEventPress, 
  emptyMessage = 'まだイベントがありません',
  emptySubMessage = '「＋」ボタンでイベントを追加しましょう',
  style 
}) {
  const renderEvent = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventItem} 
      onPress={() => onEventPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.eventContent}>
        <Text style={styles.eventName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.eventDate}>
          {item.createdAt}
        </Text>
        {item.members && item.members.length > 0 && (
          <Text style={styles.eventMembers} numberOfLines={1}>
            メンバー: {item.members.join(', ')}
          </Text>
        )}
      </View>
      <View style={styles.eventArrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
      <Text style={styles.emptySubText}>{emptySubMessage}</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {events.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  list: {
    flex: 1,
  },
  
  listContent: {
    paddingVertical: Dimensions.spacing.sm,
  },
  
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Dimensions.spacing.md,
    paddingVertical: Dimensions.spacing.md,
    marginHorizontal: Dimensions.spacing.md,
    marginVertical: Dimensions.spacing.xs,
    borderRadius: Dimensions.borderRadius.md,
    ...CommonStyles.shadowLight,
  },
  
  eventContent: {
    flex: 1,
  },
  
  eventName: {
    ...TextStyles.bodyLarge,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Dimensions.spacing.xs,
  },
  
  eventDate: {
    ...TextStyles.caption,
    color: Colors.textSecondary,
    marginBottom: Dimensions.spacing.xs,
  },
  
  eventMembers: {
    ...TextStyles.bodySmall,
    color: Colors.textTertiary,
  },
  
  eventArrow: {
    marginLeft: Dimensions.spacing.sm,
  },
  
  arrowText: {
    fontSize: 20,
    color: Colors.textTertiary,
  },
  
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
  
  // 空状態
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Dimensions.spacing.xl,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: Dimensions.spacing.lg,
  },
  
  emptyText: {
    ...TextStyles.headerSmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Dimensions.spacing.sm,
  },
  
  emptySubText: {
    ...TextStyles.bodyMedium,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});