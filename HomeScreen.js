import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);

  const addEvent = () => {
    Alert.prompt(
      'イベントを追加',
      'イベント名を入力してください',
      (eventName) => {
        if (eventName && eventName.trim()) {
          const newEvent = {
            id: Date.now().toString(),
            name: eventName.trim(),
            createdAt: new Date().toLocaleDateString(),
          };
          setEvents([...events, newEvent]);
        }
      }
    );
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>{item.createdAt}</Text>
    </View>
  );

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