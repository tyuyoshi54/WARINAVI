import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { TextStyles } from '../../styles/typography';
import { CommonStyles } from '../../styles/common';

export default function CommonHeader({
  title,
  onBack,
  backText = '‹ 戻る',
  rightComponent,
  style,
  backgroundColor = Colors.background,
  showBorder = true,
}) {
  return (
    <View style={[
      styles.header,
      { backgroundColor },
      showBorder && styles.headerBorder,
      style
    ]}>
      {/* 左側：戻るボタンまたはスペーサー */}
      <View style={styles.leftSection}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>{backText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.leftSpacer} />
        )}
      </View>

      {/* 中央：タイトル */}
      <View style={styles.centerSection}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* 右側：カスタムコンポーネントまたはスペーサー */}
      <View style={styles.rightSection}>
        {rightComponent || <View style={styles.rightSpacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  
  backText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '500',
  },
  
  headerTitle: {
    ...TextStyles.headerMedium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  
  leftSpacer: {
    width: 68, // backButtonと同じ幅
  },
  
  rightSpacer: {
    width: 68, // 左右のバランスを取るため
  },
});