import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, FileText, Stethoscope, Pill, ClipboardList, FileSpreadsheet, Upload } from 'lucide-react-native';
import { supabase, Visit } from '../../../../lib/supabase';
import { formatDate } from '../../../../utils/date';

export default function VisitDetailsScreen() {
  const { id, visitId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [visit, setVisit] = useState<Visit | null>(null);
  const [files, setFiles] = useState<Array<{ name: string }>>([]);

  useEffect(() => {
    loadVisitData();
  }, [visitId]);

  const loadVisitData = async () => {
    try {
      // Cargar datos de la visita
      const { data: visitData, error: visitError } = await supabase
        .from('visits')
        .select('*')
        .eq('id', visitId)
        .single();

      if (visitError) throw visitError;
      setVisit(visitData);

      // Cargar archivos adjuntos
      const { data: filesData, error: filesError } = await supabase.storage
        .from('visit_files')
        .list(`${id}/${visitId}`);

      if (!filesError && filesData) {
        setFiles(filesData);
      }
    } catch (error) {
      console.error('Error al cargar datos de la visita:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de la consulta');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D9CDB" />
      </View>
    );
  }

  if (!visit) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se encontró la consulta</Text>
      </View>
    );
  }

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
            <Text style={styles.dateText}>{formatDate(visit.visit_date)}</Text>
          </View>
          <Text style={styles.visitType}>{visit.visit_type}</Text>
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

        {visit.treatment_plan && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Pill size={20} color="#666666" />
              <Text style={styles.sectionTitle}>Tratamiento</Text>
            </View>
            <Text style={styles.sectionText}>{visit.treatment_plan}</Text>
          </View>
        )}

        {visit.prescription && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color="#27AE60" />
              <Text style={styles.sectionTitle}>Medicamentos</Text>
            </View>
            <Text style={styles.sectionText}>{visit.prescription}</Text>
          </View>
        )}

        {visit.lab_request && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileSpreadsheet size={20} color="#2D9CDB" />
              <Text style={styles.sectionTitle}>Solicitud de Estudios</Text>
            </View>
            <Text style={styles.sectionText}>{visit.lab_request}</Text>
          </View>
        )}

        {files.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Upload size={20} color="#9B51E0" />
              <Text style={styles.sectionTitle}>Documentos Adjuntos</Text>
            </View>
            {files.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <FileText size={20} color="#666666" />
                <Text style={styles.fileName}>{file.name}</Text>
              </View>
            ))}
          </View>
        )}

        {visit.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ClipboardList size={20} color="#666666" />
              <Text style={styles.sectionTitle}>Notas Adicionales</Text>
            </View>
            <Text style={styles.sectionText}>{visit.notes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
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
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
  },
});