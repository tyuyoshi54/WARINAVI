import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AddEventModal from './AddEventModal';
import EventDetailScreen from './EventDetailScreen';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const addEvent = () => {
    setIsModalVisible(true);
  };

  const handleSaveEvent = (eventData) => {
    setEvents([...events, eventData]);
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (updatedEvent) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
  };

  const renderEvent = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventItem} 
      onPress={() => handleEventPress(item)}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>{item.createdAt}</Text>
      {item.members && (
        <Text style={styles.eventMembers}>
          メンバー: {item.members.join(', ')}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (selectedEvent) {
    return (
      <EventDetailScreen
        event={selectedEvent}
        onBack={handleBackToList}
        onUpdateEvent={handleUpdateEvent}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>イベント一覧</Text>
      
      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>まだイベントがありません</Text>
          <Text style={styles.emptySubText}>「＋」ボタンでイベントを追加しましょう</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          style={styles.eventList}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addEvent}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      <AddEventModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  eventList: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
  },
  eventMembers: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});