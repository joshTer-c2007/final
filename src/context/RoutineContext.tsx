import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync ? SQLite.openDatabaseSync('gympro.db') : (SQLite as any).openDatabase('gympro.db');

export type Routine = {
  id: string;
  name: string;
  muscleGroup: string;
  duration: number;
  createdAt: string;
  featured: boolean;
  imageUri?: string;
  rating: number;
};

export type UserProfile = {
  name: string;
  nickname: string;
} | null;

type RoutineContextType = {
  routines: Routine[];
  userProfile: UserProfile;
  savedProfile: UserProfile;
  saveUserProfile: (name: string, nickname: string) => void;
  logoutUser: () => void;
  addRoutine: (name: string, muscleGroup: string, duration: number, imageUri?: string, rating?: number) => void;
  updateRoutine: (id: string, name: string, muscleGroup: string, duration: number, imageUri?: string, rating?: number) => void;
  deleteRoutine: (id: string) => void;
  toggleFeatured: (id: string) => void;
};

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [savedProfile, setSavedProfile] = useState<UserProfile>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      // Forzamos el reinicio limpio de las tablas para actualizar el esquema con imageUri y rating
      await db.execAsync(`
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS profile;
        
        CREATE TABLE routines (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          muscleGroup TEXT NOT NULL,
          duration INTEGER NOT NULL,
          createdAt TEXT NOT NULL,
          featured INTEGER DEFAULT 0,
          imageUri TEXT,
          rating INTEGER DEFAULT 5
        );
        
        CREATE TABLE profile (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          nickname TEXT NOT NULL
        );
      `);

      await loadProfile();
      await loadRoutines();
    } catch (err) {
      console.log("Error inicializando BD: ", err);
    }
  };

  const loadProfile = async () => {
    try {
      const rows: any[] = await db.getAllAsync('SELECT * FROM profile LIMIT 1');
      if (rows.length > 0) {
        setSavedProfile({ name: rows[0].name, nickname: rows[0].nickname });
      }
    } catch (e) {
      console.log("Error cargando perfil", e);
    }
  };

  const saveUserProfile = async (name: string, nickname: string) => {
    try {
      await db.runAsync('DELETE FROM profile');
      await db.runAsync('INSERT INTO profile (name, nickname) VALUES (?, ?)', [name, nickname]);
      const newProf = { name, nickname };
      setSavedProfile(newProf);
      setUserProfile(newProf);
    } catch (e) {
      console.log("Error guardando perfil", e);
    }
  };

  const logoutUser = async () => {
    try {
      await db.runAsync('DELETE FROM profile');
      setSavedProfile(null);
      setUserProfile(null);
    } catch (e) {
      console.log("Error cerrando sesión", e);
    }
  };

  const loadRoutines = async () => {
    try {
      const allRows: any[] = await db.getAllAsync('SELECT * FROM routines');
      
      if (!allRows || allRows.length === 0) {
        const defaultRoutines: Routine[] = [
          {
            id: '1',
            name: 'Hipertrofia de Pecho Épica',
            muscleGroup: 'Pecho',
            duration: 45,
            createdAt: '26/09/2026',
            featured: true,
            imageUri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400',
            rating: 5
          },
          {
            id: '2',
            name: 'Espalda de Acero',
            muscleGroup: 'Espalda',
            duration: 50,
            createdAt: '26/09/2026',
            featured: false,
            imageUri: 'https://images.unsplash.com/photo-1603287681832-b175ca50efca?q=80&w=400',
            rating: 4
          },
          {
            id: '3',
            name: 'Piernas de Titán',
            muscleGroup: 'Piernas',
            duration: 60,
            createdAt: '26/09/2026',
            featured: false,
            imageUri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
            rating: 5
          }
        ];

        for (const rut of defaultRoutines) {
          await db.runAsync(
            'INSERT INTO routines (id, name, muscleGroup, duration, createdAt, featured, imageUri, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [rut.id, rut.name, rut.muscleGroup, rut.duration, rut.createdAt, rut.featured ? 1 : 0, rut.imageUri, rut.rating]
          );
        }
        setRoutines(defaultRoutines);
      } else {
        let loadedRoutines = allRows.map(row => ({
          ...row,
          featured: row.featured === 1,
          rating: row.rating || 5,
          imageUri: row.imageUri || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400'
        }));
        setRoutines(loadedRoutines);
      }
    } catch (error) {
      console.log("Error cargando rutinas", error);
    }
  };

  const addRoutine = async (name: string, muscleGroup: string, duration: number, imageUri?: string, rating: number = 5) => {
    const newId = Date.now().toString();
    const createdAt = new Date().toLocaleDateString();
    const defaultImg = imageUri || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400';
    
    await db.runAsync(
      'INSERT INTO routines (id, name, muscleGroup, duration, createdAt, featured, imageUri, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newId, name, muscleGroup, duration, createdAt, 0, defaultImg, rating]
    );
    loadRoutines();
  };

  const updateRoutine = async (id: string, name: string, muscleGroup: string, duration: number, imageUri?: string, rating: number = 5) => {
    await db.runAsync(
      'UPDATE routines SET name = ?, muscleGroup = ?, duration = ?, imageUri = ?, rating = ? WHERE id = ?',
      [name, muscleGroup, duration, imageUri || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400', rating, id]
    );
    loadRoutines();
  };

  const deleteRoutine = async (id: string) => {
    await db.runAsync('DELETE FROM routines WHERE id = ?', [id]);
    loadRoutines();
  };

  const toggleFeatured = async (id: string) => {
    await db.runAsync('UPDATE routines SET featured = 0');
    await db.runAsync('UPDATE routines SET featured = 1 WHERE id = ?', [id]);
    loadRoutines();
  };

  return (
    <RoutineContext.Provider value={{ routines, userProfile, savedProfile, saveUserProfile, logoutUser, addRoutine, updateRoutine, deleteRoutine, toggleFeatured }}>
      {children}
    </RoutineContext.Provider>
  );
};

export const useRoutines = () => {
  const context = useContext(RoutineContext);
  if (!context) throw new Error('useRoutines debe usarse dentro de un RoutineProvider');
  return context;
};