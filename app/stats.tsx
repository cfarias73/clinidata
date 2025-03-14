import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, FileText, Stethoscope, FileSpreadsheet, FilePlus2 } from 'lucide-react-native';

const DEMO_STATS = {
  totalPatients: 124,
  totalConsults: 450,
  totalExams: 89,
  totalPrescriptions: 312,
  recentDocuments: [
    {
      id: '1',
      type: 'prescription',
      title: 'Receta - Antigripal',
      patient: 'Ana García',
      date: '15 Mar 2024',
    },
    {
      id: '2',
      type: 'lab',
      title: 'Resultados - Análisis de Sangre',
      patient: 'Carlos Rodríguez',
      date: '14 Mar 2024',
    },
    {
      id: '3',
      type: 'prescription',
      title: 'Receta - Antibiótico',
      patient: 'María López',
      date: '13 Mar 2024',
    },
  ],
};

export default function StatsScreen() {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <FilePlus2 size={20} color="#27AE60" />;
      case 'lab':
        return <FileSpreadsheet size={20} color="#2D9CDB" />;
      default:
        return <FileText size={20} color="#666666" />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={24} color="#2D9CDB" />
            <Text style={styles.statNumber}>{DEMO_STATS.totalPatients}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>

          <View style={styles.statCard}>
            <Stethoscope size={24} color="#27AE60" />
            <Text style={styles.statNumber}>{DEMO_STATS.totalConsults}</Text>
            <Text style={styles.statLabel}>Consultas</Text>
          </View>

          <View style={styles.statCard}>
            <FileSpreadsheet size={24} color="#F2C94C" />
            <Text style={styles.statNumber}>{DEMO_STATS.totalExams}</Text>
            <Text style={styles.statLabel}>Exámenes</Text>
          </View>

          <View style={styles.statCard}>
            <FilePlus2 size={24} color="#9B51E0" />
            <Text style={styles.statNumber}>{DEMO_STATS.totalPrescriptions}</Text>
            <Text style={styles.statLabel}>Recetas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documentos Recientes</Text>
          <View style={styles.documentList}>
            {DEMO_STATS.recentDocuments.map((doc) => (
              <View key={doc.id} style={styles.documentItem}>
                {getDocumentIcon(doc.type)}
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{doc.title}</Text>
                  <Text style={styles.documentMeta}>
                    {doc.patient} • {doc.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#333333',
    marginVertical: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 15,
  },
  documentList: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  documentTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  documentMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
});