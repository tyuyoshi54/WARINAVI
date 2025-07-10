import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

// TODO: Import actual screens when they're created
const HomeScreen = () => null;
const GroupDetailScreen = () => null;
const ExpenseInputScreen = () => null;
const SettlementScreen = () => null;
const PaymentScreen = () => null;

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => {
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
        name="HomeScreen" 
        component={HomeScreen}
        options={{ title: 'ホーム' }}
      />
      <Stack.Screen 
        name="GroupDetail" 
        component={GroupDetailScreen}
        options={{ title: 'グループ詳細' }}
      />
      <Stack.Screen 
        name="ExpenseInput" 
        component={ExpenseInputScreen}
        options={{ title: '立替入力' }}
      />
      <Stack.Screen 
        name="Settlement" 
        component={SettlementScreen}
        options={{ title: '精算' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ 
          title: '送金',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
};