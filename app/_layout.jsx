import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppHeader from '../components/header';
import Navbar from '../components/navbar';
import SplashScreen from './splash';

const SPLASH_DURATION = 3000;

export default function RootLayout() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleHome = () => router.replace('/');
  const handleSearch = () => router.push('/search');
  const handleHelp = () => router.push('/help');

  const statusBarStyle = showSplash || isDarkMode ? 'light' : 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          {showSplash ? (
            <SplashScreen />
          ) : (
            <>
              <AppHeader />
              <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="news" />
                  <Stack.Screen name="search" />
                  <Stack.Screen name="calendar" />
                  <Stack.Screen name="contacts" />
                  <Stack.Screen name="notifications" />
                  <Stack.Screen name="configuration" />
                  <Stack.Screen name="help" />
                </Stack>
              </View>
              <Navbar
                onHomePress={handleHome}
                onSearchPress={handleSearch}
                onHelpPress={handleHelp}
              />
            </>
          )}
        </View>
        <StatusBar style={statusBarStyle} hidden={showSplash} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
