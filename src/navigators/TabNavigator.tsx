import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import RoutineListScreen from '../screens/RoutineListScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#0A0A0A' },
        headerTintColor: '#FFF',
        tabBarStyle: { backgroundColor: '#111', borderTopColor: 'rgba(255,255,255,0.1)', height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'fitness';
          if (route.name === 'Directorio') iconName = 'list';
          else if (route.name === 'Progreso') iconName = 'stats-chart';
          else if (route.name === 'Configuración') iconName = 'settings';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Directorio" component={RoutineListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Progreso" component={ProgressScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Configuración" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}