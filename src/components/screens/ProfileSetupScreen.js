import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import AuthService from '../../services/AuthService';
import { useImagePicker } from '../../hooks/useImagePicker';
import ProfileForm from '../forms/ProfileForm';
import CommonHeader from '../ui/CommonHeader';
import { Colors } from '../../styles/colors';
import { CommonStyles } from '../../styles/common';

export default function ProfileSetupScreen({ user, onProfileComplete }) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profileImage, setProfileImage] = useState(user?.pictureUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showImagePicker } = useImagePicker();

  const handleImageSelect = (imageUri) => {
    setProfileImage(imageUri);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('エラー', '表示名を入力してください');
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = {
        ...user,
        displayName: displayName.trim(),
        pictureUrl: profileImage,
      };

      await AuthService.saveUserData(updatedUser);
      await AuthService.markProfileAsCompleted();
      onProfileComplete(updatedUser);
    } catch (error) {
      Alert.alert('エラー', 'プロフィールの設定中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const canSave = displayName.trim().length > 0;

  const renderRightComponent = () => (
    <TouchableOpacity 
      style={[
        styles.completeButton,
        (!canSave || isLoading) && styles.disabledButton
      ]}
      onPress={handleSave}
      disabled={!canSave || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.textInverse} />
      ) : (
        <Text style={styles.completeButtonText}>完了</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CommonHeader
        title="プロフィール設定"
        rightComponent={renderRightComponent()}
      />
      
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>ワリナビへようこそ！</Text>
        <Text style={styles.welcomeDescription}>
          プロフィールを設定して、より便利にアプリを使いましょう
        </Text>
      </View>
      
      <ProfileForm
        user={user}
        displayName={displayName}
        profileImage={profileImage}
        onDisplayNameChange={setDisplayName}
        onImagePress={() => showImagePicker(handleImageSelect)}
        editable={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  
  welcomeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  completeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  
  disabledButton: {
    backgroundColor: Colors.disabled,
    opacity: 0.6,
  },
  
  completeButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
});