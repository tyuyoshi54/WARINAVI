import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from './AuthService';

const SHARED_EVENTS_KEY = 'shared_events';

class EventShareService {
  /**
   * イベント共有リンクを生成
   * @param {Object} event - 共有するイベント
   * @returns {string} 共有リンク
   */
  async generateShareLink(event) {
    try {
      // 共有用のイベントIDを生成（実際はサーバーで管理すべき）
      const shareId = this.generateShareId();
      
      // 共有イベントデータを保存
      await this.saveSharedEvent(shareId, event);
      
      // 共有リンクを生成
      const shareLink = `https://warinavi.app/event/shared/${shareId}`;
      
      return shareLink;
    } catch (error) {
      console.error('共有リンク生成エラー:', error);
      throw error;
    }
  }

  /**
   * 共有されたイベントを取得
   * @param {string} shareId - 共有ID
   * @returns {Object|null} イベントデータ
   */
  async getSharedEvent(shareId) {
    try {
      const sharedEvents = await this.getSharedEvents();
      return sharedEvents[shareId] || null;
    } catch (error) {
      console.error('共有イベント取得エラー:', error);
      return null;
    }
  }

  /**
   * 共有イベントデータを保存
   * @param {string} shareId - 共有ID
   * @param {Object} event - イベントデータ
   */
  async saveSharedEvent(shareId, event) {
    try {
      const sharedEvents = await this.getSharedEvents();
      
      const shareData = {
        ...event,
        shareId,
        sharedAt: new Date().toISOString(),
        isShared: true,
      };
      
      sharedEvents[shareId] = shareData;
      
      await AsyncStorage.setItem(SHARED_EVENTS_KEY, JSON.stringify(sharedEvents));
    } catch (error) {
      console.error('共有イベント保存エラー:', error);
      throw error;
    }
  }

  /**
   * 共有されたイベントを更新
   * @param {string} shareId - 共有ID
   * @param {Object} updatedEvent - 更新されたイベントデータ
   */
  async updateSharedEvent(shareId, updatedEvent) {
    try {
      const sharedEvents = await this.getSharedEvents();
      
      if (!sharedEvents[shareId]) {
        throw new Error('共有イベントが見つかりません');
      }
      
      sharedEvents[shareId] = {
        ...sharedEvents[shareId],
        ...updatedEvent,
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(SHARED_EVENTS_KEY, JSON.stringify(sharedEvents));
      
      return sharedEvents[shareId];
    } catch (error) {
      console.error('共有イベント更新エラー:', error);
      throw error;
    }
  }

  /**
   * 全ての共有イベントを取得
   * @returns {Object} 共有イベントのオブジェクト
   */
  async getSharedEvents() {
    try {
      const sharedEventsJson = await AsyncStorage.getItem(SHARED_EVENTS_KEY);
      return sharedEventsJson ? JSON.parse(sharedEventsJson) : {};
    } catch (error) {
      console.error('共有イベント一覧取得エラー:', error);
      return {};
    }
  }

  /**
   * 共有IDを生成
   * @returns {string} ユニークな共有ID
   */
  generateShareId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${random}`;
  }

  /**
   * URLから共有IDを抽出
   * @param {string} url - 共有URL
   * @returns {string|null} 共有ID
   */
  extractShareIdFromUrl(url) {
    try {
      const match = url.match(/\/event\/shared\/([^/?]+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('共有ID抽出エラー:', error);
      return null;
    }
  }

  /**
   * イベントに新しいメンバーを追加
   * @param {string} shareId - 共有ID
   * @param {string} memberName - 追加するメンバー名
   */
  async joinSharedEvent(shareId, memberName) {
    try {
      const event = await this.getSharedEvent(shareId);
      const currentUser = await AuthService.getUserData();
      
      if (!event) {
        throw new Error('イベントが見つかりません');
      }
      
      // メンバーが既に参加していないかチェック
      if (event.members && event.members.includes(memberName)) {
        throw new Error('既に参加しています');
      }
      
      // 参加者として既に追加されていないかチェック
      const isAlreadyParticipant = event.participants && 
        event.participants.some(p => p.userId === currentUser?.userId);
      
      const updatedMembers = event.members ? [...event.members, memberName] : [memberName];
      const updatedParticipants = isAlreadyParticipant ? 
        event.participants : 
        [...(event.participants || []), currentUser];
      
      await this.updateSharedEvent(shareId, {
        members: updatedMembers,
        participants: updatedParticipants
      });
      
      return await this.getSharedEvent(shareId);
    } catch (error) {
      console.error('イベント参加エラー:', error);
      throw error;
    }
  }

  /**
   * 共有イベントデータをクリア
   */
  async clearSharedEvents() {
    try {
      await AsyncStorage.removeItem(SHARED_EVENTS_KEY);
      console.log('共有イベントデータをクリアしました');
    } catch (error) {
      console.error('共有イベントデータクリアエラー:', error);
    }
  }
}

export default new EventShareService();