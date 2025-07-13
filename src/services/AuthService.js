import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

class AuthService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * 統一されたユーザーIDを生成
   * @param {string} provider - 認証プロバイダー ('apple' | 'line')
   * @param {string} originalId - プロバイダーから提供された元のID
   * @returns {string} 統一されたユーザーID
   */
  async generateUnifiedUserId(provider, originalId) {
    try {
      // プロバイダー固有のプレフィックス
      const prefix = provider === 'apple' ? 'WA' : 'WL';
      
      // 元のIDをハッシュ化して一意性を保証
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${provider}_${originalId}_${Date.now()}`,
        { encoding: Crypto.CryptoEncoding.HEX }
      );
      
      // 最初の12文字を使用してコンパクトなIDを生成
      const shortHash = hash.substring(0, 12).toLowerCase();
      
      return `${prefix}_${shortHash}`;
    } catch (error) {
      console.error('統一ユーザーID生成エラー:', error);
      // フォールバック: タイムスタンプベースのID
      const prefix = provider === 'apple' ? 'WA' : 'WL';
      const fallbackId = Date.now().toString(36);
      return `${prefix}_${fallbackId}`;
    }
  }

  /**
   * 既存ユーザーデータをマイグレーション
   */
  async migrateExistingUser() {
    try {
      const userData = await this.getUserData();
      if (!userData) return null;
      
      // 既に統一IDを持っている場合はスキップ
      if (userData.userId && (userData.userId.startsWith('WA_') || userData.userId.startsWith('WL_'))) {
        return userData;
      }
      
      console.log('既存ユーザーをマイグレーション中...');
      
      // 古いIDを保存
      const originalUserId = userData.userId;
      
      // 新しい統一IDを生成
      const unifiedUserId = await this.generateUnifiedUserId(userData.provider, originalUserId);
      
      // ユーザーデータを更新
      const migratedUser = {
        ...userData,
        userId: unifiedUserId,
        originalUserId: originalUserId, // 元のIDを保持（必要に応じて参照用）
        migratedAt: new Date().toISOString()
      };
      
      await this.saveUserData(migratedUser);
      console.log('ユーザーデータマイグレーション完了:', unifiedUserId);
      
      return migratedUser;
    } catch (error) {
      console.error('ユーザーマイグレーションエラー:', error);
      return null;
    }
  }

  async loginWithLine() {
    try {
      // 開発用の模擬LINEユーザーID
      const originalLineId = 'line_dev_user_' + Date.now();
      
      // 統一ユーザーIDを生成
      const unifiedUserId = await this.generateUnifiedUserId('line', originalLineId);
      
      const mockUser = {
        userId: unifiedUserId,
        displayName: 'テストユーザー',
        pictureUrl: null,
        statusMessage: '開発用アカウント',
        provider: 'line',
        originalUserId: originalLineId, // 元のIDを保持
        createdAt: new Date().toISOString()
      };
      
      await this.saveUserData(mockUser);
      return {
        success: true,
        user: mockUser
      };
    } catch (error) {
      console.error('LINEログインエラー:', error);
      return { success: false, error: error.message };
    }
  }

  async loginWithApple() {
    try {
      if (Platform.OS !== 'ios') {
        return { success: false, error: 'Apple Sign-InはiOSでのみ利用可能です' };
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        return { success: false, error: 'Apple Sign-Inが利用できません' };
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // 統一ユーザーIDを生成
      const unifiedUserId = await this.generateUnifiedUserId('apple', credential.user);
      
      const user = {
        userId: unifiedUserId,
        displayName: credential.fullName ? 
          `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim() || 'Apple User' 
          : 'Apple User',
        email: credential.email,
        pictureUrl: null,
        provider: 'apple',
        originalUserId: credential.user, // 元のApple IDを保持
        createdAt: new Date().toISOString()
      };

      await this.saveUserData(user);
      return {
        success: true,
        user: user
      };
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return { success: false, error: 'ログインがキャンセルされました' };
      }
      console.error('Appleログインエラー:', error);
      return { success: false, error: error.message };
    }
  }

  async saveUserData(userData) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      await AsyncStorage.setItem('is_logged_in', 'true');
    } catch (error) {
      console.error('ユーザーデータ保存エラー:', error);
      throw error;
    }
  }

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) return null;
      
      const parsedData = JSON.parse(userData);
      
      // 自動マイグレーション: 古いID形式の場合は新しい形式に変換
      if (parsedData && parsedData.userId && 
          !parsedData.userId.startsWith('WA_') && 
          !parsedData.userId.startsWith('WL_')) {
        console.log('古いユーザーID形式を検出、マイグレーション実行中...');
        return await this.migrateExistingUser();
      }
      
      return parsedData;
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
      return null;
    }
  }

  async isLoggedIn() {
    try {
      const loginStatus = await AsyncStorage.getItem('is_logged_in');
      return loginStatus === 'true';
    } catch (error) {
      console.error('ログイン状態確認エラー:', error);
      return false;
    }
  }

  async isProfileCompleted() {
    try {
      const userData = await this.getUserData();
      return userData && userData.profileCompleted === true;
    } catch (error) {
      console.error('プロフィール完了状態確認エラー:', error);
      return false;
    }
  }

  async markProfileAsCompleted() {
    try {
      const userData = await this.getUserData();
      if (userData) {
        userData.profileCompleted = true;
        await this.saveUserData(userData);
      }
    } catch (error) {
      console.error('プロフィール完了状態設定エラー:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('is_logged_in');
      return { success: true };
    } catch (error) {
      console.error('ログアウトエラー:', error);
      return { success: false, error: error.message };
    }
  }

  async clearAuthData() {
    try {
      await AsyncStorage.clear();
      console.log('認証データをクリアしました');
    } catch (error) {
      console.error('認証データクリアエラー:', error);
    }
  }
}

export default new AuthService();