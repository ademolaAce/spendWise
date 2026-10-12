import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const resolvedColorScheme = colorScheme === 'dark' ? 'dark' : 'light';

  console.log('colorScheme', colorScheme);


  return (
    <ThemeProvider value={NAV_THEME[resolvedColorScheme]}>
      <StatusBar style={resolvedColorScheme === 'light' ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
