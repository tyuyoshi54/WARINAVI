import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import ProfileAvatar from '../ui/ProfileAvatar';
import { Colors } from '../../styles/colors';
import { TextStyles } from '../../styles/typography';
import { CommonStyles, Dimensions } from '../../styles/common';

export default function ProfileForm({
  user,
  displayName,
  profileImage,
  onDisplayNameChange,
  onImagePress,
  editable = true,
}) {
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* プロフィール画像セクション */}
        <View style={styles.imageSection}>
          <ProfileAvatar
            user={{ ...user, pictureUrl: profileImage }}
            size="xl"
            onPress={editable ? onImagePress : undefined}
          />
          {editable && (
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={onImagePress}
            >
              <Text style={styles.changeImageText}>画像を変更</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* フォームセクション */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>表示名</Text>
            <TextInput
              style={[
                styles.textInput,
                !editable && styles.textInputDisabled
              ]}
              value={displayName}
              onChangeText={onDisplayNameChange}
              placeholder="表示名を入力してください"
              placeholderTextColor={Colors.textTertiary}
              maxLength={50}
              editable={editable}
              returnKeyType="done"
            />
            <Text style={styles.inputHelper}>
              この名前が他のユーザーに表示されます
            </Text>
          </View>

          {/* 基本情報セクション */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>基本情報</Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ユーザーID</Text>
              <Text style={styles.infoValue}>{user?.userId || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>登録方法</Text>
              <Text style={styles.infoValue}>LINE</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: Dimensions.spacing.xl,
  },
  
  // 画像セクション
  imageSection: {
    alignItems: 'center',
    paddingVertical: Dimensions.spacing.xl,
    backgroundColor: Colors.backgroundSecondary,
  },
  
  changeImageButton: {
    marginTop: Dimensions.spacing.md,
    paddingVertical: Dimensions.spacing.sm,
    paddingHorizontal: Dimensions.spacing.md,
  },
  
  changeImageText: {
    ...TextStyles.bodyMedium,
    color: Colors.primary,
    fontWeight: '500',
  },
  
  // フォームセクション
  formSection: {
    flex: 1,
    padding: Dimensions.spacing.md,
  },
  
  inputGroup: {
    marginBottom: Dimensions.spacing.lg,
  },
  
  inputLabel: {
    ...TextStyles.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Dimensions.spacing.sm,
  },
  
  textInput: {
    ...CommonStyles.input,
    fontSize: 16,
    minHeight: 50,
  },
  
  textInputDisabled: {
    backgroundColor: Colors.backgroundTertiary,
    color: Colors.textSecondary,
  },
  
  inputHelper: {
    ...TextStyles.caption,
    color: Colors.textTertiary,
    marginTop: Dimensions.spacing.xs,
  },
  
  // 基本情報セクション
  infoSection: {
    marginTop: Dimensions.spacing.lg,
  },
  
  sectionTitle: {
    ...TextStyles.headerSmall,
    color: Colors.textPrimary,
    marginBottom: Dimensions.spacing.md,
  },
  
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Dimensions.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  
  infoLabel: {
    ...TextStyles.bodyMedium,
    color: Colors.textSecondary,
  },
  
  infoValue: {
    ...TextStyles.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});