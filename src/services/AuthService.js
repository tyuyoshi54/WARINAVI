import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

class AuthService {
  constructor() {
    this.isInitialized = false;
  }

  async loginWithLine() {
    try {
      const mockUser = {
        userId: 'U' + Date.now(),
        displayName: 'テストユーザー',
        pictureUrl: null,
        statusMessage: '開発用アカウント',
        provider: 'line'
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

      const user = {
        userId: credential.user,
        displayName: credential.fullName ? 
          `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim() || 'Apple User' 
          : 'Apple User',
        email: credential.email,
        pictureUrl: null,
        provider: 'apple'
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
      return userData ? JSON.parse(userData) : null;
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