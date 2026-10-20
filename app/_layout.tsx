import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const resolvedColorScheme =
    colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeProvider value={NAV_THEME[resolvedColorScheme]}>
      <StatusBar style={resolvedColorScheme === 'light' ? 'dark' : 'light'}/>

      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerTintColor: NAV_THEME[resolvedColorScheme].colors.primary,
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="report/[id]"
          options={{
            headerTitle: 'Report Details',
            headerShown: false,
            headerBackTitle: 'Back',
          }}
        />
      </Stack>

    </ThemeProvider>
  );
}