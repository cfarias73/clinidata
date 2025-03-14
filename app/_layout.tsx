import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SplashScreen } from 'expo-router';

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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
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
    </>
  );
}