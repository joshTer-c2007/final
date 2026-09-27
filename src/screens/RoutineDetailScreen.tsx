import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoutines } from '../context/RoutineContext';

export default function RoutineDetailScreen() {
  const route = useRoute<any>();
  const { routines } = useRoutines();
  
  // Recibir el parámetro id y buscar en el contexto[cite: 4]
  const routineId = route.params?.id;
  const routine = routines.find(r => r.id === routineId);

  if (!routine) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Rutina no encontrada</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="barbell" size={60} color="#007AFF" />
          </View>
          {/* Mostrar la información de la rutina en grande[cite: 4] */}
          <Text style={styles.title}>{routine.name}</Text>
          <Text style={styles.subtitle}>{routine.muscleGroup}</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Ionicons name="time" size={24} color="#A0A0A0" />
            <Text style={styles.infoText}>Duración Total: {routine.duration} minutos</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Ionicons name="calendar" size={24} color="#A0A0A0" />
            {/* Incluyendo la fecha de creación[cite: 4] */}
            <Text style={styles.infoText}>Creado el: {routine.createdAt}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FF3B30', fontSize: 18 },
  scroll: { padding: 20 },
  heroSection: { alignItems: 'center', marginVertical: 30 },
  iconContainer: { backgroundColor: 'rgba(0,122,255,0.1)', padding: 20, borderRadius: 50, marginBottom: 15 },
  title: { fontSize: 32, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#A0A0A0', marginTop: 8 },
  detailCard: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 25, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  infoText: { fontSize: 16, color: '#E0E0E0', marginLeft: 15 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 8 }
});