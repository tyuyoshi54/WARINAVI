import { useState, useEffect } from 'react';
import EventService from '../../services/EventService';

export const useEventManager = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // アプリ起動時にイベントデータを読み込み
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const savedEvents = await EventService.loadEvents();
        setEvents(savedEvents);
      } catch (error) {
        console.error('イベントデータの読み込みに失敗:', error);
      }
    };
    
    loadEvents();
  }, []);

  // イベント追加
  const addEvent = async (eventData) => {
    try {
      const savedEvent = await EventService.addEvent(eventData);
      setEvents(prevEvents => [...prevEvents, savedEvent]);
      return savedEvent;
    } catch (error) {
      console.error('イベントの追加に失敗:', error);
      throw error;
    }
  };

  // イベント更新
  const updateEvent = async (updatedEvent) => {
    try {
      const savedEvent = await EventService.updateEvent(updatedEvent.id, updatedEvent);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === updatedEvent.id ? savedEvent : event
        )
      );
      
      // 選択中のイベントも更新
      if (selectedEvent?.id === updatedEvent.id) {
        setSelectedEvent(savedEvent);
      }
      
      return savedEvent;
    } catch (error) {
      console.error('イベントの更新に失敗:', error);
      throw error;
    }
  };

  // イベント削除
  const deleteEvent = async (eventId) => {
    try {
      await EventService.deleteEvent(eventId);
      setEvents(prevEvents => 
        prevEvents.filter(event => event.id !== eventId)
      );
      
      // 選択中のイベントが削除された場合は選択解除
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('イベントの削除に失敗:', error);
      throw error;
    }
  };

  // イベント選択
  const selectEvent = (event) => {
    setSelectedEvent(event);
  };

  // 選択解除
  const clearSelection = () => {
    setSelectedEvent(null);
  };

  // イベント検索
  const searchEvents = (query) => {
    if (!query.trim()) return events;
    
    return events.filter(event => 
      event.name.toLowerCase().includes(query.toLowerCase()) ||
      (event.members && event.members.some(member => 
        member.toLowerCase().includes(query.toLowerCase())
      ))
    );
  };

  return {
    // 状態
    events,
    selectedEvent,
    
    // アクション
    addEvent,
    updateEvent,
    deleteEvent,
    selectEvent,
    clearSelection,
    searchEvents,
  };
};