import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoutines } from '../context/RoutineContext';

const motivationalPhrases = [
  "empecemos a romper récords hoy.",
  "la disciplina vence al talento.",
  "es hora de destrozar los fierros.",
  "tu única competencia eres tú mismo.",
  "convierte el sudor en victoria."
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { userProfile, saveUserProfile } = useRoutines();

  const [nameInput, setNameInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [randomPhrase, setRandomPhrase] = useState('');

  const scaleDestro = useRef(new Animated.Value(1)).current;
  const scaleDeny = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    setRandomPhrase(motivationalPhrases[randomIndex]);
  }, []);

  const animatePress = (animValue: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start(() => callback());
  };

  const handleDestroPress = async () => {
    animatePress(scaleDestro, async () => {
      if (!userProfile) {
        if (!nameInput.trim() || !nicknameInput.trim()) {
          Alert.alert("Registro requerido", "Por favor ingresa tu Nombre y Apodo para continuar.");
          return;
        }
        await saveUserProfile(nameInput.trim(), nicknameInput.trim());
      }
      // Navegación directa al menú principal de entrenamiento
      navigation.replace('MainApp');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600' }} 
            style={styles.heroImage} 
          />
          <View style={styles.badgeInit}>
            <Ionicons name="flash" size={20} color="#FFCC00" />
          </View>
        </View>

        <Text style={styles.title}>Bienvenido al Gimnasio.T Campeón</Text>

        {!userProfile ? (
          <View style={styles.registerBox}>
            <Text style={styles.registerLabel}>Identifícate Campeón:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Tu Nombre" 
              placeholderTextColor="#666" 
              value={nameInput} 
              onChangeText={setNameInput} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Tu Apodo / Alias" 
              placeholderTextColor="#666" 
              value={nicknameInput} 
              onChangeText={setNicknameInput} 
            />
          </View>
        ) : (
          <Text style={styles.welcomeUserText}>
            Hola {userProfile.name} ({userProfile.nickname}), {randomPhrase}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: scaleDestro }], width: '100%' }}>
            <TouchableOpacity style={styles.destroButton} activeOpacity={0.9} onPress={handleDestroPress}>
              <Ionicons name="barbell" size={22} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.destroText}>Destrozar o Iniciar</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: scaleDeny }], width: '100%', marginTop: 15 }}>
            <TouchableOpacity 
              style={styles.denyButton} 
              activeOpacity={0.9}
              onPress={() => animatePress(scaleDeny, () => Alert.alert('Aviso', '¡Prohibido rendirse! Regresa cuando estés listo.'))}
            >
              <Ionicons name="time-outline" size={22} color="#A0A0A0" style={{ marginRight: 8 }} />
              <Text style={styles.denyText}>Denegar o esperar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { flex: 1, padding: 25, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', height: 200, borderRadius: 24, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  heroImage: { width: '100%', height: '100%' },
  badgeInit: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 15 },
  registerBox: { width: '100%', marginBottom: 20 },
  registerLabel: { color: '#007AFF', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', height: 48, borderRadius: 12, paddingHorizontal: 15, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  welcomeUserText: { fontSize: 15, color: '#4CD964', textAlign: 'center', marginBottom: 25, fontWeight: '600', paddingHorizontal: 10 },
  buttonContainer: { width: '100%', alignItems: 'center' },
  destroButton: { flexDirection: 'row', backgroundColor: '#007AFF', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#007AFF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  destroText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  denyButton: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  denyText: { color: '#A0A0A0', fontSize: 16, fontWeight: '600' }
});