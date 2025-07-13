import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendService {
  constructor() {
    this.FRIENDS_KEY = 'friends_data';
    this.FRIEND_REQUESTS_KEY = 'friend_requests';
  }

  // フレンドIDはユーザIDをそのまま使用
  getFriendId(user) {
    return user.userId;
  }

  // 友達リストを取得
  async getFriends(userId) {
    try {
      const friendsData = await AsyncStorage.getItem(`${this.FRIENDS_KEY}_${userId}`);
      return friendsData ? JSON.parse(friendsData) : [];
    } catch (error) {
      console.error('友達リスト取得エラー:', error);
      return [];
    }
  }

  // 友達を追加
  async addFriend(userId, friendData) {
    try {
      const currentFriends = await this.getFriends(userId);
      
      // 既に友達かチェック
      const isAlreadyFriend = currentFriends.some(
        friend => friend.userId === friendData.userId
      );
      
      if (isAlreadyFriend) {
        return { success: false, error: '既に友達です' };
      }

      const newFriend = {
        ...friendData,
        addedAt: new Date().toISOString(),
        status: 'accepted'
      };

      currentFriends.push(newFriend);
      await AsyncStorage.setItem(
        `${this.FRIENDS_KEY}_${userId}`, 
        JSON.stringify(currentFriends)
      );

      return { success: true, friend: newFriend };
    } catch (error) {
      console.error('友達追加エラー:', error);
      return { success: false, error: error.message };
    }
  }

  // 友達を削除
  async removeFriend(userId, friendUserId) {
    try {
      const currentFriends = await this.getFriends(userId);
      const updatedFriends = currentFriends.filter(
        friend => friend.userId !== friendUserId
      );

      await AsyncStorage.setItem(
        `${this.FRIENDS_KEY}_${userId}`, 
        JSON.stringify(updatedFriends)
      );

      return { success: true };
    } catch (error) {
      console.error('友達削除エラー:', error);
      return { success: false, error: error.message };
    }
  }

  // フレンド申請を送信
  async sendFriendRequest(fromUserId, toFriendId, fromUserData) {
    try {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const requestData = {
        id: requestId,
        from: fromUserId,
        fromUserData: fromUserData,
        toFriendId: toFriendId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // 申請を保存（実際のアプリではサーバーに送信）
      const currentRequests = await this.getFriendRequests();
      currentRequests.push(requestData);
      
      await AsyncStorage.setItem(
        this.FRIEND_REQUESTS_KEY,
        JSON.stringify(currentRequests)
      );

      return { success: true, request: requestData };
    } catch (error) {
      console.error('フレンド申請送信エラー:', error);
      return { success: false, error: error.message };
    }
  }

  // フレンド申請一覧を取得
  async getFriendRequests(userId = null) {
    try {
      const requestsData = await AsyncStorage.getItem(this.FRIEND_REQUESTS_KEY);
      const allRequests = requestsData ? JSON.parse(requestsData) : [];
      
      if (userId) {
        // 特定ユーザー宛の申請のみ
        return allRequests.filter(request => 
          request.toFriendId === userId && request.status === 'pending'
        );
      }
      
      return allRequests;
    } catch (error) {
      console.error('フレンド申請取得エラー:', error);
      return [];
    }
  }

  // フレンド申請に応答
  async respondToFriendRequest(requestId, response, currentUser) {
    try {
      const allRequests = await this.getFriendRequests();
      const requestIndex = allRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return { success: false, error: '申請が見つかりません' };
      }

      const request = allRequests[requestIndex];
      request.status = response; // 'accepted' または 'declined'
      request.respondedAt = new Date().toISOString();

      // 申請を更新
      await AsyncStorage.setItem(
        this.FRIEND_REQUESTS_KEY,
        JSON.stringify(allRequests)
      );

      // 承認された場合、双方の友達リストに追加
      if (response === 'accepted') {
        // 申請者の友達リストに自分を追加
        await this.addFriend(request.from, {
          userId: currentUser.userId,
          displayName: currentUser.displayName,
          pictureUrl: currentUser.pictureUrl,
          friendId: currentUser.friendId
        });

        // 自分の友達リストに申請者を追加
        await this.addFriend(currentUser.userId, {
          userId: request.from,
          displayName: request.fromUserData.displayName,
          pictureUrl: request.fromUserData.pictureUrl,
          friendId: request.fromUserData.friendId
        });
      }

      return { success: true, request };
    } catch (error) {
      console.error('フレンド申請応答エラー:', error);
      return { success: false, error: error.message };
    }
  }

  // ユーザIDでユーザーを検索（モック）
  async searchUserByUserId(userId) {
    try {
      // 実際のアプリではサーバーAPIを呼び出す
      // ここではモックデータを返す
      const mockUsers = [
        {
          userId: 'U123456789',
          displayName: '田中太郎',
          pictureUrl: null
        },
        {
          userId: 'U987654321',
          displayName: '佐藤花子',
          pictureUrl: null
        }
      ];

      const foundUser = mockUsers.find(user => user.userId === userId);
      
      if (foundUser) {
        return { success: true, user: foundUser };
      } else {
        return { success: false, error: 'ユーザーが見つかりません' };
      }
    } catch (error) {
      console.error('ユーザー検索エラー:', error);
      return { success: false, error: error.message };
    }
  }

  // QRコード用データを生成
  generateQRData(user) {
    return JSON.stringify({
      type: 'friend_add',
      userId: user.userId,
      displayName: user.displayName,
      pictureUrl: user.pictureUrl,
      timestamp: Date.now()
    });
  }

  // QRコードデータを解析
  parseQRData(qrData) {
    try {
      const data = JSON.parse(qrData);
      
      if (data.type === 'friend_add' && data.userId) {
        return { success: true, userData: data };
      } else {
        return { success: false, error: '無効なQRコードです' };
      }
    } catch (error) {
      return { success: false, error: 'QRコードの解析に失敗しました' };
    }
  }

  // 開発用：データをクリア
  async clearAllData() {
    try {
      await AsyncStorage.removeItem(this.FRIEND_REQUESTS_KEY);
      // 個別の友達データは残す（ユーザーIDが必要なため）
      console.log('フレンド申請データをクリアしました');
    } catch (error) {
      console.error('データクリアエラー:', error);
    }
  }
}

export default new FriendService();