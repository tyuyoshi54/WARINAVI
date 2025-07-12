import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EventInfo({ event }) {
  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{event.name}</Text>
      <View style={styles.membersContainer}>
        <Text style={styles.membersTitle}>メンバー:</Text>
        <View style={styles.membersList}>
          {event.members.map((member, index) => (
            <View key={index} style={styles.memberChip}>
              <Text style={styles.memberName}>{member}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  membersContainer: {
    marginTop: 10,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 14,
    color: '#333',
  },
});