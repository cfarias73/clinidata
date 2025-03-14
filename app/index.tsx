import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Search, Plus, ChartBar } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PatientCard from '@/components/PatientCard';

const DEMO_PATIENTS = [
  {
    id: '1',
    name: 'Ana García',
    age: 34,
    lastVisit: '15 Mar 2024',
    status: 'stable',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    age: 45,
    lastVisit: '12 Mar 2024',
    status: 'follow-up',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'María López',
    age: 28,
    lastVisit: '10 Mar 2024',
    status: 'urgent',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
] as const;

export default function HomeScreen() {
  const handleNewPatient = () => {
    router.push('/new-patient');
  };

  const handleStats = () => {
    router.push('/stats');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>
        <Pressable style={styles.statsButton} onPress={handleStats}>
          <ChartBar size={24} color="#666666" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pacientes..."
          placeholderTextColor="#666666"
        />
      </View>

      <ScrollView style={styles.patientList}>
        {DEMO_PATIENTS.map((patient) => (
          <PatientCard key={patient.id} {...patient} />
        ))}
      </ScrollView>

      <Pressable style={styles.floatingButton} onPress={handleNewPatient}>
        <Plus size={24} color="#FFFFFF" />
      </Pressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#333333',
  },
  statsButton: {
    backgroundColor: '#F2F2F2',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    marginHorizontal: 20,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});