import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SplashScreen } from 'expo-router';
import { View, ActivityIndicator, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }

    // Simular un tiempo de carga de 2 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../assets/images/splash-icon2.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="auth/AuthScreen"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal'
          }}
        />
        <Stack.Screen 
          name="home"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="new-patient" 
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Nuevo Paciente',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTitleStyle: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="patient/[id]" 
          options={{
            headerShown: true,
            headerTitle: 'Detalles del Paciente',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTitleStyle: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="stats" 
          options={{
            headerShown: true,
            headerTitle: 'Estadísticas',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTitleStyle: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 18,
            },
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '60%',
    height: '60%',
  },
});