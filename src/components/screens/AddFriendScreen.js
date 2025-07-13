import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  Modal
} from 'react-native';
import CommonHeader from '../ui/CommonHeader';
import ProfileAvatar from '../ui/ProfileAvatar';
import QRCodeDisplay from '../ui/QRCodeDisplay';
// import QRScanner from '../ui/QRScanner'; // Expo Goでは利用不可
import FriendService from '../../services/FriendService';
import { Colors } from '../../styles/colors';
import { CommonStyles } from '../../styles/common';

export default function AddFriendScreen({ user, onBack, onFriendAdded }) {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showMyQR, setShowMyQR] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // フレンドIDはユーザIDをそのまま使用
  const getFriendId = () => {
    return user.userId;
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('エラー', 'ユーザIDを入力してください');
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const result = await FriendService.searchUserByUserId(searchText.trim());
      
      if (result.success) {
        if (result.user.userId === user.userId) {
          Alert.alert('エラー', '自分自身を友達に追加することはできません');
        } else {
          setSearchResult(result.user);
        }
      } else {
        Alert.alert('見つかりません', result.error);
      }
    } catch (error) {
      Alert.alert('エラー', 'ユーザーの検索に失敗しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async () => {
    if (!searchResult) return;

    try {
      const result = await FriendService.addFriend(user.userId, searchResult);
      
      if (result.success) {
        Alert.alert(
          '友達追加完了',
          `${searchResult.displayName}を友達に追加しました`,
          [
            {
              text: 'OK',
              onPress: () => {
                setSearchResult(null);
                setSearchText('');
                if (onFriendAdded) onFriendAdded();
              }
            }
          ]
        );
      } else {
        Alert.alert('エラー', result.error);
      }
    } catch (error) {
      Alert.alert('エラー', '友達の追加に失敗しました');
    }
  };

  const handleShowMyQR = () => {
    setShowMyQR(true);
  };

  const handleQRScan = () => {
    Alert.alert(
      'QRスキャン',
      'QRスキャン機能は開発ビルドが必要です。\n現在はExpo Goでテスト中のため、QR生成機能のみ利用可能です。'
    );
  };

  const handleQRScanSuccess = async (qrData) => {
    setShowQRScanner(false);
    
    // 自分自身のQRコードをスキャンした場合
    if (qrData.userId === user.userId) {
      Alert.alert('エラー', '自分自身を友達に追加することはできません');
      return;
    }

    try {
      const result = await FriendService.addFriend(user.userId, {
        userId: qrData.userId,
        displayName: qrData.displayName,
        pictureUrl: qrData.pictureUrl
      });
      
      if (result.success) {
        Alert.alert(
          '友達追加完了',
          `${qrData.displayName}を友達に追加しました`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (onFriendAdded) onFriendAdded();
              }
            }
          ]
        );
      } else {
        Alert.alert('エラー', result.error);
      }
    } catch (error) {
      Alert.alert('エラー', '友達の追加に失敗しました');
    }
  };

  const renderSearchResult = () => {
    if (!searchResult) return null;

    return (
      <View style={styles.searchResultContainer}>
        <Text style={styles.searchResultTitle}>検索結果</Text>
        <View style={styles.userCard}>
          <ProfileAvatar
            user={searchResult}
            size="lg"
            style={styles.resultAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{searchResult.displayName}</Text>
            <Text style={styles.userId}>ID: {searchResult.userId}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddFriend}
          >
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMyQR = () => {
    if (!showMyQR) return null;

    return (
      <View style={styles.qrContainer}>
        <Text style={styles.qrTitle}>マイQRコード</Text>
        <QRCodeDisplay user={user} size={200} showUserInfo={false} />
        <TouchableOpacity
          style={styles.qrCloseButton}
          onPress={() => setShowMyQR(false)}
        >
          <Text style={styles.qrCloseButtonText}>閉じる</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CommonHeader
        title="友達を追加"
        onBack={onBack}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ID検索セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔍</Text>
            <Text style={styles.sectionTitle}>ユーザIDで検索</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="U123456789 のような形式"
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={isSearching}
            >
              <Text style={styles.searchButtonText}>
                {isSearching ? '検索中...' : '検索'}
              </Text>
            </TouchableOpacity>
          </View>

          {renderSearchResult()}
        </View>

        {/* QRコードセクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📱</Text>
            <Text style={styles.sectionTitle}>QRコード</Text>
          </View>

          <View style={styles.qrButtons}>
            <TouchableOpacity
              style={styles.qrActionButton}
              onPress={handleShowMyQR}
            >
              <Text style={styles.qrActionIcon}>📤</Text>
              <Text style={styles.qrActionText}>マイQRコード</Text>
              <Text style={styles.qrActionSubtext}>自分のQRを表示</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.qrActionButton}
              onPress={handleQRScan}
            >
              <Text style={styles.qrActionIcon}>📷</Text>
              <Text style={styles.qrActionText}>QRスキャン</Text>
              <Text style={styles.qrActionSubtext}>相手のQRを読み取り</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* マイユーザID表示 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🆔</Text>
            <Text style={styles.sectionTitle}>あなたのユーザID</Text>
          </View>
          
          <View style={styles.myIdContainer}>
            <Text style={styles.myIdText}>{getFriendId()}</Text>
            <Text style={styles.myIdDescription}>
              このIDを相手に教えて友達追加してもらえます
            </Text>
          </View>
        </View>

        {renderMyQR()}
      </ScrollView>

      {/* QRスキャナーモーダル - 開発ビルドでのみ有効 */}
      {false && showQRScanner && (
        <Modal
          visible={showQRScanner}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          {/* QRScanner - Expo Goでは利用不可 */}
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  
  section: {
    backgroundColor: Colors.background,
    marginBottom: 16,
    paddingVertical: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  // ID検索
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.backgroundSecondary,
  },
  
  searchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  
  searchButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  
  searchButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // 検索結果
  searchResultContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  resultAvatar: {
    marginRight: 16,
  },
  
  userInfo: {
    flex: 1,
  },
  
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  
  userId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  
  addButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // QRコード
  qrButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  
  qrActionButton: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  qrActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  
  qrActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  
  qrActionSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // マイID
  myIdContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  myIdText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  
  myIdDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // QR表示
  qrContainer: {
    backgroundColor: Colors.background,
    marginTop: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  
  qrPlaceholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  
  qrPlaceholderSubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  
  qrInstruction: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  
  qrCloseButton: {
    backgroundColor: Colors.textSecondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  
  qrCloseButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});