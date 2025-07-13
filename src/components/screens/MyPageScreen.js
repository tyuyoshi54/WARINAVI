import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView
} from 'react-native';
import ProfileEditScreen from './ProfileEditScreen';
import CommonHeader from '../ui/CommonHeader';

export default function MyPageScreen({ user, onBack, onUpdateUser }) {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handleEditComplete = (updatedUser) => {
    onUpdateUser(updatedUser);
    setIsEditMode(false);
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <ProfileEditScreen
        user={user}
        onSave={handleEditComplete}
        onCancel={handleEditCancel}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title="マイページ"
        onBack={onBack}
        backText="←"
        rightComponent={
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Text style={styles.editButtonText}>編集</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {user?.pictureUrl ? (
              <Image 
                source={{ uri: user.pictureUrl }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.defaultProfileText}>
                  {user?.displayName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user?.displayName || 'ユーザー'}</Text>
          {user?.email && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
          <View style={styles.providerBadge}>
            <Text style={styles.providerText}>
              {user?.provider === 'apple' ? 'Apple ID' : 'LINE'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>表示名</Text>
            <Text style={styles.infoValue}>{user?.displayName || '未設定'}</Text>
          </View>
          
          {user?.email && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>メールアドレス</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ログイン方法</Text>
            <Text style={styles.infoValue}>
              {user?.provider === 'apple' ? 'Apple Sign-In' : 'LINE'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>登録日</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString('ja-JP')}
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 32,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2980b9',
  },
  defaultProfileText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  providerBadge: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  providerText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});