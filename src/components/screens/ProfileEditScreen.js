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

export default function ProfileEditScreen({ user, onSave, onCancel }) {
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
      onSave(updatedUser);
    } catch (error) {
      Alert.alert('エラー', 'プロフィールの保存中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = 
    displayName.trim() !== user?.displayName ||
    profileImage !== user?.pictureUrl;

  const renderRightComponent = () => (
    <TouchableOpacity 
      style={[
        styles.saveButton,
        (!hasChanges || isLoading) && styles.disabledButton
      ]}
      onPress={handleSave}
      disabled={!hasChanges || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.textInverse} />
      ) : (
        <Text style={styles.saveButtonText}>保存</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CommonHeader
        title="プロフィール編集"
        onBack={onCancel}
        backText="キャンセル"
        rightComponent={renderRightComponent()}
      />
      
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
  saveButton: {
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
  
  saveButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
});