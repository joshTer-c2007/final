import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRoutines } from '../context/RoutineContext';
import { Ionicons } from '@expo/vector-icons';

export default function AddRoutineScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { addRoutine, updateRoutine, routines } = useRoutines();
  
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [duration, setDuration] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const routineId = route.params?.id;

  useEffect(() => {
    if (routineId) {
      const routineToEdit = routines.find(r => r.id === routineId);
      if (routineToEdit) {
        setName(routineToEdit.name);
        setMuscleGroup(routineToEdit.muscleGroup);
        setDuration(routineToEdit.duration.toString());
      }
    }
  }, [routineId, routines]);

  const handleSave = () => {
    setErrorMsg('');
    
    // Validación 1: Campos obligatorios
    if (!name.trim() || !muscleGroup.trim() || !duration.trim()) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    const parsedDuration = parseFloat(duration);
    // Validación 2: Numérica entre 10 y 180[cite: 6]
    if (isNaN(parsedDuration) || parsedDuration < 10 || parsedDuration > 180) {
      setErrorMsg('La duración debe ser un número entre 10 y 180 minutos.');
      return;
    }

    if (routineId) {
      updateRoutine(routineId, name, muscleGroup, parsedDuration);
    } else {
      addRoutine(name, muscleGroup, parsedDuration);
    }

    navigation.goBack(); // Solo regresa si no hubo errores[cite: 6]
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.glassCard}>
        {errorMsg !== '' && (
          <View style={styles.errorBox}>
            <Ionicons name="warning" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <Text style={styles.label}>Nombre de la Rutina</Text>
        <TextInput style={styles.input} placeholder="Ej: Espalda y Bíceps" placeholderTextColor="#666" value={name} onChangeText={setName} />

        <Text style={styles.label}>Grupo Muscular</Text>
        <TextInput style={styles.input} placeholder="Ej: Pecho, Espalda, Piernas" placeholderTextColor="#666" value={muscleGroup} onChangeText={setMuscleGroup} />

        <Text style={styles.label}>Duración (10 - 180 mins)</Text>
        <TextInput style={styles.input} placeholder="Ej: 45" placeholderTextColor="#666" keyboardType="numeric" value={duration} onChangeText={setDuration} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{routineId ? 'Actualizar Rutina' : 'Guardar Rutina'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20 },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 25, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginTop: 20 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,59,48,0.1)', padding: 12, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,59,48,0.3)' },
  errorText: { color: '#FF3B30', marginLeft: 8, fontSize: 14, flex: 1 },
  label: { color: '#E0E0E0', fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: 'rgba(0,0,0,0.4)', color: '#FFF', height: 55, borderRadius: 12, paddingHorizontal: 15, marginBottom: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 16 },
  saveButton: { backgroundColor: '#007AFF', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 }
});