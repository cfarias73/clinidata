import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, FileText, Stethoscope, Pill, ClipboardList } from 'lucide-react-native';

const DEMO_VISIT = {
  date: '15 Mar 2024',
  type: 'Consulta General',
  symptoms: 'Paciente presenta fiebre alta (39°C), dolor de garganta y congestión nasal desde hace 2 días.',
  diagnosis: 'Gripe estacional con posible infección viral de las vías respiratorias superiores.',
  treatment: 'Se receta:\n- Paracetamol 500mg cada 8 horas\n- Ibuprofeno 400mg cada 8 horas\n- Reposo por 3 días\n- Abundante hidratación',
  notes: 'Programar seguimiento en 5 días si los síntomas persisten. Realizar prueba de COVID-19 si la fiebre no cede en 48 horas.',
};

export default function VisitDetailsScreen() {
  const { id, visitId } = useLocalSearchParams();
  const visit = DEMO_VISIT;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333333" />
        </Pressable>
        <Text style={styles.title}>Detalles de Consulta</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.visitHeader}>
          <View style={styles.visitDate}>
            <Calendar size={20} color="#2D9CDB" />
            <Text style={styles.dateText}>{visit.date}</Text>
          </View>
          <Text style={styles.visitType}>{visit.type}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Stethoscope size={20} color="#666666" />
            <Text style={styles.sectionTitle}>Síntomas</Text>
          </View>
          <Text style={styles.sectionText}>{visit.symptoms}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#666666" />
            <Text style={styles.sectionTitle}>Diagnóstico</Text>
          </View>
          <Text style={styles.sectionText}>{visit.diagnosis}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Pill size={20} color="#666666" />
            <Text style={styles.sectionTitle}>Tratamiento</Text>
          </View>
          <Text style={styles.sectionText}>{visit.treatment}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ClipboardList size={20} color="#666666" />
            <Text style={styles.sectionTitle}>Notas Adicionales</Text>
          </View>
          <Text style={styles.sectionText}>{visit.notes}</Text>
        </View>
      </ScrollView>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  visitHeader: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  visitDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2D9CDB',
  },
  visitType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  sectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
  },
});