import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoutines, Routine } from '../context/RoutineContext';

export default function RoutineListScreen() {
  const navigation = useNavigation<any>();
  const { routines, deleteRoutine, toggleFeatured } = useRoutines();

  const renderItem = ({ item }: { item: Routine }) => (
    <View style={[styles.card, item.featured && styles.featuredCard]}>
      <Image source={{ uri: item.imageUri }} style={styles.routineImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.rowHeader}>
          <Text style={styles.routineName}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFeatured(item.id)}>
            <Ionicons 
              name={item.featured ? "star" : "star-outline"} 
              size={22} 
              color={item.featured ? "#FFCC00" : "#666"} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.routineMuscle}>{item.muscleGroup} • {item.duration} mins</Text>
        
        <View style={styles.ratingRow}>
          {Array.from({ length: item.rating || 5 }).map((_, i) => (
            <Ionicons key={i} name="star" size={12} color="#FFCC00" style={{ marginRight: 2 }} />
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('AddRoutine', { routineToEdit: item })}
          >
            <Ionicons name="create-outline" size={16} color="#007AFF" />
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => {
              Alert.alert(
                "Eliminar Rutina",
                `¿Estás seguro de eliminar "${item.name}"?`,
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Eliminar", style: "destructive", onPress: () => deleteRoutine(item.id) }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Directorio de Rutinas</Text>
            <Text style={styles.subtitle}>Gestiona y selecciona tus entrenamientos clave</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddRoutine')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  listContainer: { padding: 20, paddingBottom: 90 },
  headerContainer: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 13, color: '#A0A0A0', marginTop: 2 },
  card: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  featuredCard: { borderColor: '#FFCC00', backgroundColor: 'rgba(255,204,0,0.03)' },
  routineImage: { width: 100, height: '100%', minHeight: 110 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routineName: { fontSize: 16, fontWeight: 'bold', color: '#FFF', flex: 1, marginRight: 8 },
  routineMuscle: { fontSize: 13, color: '#A0A0A0', marginTop: 2 },
  ratingRow: { flexDirection: 'row', marginVertical: 4 },
  actionsRow: { flexDirection: 'row', marginTop: 8, gap: 12 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editText: { color: '#007AFF', fontSize: 12, fontWeight: '600' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deleteText: { color: '#FF3B30', fontSize: 12, fontWeight: '600' },
  addButton: { position: 'absolute', bottom: 25, right: 25, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }
});