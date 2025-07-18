import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from './AuthService';

const EVENT_STORAGE_KEY = 'events';

class EventService {
  async saveEvents(events) {
    try {
      const eventsJson = JSON.stringify(events);
      await AsyncStorage.setItem(EVENT_STORAGE_KEY, eventsJson);
    } catch (error) {
      console.error('イベントの保存に失敗:', error);
    }
  }

  async loadEvents() {
    try {
      const eventsJson = await AsyncStorage.getItem(EVENT_STORAGE_KEY);
      if (eventsJson) {
        return JSON.parse(eventsJson);
      }
      return [];
    } catch (error) {
      console.error('イベントの読み込みに失敗:', error);
      return [];
    }
  }

  async addEvent(newEvent) {
    try {
      const events = await this.loadEvents();
      const currentUser = await AuthService.getUserData();
      
      const eventWithId = {
        ...newEvent,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        payments: newEvent.payments || [],
        hostUser: currentUser,
        participants: []
      };
      events.push(eventWithId);
      await this.saveEvents(events);
      return eventWithId;
    } catch (error) {
      console.error('イベントの追加に失敗:', error);
      throw error;
    }
  }

  async updateEvent(eventId, updatedEvent) {
    try {
      const events = await this.loadEvents();
      const eventIndex = events.findIndex(event => event.id === eventId);
      
      if (eventIndex !== -1) {
        events[eventIndex] = {
          ...events[eventIndex],
          ...updatedEvent,
          updatedAt: new Date().toISOString()
        };
        await this.saveEvents(events);
        return events[eventIndex];
      }
      throw new Error('イベントが見つかりません');
    } catch (error) {
      console.error('イベントの更新に失敗:', error);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      const events = await this.loadEvents();
      const filteredEvents = events.filter(event => event.id !== eventId);
      await this.saveEvents(filteredEvents);
      return true;
    } catch (error) {
      console.error('イベントの削除に失敗:', error);
      throw error;
    }
  }

  async getParticipatingEvents() {
    try {
      const currentUser = await AuthService.getUserData();
      if (!currentUser) return [];

      const events = await this.loadEvents();
      const sharedEvents = await this.getSharedEvents();
      
      const participatingEvents = [];
      
      // 自分が作成したイベント
      const ownEvents = events.filter(event => 
        event.hostUser && event.hostUser.userId === currentUser.userId
      );
      participatingEvents.push(...ownEvents);
      
      // 共有イベント（参加者として追加されているもの）
      Object.values(sharedEvents).forEach(event => {
        if (event.participants && event.participants.some(p => p.userId === currentUser.userId)) {
          participatingEvents.push(event);
        }
      });
      
      return participatingEvents;
    } catch (error) {
      console.error('参加イベント取得エラー:', error);
      return [];
    }
  }

  async getSharedEvents() {
    try {
      const EventShareService = require('./EventShareService').default;
      return await EventShareService.getSharedEvents();
    } catch (error) {
      console.error('共有イベント取得エラー:', error);
      return {};
    }
  }

  async clearAllEvents() {
    try {
      await AsyncStorage.removeItem(EVENT_STORAGE_KEY);
      console.log('全てのイベントデータを削除しました');
    } catch (error) {
      console.error('イベントデータのクリアに失敗:', error);
    }
  }
}

export default new EventService();