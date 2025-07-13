import { useState } from 'react';

export const useEventManager = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // イベント追加
  const addEvent = (eventData) => {
    setEvents(prevEvents => [...prevEvents, eventData]);
  };

  // イベント更新
  const updateEvent = (updatedEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  // イベント削除
  const deleteEvent = (eventId) => {
    setEvents(prevEvents => 
      prevEvents.filter(event => event.id !== eventId)
    );
    
    // 選択中のイベントが削除された場合は選択解除
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
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