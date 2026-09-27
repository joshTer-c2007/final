import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RoutineProvider } from './src/context/RoutineContext';
import HomeScreen from './src/screens/HomeScreen';
import DrawerNavigator from './src/navigators/DrawerNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <RoutineProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </RoutineProvider>
  );
}