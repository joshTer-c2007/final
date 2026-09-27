import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoutines } from '../context/RoutineContext';

export default function ProgressScreen() {
  const { routines, userProfile } = useRoutines();

  const totalRoutines = routines.length;
  const totalDuration = routines.reduce((acc, curr) => acc + curr.duration, 0);
  const avgDuration = totalRoutines > 0 ? Math.round(totalDuration / totalRoutines) : 0;
  
  const groupCounts: Record<string, number> = {};
  let topGroup = "N/A";
  let maxCount = 0;

  routines.forEach(r => {
    const group = r.muscleGroup;
    groupCounts[group] = (groupCounts[group] || 0) + 1;
    if (groupCounts[group] > maxCount) {
      maxCount = groupCounts[group];
      topGroup = group;
    }
  });

  const featuredRoutine = routines.find(r => r.featured);

  const StatBox = ({ title, value, icon, color }: any) => (
    <View style={styles.statBox}>
      <View style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Panel de {userProfile?.nickname || 'Campeón'}</Text>
          <Text style={styles.subtitle}>Métricas de rendimiento y eficiencia muscular</Text>
        </View>

        <View style={styles.grid}>
          <StatBox title="Rutinas" value={totalRoutines} icon="document-text" color="#007AFF" />
          <StatBox title="Mins Totales" value={totalDuration} icon="timer" color="#4CD964" />
          <StatBox title="Promedio" value={`${avgDuration}m`} icon="analytics" color="#FF9500" />
          <StatBox title="Favorito" value={topGroup} icon="body" color="#AF52DE" />
        </View>

        {/* Gráfica de Rendimiento de Ejercicios */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Ranking de Eficiencia Muscular</Text>
          <View style={styles.chartCard}>
            {Object.keys(groupCounts).map((group, index) => {
              const percentage = Math.round((groupCounts[group] / totalRoutines) * 100);
              return (
                <View key={index} style={styles.barRow}>
                  <View style={styles.barInfo}>
                    <Text style={styles.barLabel}>{group}</Text>
                    <Text style={styles.barPercent}>{percentage}%</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${percentage}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {featuredRoutine && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Rutina Estrella Actual</Text>
            <View style={styles.featuredCard}>
              <Ionicons name="star" size={32} color="#FFCC00" style={styles.starIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.featuredTitle}>{featuredRoutine.name}</Text>
                <Text style={styles.featuredSubtitle}>{featuredRoutine.muscleGroup} • {featuredRoutine.duration} mins</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { padding: 20 },
  header: { marginBottom: 25 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 14, color: '#A0A0A0', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  statBox: { width: '47%'.valueOf() as any, backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  iconWrapper: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 2 },
  statTitle: { fontSize: 11, color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  chartSection: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 15 },
  chartCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  barRow: { marginBottom: 15 },
  barInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  barPercent: { color: '#A0A0A0', fontSize: 13 },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 4 },
  featuredSection: { marginTop: 30 },
  featuredCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,204,0,0.06)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,204,0,0.2)' },
  starIcon: { marginRight: 15 },
  featuredTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  featuredSubtitle: { fontSize: 13, color: '#E0E0E0', marginTop: 2 }
});