import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Animated, Dimensions } from 'react-native';
import AddEventModal from '../modals/AddEventModal';
import EventDetailScreen from './EventDetailScreen';
import SideMenu from '../common/SideMenu';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ user, onNavigateToMyPage }) {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.65)).current;

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

  const handleProfilePress = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleMenuClose = () => {
    Animated.timing(slideAnim, {
      toValue: -screenWidth * 0.65,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
    });
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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={handleProfilePress}
        >
          {user?.pictureUrl ? (
            <Image 
              source={{ uri: user.pictureUrl }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Text style={styles.defaultProfileText}>
                {user?.displayName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.title}>イベント一覧</Text>
        <View style={styles.headerSpacer} />
      </View>
      
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

      <SideMenu
        isVisible={isMenuVisible}
        onClose={handleMenuClose}
        user={user}
        slideAnim={slideAnim}
        onNavigateToMyPage={onNavigateToMyPage}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  defaultProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2980b9',
  },
  defaultProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 48,
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