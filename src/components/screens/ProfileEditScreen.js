import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AuthService from '../../services/AuthService';

export default function ProfileEditScreen({ user, onSave, onCancel }) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profileImage, setProfileImage] = useState(user?.pictureUrl || null);
  const [isLoading, setIsLoading] = useState(false);

  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('権限が必要です', '写真ライブラリへのアクセス権限が必要です');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', '画像の選択中にエラーが発生しました');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('権限が必要です', 'カメラへのアクセス権限が必要です');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', '写真撮影中にエラーが発生しました');
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'プロフィール画像を変更',
      '画像を選択する方法を選んでください',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '写真ライブラリ', onPress: selectImage },
        { text: 'カメラで撮影', onPress: takePhoto },
      ]
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>プロフィール編集</Text>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!hasChanges || isLoading) && styles.disabledButton
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileSection}>
            <TouchableOpacity 
              style={styles.imageContainer} 
              onPress={showImagePicker}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text style={styles.defaultProfileText}>
                    {displayName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.imageHint}>タップして画像を変更</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>表示名</Text>
              <TextInput
                style={styles.textInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="表示名を入力してください"
                maxLength={20}
                autoCapitalize="none"
              />
              <Text style={styles.inputHelper}>
                {displayName.length}/20文字
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ログイン方法</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>
                  {user?.provider === 'apple' ? 'Apple Sign-In' : 'LINE'}
                </Text>
              </View>
            </View>

            {user?.email && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>メールアドレス</Text>
                <View style={styles.readOnlyInput}>
                  <Text style={styles.readOnlyText}>{user.email}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteText}>
              ※ ログイン方法とメールアドレスは変更できません
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3498db',
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2980b9',
  },
  defaultProfileText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  imageOverlayText: {
    fontSize: 16,
  },
  imageHint: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  inputGroup: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    marginBottom: 4,
  },
  inputHelper: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'right',
  },
  readOnlyInput: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d5dbdb',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  noteSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  noteText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 16,
  },
});