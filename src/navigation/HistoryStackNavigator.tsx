import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryStackParamList } from './types';

// TODO: Import actual screens when they're created
const HistoryScreen = () => null;
const SettlementDetailScreen = () => null;

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export const HistoryStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HistoryScreen" 
        component={HistoryScreen}
        options={{ title: '履歴' }}
      />
      <Stack.Screen 
        name="SettlementDetail" 
        component={SettlementDetailScreen}
        options={{ title: '精算詳細' }}
      />
    </Stack.Navigator>
  );
};