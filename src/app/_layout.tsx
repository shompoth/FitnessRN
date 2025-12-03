import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import Colors from '@/constants/Colors';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";


import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { dbName, getDb } from '@/db';
import { useWorkouts } from '@/store';

DarkTheme.colors.primary = Colors.dark.tint;
DefaultTheme.colors.primary = Colors.light.tint;

const db = SQLite.openDatabaseSync(dbName);


// getDb();

export default function RootLayout() {
  useDrizzleStudio(db);

  const colorScheme = useColorScheme();

  const loadWorkouts = useWorkouts((state) => state.loadWorkouts);

  useEffect(() => {
    loadWorkouts();
  }, []);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="workout/current" options={{ title: 'Workout' }} />
          <Stack.Screen name="workout/[id]" options={{ title: 'Workout' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
