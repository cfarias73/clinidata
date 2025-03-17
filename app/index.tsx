import { Redirect } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        if (error.message.includes('network')) {
          console.error('Network error during auth check');
          // Retry after a short delay
          setTimeout(checkAuth, 3000);
          return;
        }
        throw error;
      }
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/AuthScreen" />;
  }

  return <Redirect href="/home" />;
}