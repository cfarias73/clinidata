import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Modal, ActivityIndicator, Alert } from 'react-native';
import { Search, Plus, ChartBar, Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PatientCard from '@/components/PatientCard';
import { supabase } from '../lib/supabase';
import { Patient } from '../lib/supabase';

export default function HomeScreen() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/');
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPatients(data || []);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPatient = () => {
    router.push('/new-patient');
  };

  const handleStats = () => {
    router.push('/stats');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>
        <View style={styles.headerButtons}>
          <Pressable style={styles.iconButton} onPress={handleStats}>
            <ChartBar size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => setShowConfigModal(true)}>
            <Settings size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pacientes..."
          placeholderTextColor="#666666"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <ScrollView style={styles.patientList}>
        {loading ? (
          <ActivityIndicator size="large" color="#2D9CDB" style={styles.loader} />
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              id={patient.id}
              name={patient.full_name}
              age={calculateAge(patient.date_of_birth)}
              lastVisit={patient.last_visit || 'Sin consultas'}
              status={patient.status || 'stable'}
            />
          ))
        ) : (
          <Text style={styles.noPatients}>
            {searchQuery ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
          </Text>
        )}
      </ScrollView>

      <Pressable style={styles.floatingButton} onPress={handleNewPatient}>
        <Plus size={24} color="#FFFFFF" />
      </Pressable>

      <Modal
        visible={showConfigModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfigModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowConfigModal(false)}
        >
          <View style={styles.modalContent}>
            <Pressable 
              style={styles.modalOption}
              onPress={handleLogout}
            >
              <LogOut size={24} color="#EB5757" />
              <Text style={styles.modalOptionTextDanger}>Cerrar Sesión</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#0086e7',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
  },
  patientList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2D9CDB',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalOptionTextDanger: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EB5757',
    marginLeft: 12,
  },
  loader: {
    marginTop: 40,
  },
  noPatients: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 40,
  },
}); 