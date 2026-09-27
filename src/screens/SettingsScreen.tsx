import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="settings-outline" size={48} color="#007AFF" />
        <Text style={styles.title}>Configuración del Sistema</Text>
        <Text style={styles.subtitle}>Ajustes corporativos y preferencias</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 30, borderRadius: 20, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginTop: 15 },
  subtitle: { fontSize: 14, color: '#A0A0A0', marginTop: 5 }
});