import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabaseHelper } from '../../lib/supabase';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (isRecovery) {
        // Handle password recovery
        const { error } = await supabaseHelper.resetPassword(formData.email);
        if (error) throw error;
        Alert.alert(
          'Recuperación de Contraseña',
          'Si existe una cuenta con este correo, recibirás instrucciones para restablecer tu contraseña.',
          [{ text: 'OK', onPress: () => {
            setIsRecovery(false);
            setFormData({ ...formData, email: '' });
          }}]
        );
        return;
      }

      if (isLogin) {
        // Handle login
        await supabaseHelper.signIn({
          email: formData.email,
          password: formData.password,
        });
        router.replace('/');
      } else {
        // Handle registration
        if (!formData.full_name) {
          Alert.alert('Error', 'Por favor ingresa tu nombre completo');
          return;
        }
        await supabaseHelper.signUp({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
        });
        Alert.alert(
          'Registro Exitoso',
          'Por favor revisa tu correo electrónico para verificar tu cuenta.',
          [{ text: 'OK', onPress: () => {
            setIsLogin(true);
            setFormData({ email: '', password: '', full_name: '' });
          }}]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderButton = (text: string) => (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );

  if (isRecovery) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Recuperar Contraseña</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          {renderButton('Enviar Instrucciones')}

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsRecovery(false);
              setFormData({ ...formData, email: '' });
            }}
            disabled={isLoading}
          >
            <Text style={styles.switchButtonText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          editable={!isLoading}
        />

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
            editable={!isLoading}
          />
        )}

        {renderButton(isLogin ? 'Iniciar Sesión' : 'Registrarse')}

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => {
            setIsLogin(!isLogin);
            setFormData({ email: '', password: '', full_name: '' });
          }}
          disabled={isLoading}
        >
          <Text style={styles.switchButtonText}>
            {isLogin
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>

        {isLogin && (
          <TouchableOpacity
            style={styles.recoveryButton}
            onPress={() => {
              setIsRecovery(true);
              setFormData({ ...formData, password: '' });
            }}
            disabled={isLoading}
          >
            <Text style={styles.recoveryButtonText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
  },
  switchButtonText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  recoveryButton: {
    marginTop: 10,
  },
  recoveryButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
});