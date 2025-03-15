import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Activity, Phone, Mail, MapPin, FileText, Plus, ChevronDown, X, ChevronRight, User } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Patient, Visit } from '../../lib/supabase';

type Status = 'neutral' | 'stable' | 'follow-up' | 'urgent';

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInitialRecord, setShowInitialRecord] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      // Cargar datos del paciente
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (patientError) throw patientError;

      setPatient(patientData);
      
      try {
        // Intentar cargar visitas del paciente
        const { data: visitsData, error: visitsError } = await supabase
          .from('visits')
          .select('*')
          .eq('patient_id', id)
          .order('visit_date', { ascending: false });

        if (!visitsError) {
          setVisits(visitsData || []);
        }
      } catch (visitError) {
        console.log('La tabla de visitas aún no está disponible');
        setVisits([]);
      }
    } catch (error) {
      console.error('Error al cargar datos del paciente:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del paciente');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    neutral: '#666666',
    stable: '#27AE60',
    'follow-up': '#F2C94C',
    urgent: '#EB5757',
  };

  const statusText = {
    neutral: 'Neutro',
    stable: 'Estable',
    'follow-up': 'Seguimiento',
    urgent: 'Urgente',
  };

  const handleStatusChange = async (newStatus: 'neutro' | 'estable' | 'seguimiento' | 'urgente') => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Actualizar el estado local
      setPatient(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del paciente');
    }
  };

  const handleNewVisit = () => {
    router.push(`/patient/${id}/new-visit`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

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

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'neutro':
          return '#666666';
        case 'estable':
          return '#27AE60';
        case 'seguimiento':
          return '#F2994A';
        case 'urgente':
          return '#EB5757';
        default:
          return '#666666';
      }
    };

    return (
      <Pressable
        onPress={() => {
          Alert.alert(
            'Cambiar Estado',
            'Selecciona el nuevo estado del paciente',
            [
              { text: 'Neutro', onPress: () => handleStatusChange('neutro') },
              { text: 'Estable', onPress: () => handleStatusChange('estable') },
              { text: 'Seguimiento', onPress: () => handleStatusChange('seguimiento') },
              { text: 'Urgente', onPress: () => handleStatusChange('urgente') },
              { text: 'Cancelar', style: 'cancel' },
            ]
          );
        }}
        style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
      >
        <Text style={styles.statusText}>{status}</Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D9CDB" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se encontró el paciente</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={60} color="#666666" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{patient.full_name}</Text>
            <Text style={styles.age}>{calculateAge(patient.date_of_birth)} años</Text>
            <StatusBadge status={patient.status as Status || 'neutral'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          <View style={styles.contactInfo}>
            {patient.phone && (
              <View style={styles.contactItem}>
                <Phone size={20} color="#666666" />
                <Text style={styles.contactText}>{patient.phone}</Text>
              </View>
            )}
            {patient.email && (
              <View style={styles.contactItem}>
                <Mail size={20} color="#666666" />
                <Text style={styles.contactText}>{patient.email}</Text>
              </View>
            )}
            {patient.address && (
              <View style={styles.contactItem}>
                <MapPin size={20} color="#666666" />
                <Text style={styles.contactText}>{patient.address}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expediente</Text>
            <Pressable style={styles.addVisitButton} onPress={handleNewVisit}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addVisitText}>Nueva Consulta</Text>
            </Pressable>
          </View>

          <Pressable 
            style={styles.recordCard}
            onPress={() => setShowInitialRecord(!showInitialRecord)}
          >
            <View style={styles.recordHeader}>
              <View style={styles.recordDate}>
                <Calendar size={16} color="#2D9CDB" />
                <Text style={styles.recordDateText}>{formatDate(patient.created_at)}</Text>
              </View>
              <Text style={styles.recordType}>Expediente Inicial</Text>
              <ChevronRight size={20} color="#666666" style={[
                styles.expandIcon,
                showInitialRecord && styles.expandIconRotated
              ]} />
            </View>

            {showInitialRecord && (
              <View style={styles.initialRecordContent}>
                <View style={styles.recordSection}>
                  <Text style={styles.recordSubtitle}>Datos Personales</Text>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Nombre completo:</Text>
                    <Text style={styles.fieldValue}>{patient.full_name}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Fecha de nacimiento:</Text>
                    <Text style={styles.fieldValue}>{formatDate(patient.date_of_birth)}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Sexo:</Text>
                    <Text style={styles.fieldValue}>{patient.gender}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Identificación:</Text>
                    <Text style={styles.fieldValue}>{patient.identification_number}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Estado civil:</Text>
                    <Text style={styles.fieldValue}>{patient.civil_status}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Nacionalidad:</Text>
                    <Text style={styles.fieldValue}>{patient.nationality}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Ocupación:</Text>
                    <Text style={styles.fieldValue}>{patient.occupation}</Text>
                  </View>
                </View>

                <View style={styles.recordSection}>
                  <Text style={styles.recordSubtitle}>Historial Médico</Text>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Motivo de consulta:</Text>
                    <Text style={styles.fieldValue}>{patient.consultation_reason}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Antecedentes patológicos:</Text>
                    <Text style={styles.fieldValue}>{patient.pathological_history}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Antecedentes familiares:</Text>
                    <Text style={styles.fieldValue}>{patient.family_history}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Hábitos:</Text>
                    <Text style={styles.fieldValue}>{patient.habits}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Alergias:</Text>
                    <Text style={styles.fieldValue}>{patient.allergies}</Text>
                  </View>
                </View>
              </View>
            )}
          </Pressable>

          {visits.map((visit) => (
            <Pressable 
              key={visit.id}
              style={styles.recordCard}
              onPress={() => router.push(`/patient/${id}/visit/${visit.id}`)}
            >
              <View style={styles.recordHeader}>
                <View style={styles.recordDate}>
                  <Calendar size={16} color="#2D9CDB" />
                  <Text style={styles.recordDateText}>{formatDate(visit.visit_date)}</Text>
                </View>
                <Text style={styles.recordType}>{visit.visit_type}</Text>
                <ChevronRight size={20} color="#666666" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowStatusModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar Estado</Text>
              <Pressable onPress={() => setShowStatusModal(false)}>
                <X size={24} color="#666666" />
              </Pressable>
            </View>
            {(['neutral', 'stable', 'follow-up', 'urgent'] as Status[]).map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusOption,
                  patient.status === status && styles.statusOptionSelected
                ]}
                onPress={() => handleStatusChange(status as 'neutro' | 'estable' | 'seguimiento' | 'urgente')}
              >
                <View style={[styles.statusDot, { backgroundColor: statusColors[status as Status] }]} />
                <Text style={[
                  styles.statusOptionText,
                  patient.status === status && styles.statusOptionTextSelected
                ]}>
                  {statusText[status as Status]}
                </Text>
              </Pressable>
            ))}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 4,
  },
  age: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
  },
  addVisitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D9CDB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addVisitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  recordCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  recordDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordDateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2D9CDB',
  },
  recordType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 'auto',
    marginRight: 8,
  },
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  initialRecordContent: {
    padding: 16,
    paddingTop: 0,
  },
  recordSection: {
    marginTop: 16,
  },
  recordSubtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  recordField: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  statusOptionSelected: {
    backgroundColor: '#F8F9FA',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
  },
  statusOptionTextSelected: {
    fontFamily: 'Inter-Medium',
  },
});