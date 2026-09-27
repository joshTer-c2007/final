import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import RoutineListScreen from '../screens/RoutineListScreen';
import ProgressScreen from '../screens/ProgressScreen';
import AddRoutineScreen from '../screens/AddRoutineScreen';
import { useRoutines } from '../context/RoutineContext';
import { TouchableOpacity, Alert } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function RoutineStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoutineList" component={RoutineListScreen} />
      <Stack.Screen name="AddRoutine" component={AddRoutineScreen} />
    </Stack.Navigator>
  );
}

export default function DrawerNavigator({ navigation }: any) {
  const { logoutUser } = useRoutines();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0A0A0A' },
        headerTintColor: '#FFF',
        drawerStyle: { backgroundColor: '#0A0A0A', width: 260 },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#A0A0A0',
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                "Cerrar Sesión",
                "¿Deseas volver a la pantalla principal?",
                [
                  { text: "Cancelar", style: "cancel" },
                  { 
                    text: "Salir", 
                    style: "destructive", 
                    onPress: () => {
                      logoutUser();
                      navigation.replace('Home');
                    } 
                  }
                ]
              );
            }} 
            style={{ marginRight: 15 }}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )
      }}
    >
      <Drawer.Screen 
        name="Mi Entrenamiento" 
        component={RoutineStack} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Progreso y Estadísticas" 
        component={ProgressScreen} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="analytics" size={size} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}