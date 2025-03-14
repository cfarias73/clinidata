import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Activity, Phone, Mail, MapPin, FileText, Plus, ChevronDown, X, ChevronRight } from 'lucide-react-native';

const DEMO_PATIENT = {
  id: '1',
  name: 'Ana García',
  age: 34,
  phone: '+52 555 123 4567',
  email: 'ana.garcia@email.com',
  address: 'Av. Insurgentes Sur 1234, CDMX',
  lastVisit: '15 Mar 2024',
  status: 'stable',
  imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
  // Expediente inicial
  initialRecord: {
    createdAt: '10 Ene 2024',
    fullName: 'Ana María García López',
    birthDate: '15/05/1990',
    sex: 'Femenino',
    idNumber: 'GALA900515',
    civilStatus: 'Casada',
    nationality: 'Mexicana',
    occupation: 'Diseñadora Gráfica',
    pathologicalHistory: 'Hipertensión arterial controlada',
    familyHistory: 'Madre con diabetes tipo 2',
    habits: 'No fuma, ejercicio 3 veces por semana',
    allergies: 'Penicilina',
  },
  // Historial de consultas
  medicalHistory: [
    {
      id: '1',
      date: '15 Mar 2024',
      type: 'Consulta General',
      notes: 'Paciente presenta síntomas de gripe estacional. Se receta tratamiento sintomático.',
      documents: [
        { type: 'prescription', title: 'Receta - Antigripal', date: '15 Mar 2024' },
        { type: 'lab', title: 'Solicitud - Análisis de Sangre', date: '15 Mar 2024' },
      ],
    },
    {
      id: '2',
      date: '1 Feb 2024',
      type: 'Control Rutinario',
      notes: 'Exámenes de sangre muestran valores normales. Continuar con dieta actual.',
      documents: [
        { type: 'lab', title: 'Resultados - Análisis de Sangre', date: '1 Feb 2024' },
        { type: 'prescription', title: 'Receta - Vitaminas', date: '1 Feb 2024' },
      ],
    },
  ],
};

type Status = 'neutral' | 'stable' | 'follow-up' | 'urgent';

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState(DEMO_PATIENT);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInitialRecord, setShowInitialRecord] = useState(false);

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

  const handleStatusChange = (newStatus: Status) => {
    setPatient({ ...patient, status: newStatus });
    setShowStatusModal(false);
  };

  const handleNewVisit = () => {
    router.push(`/patient/${id}/new-visit`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: patient.imageUrl }} style={styles.profileImage} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{patient.name}</Text>
            <Text style={styles.age}>{patient.age} años</Text>
            <Pressable 
              style={[styles.statusBadge, { backgroundColor: statusColors[patient.status as Status] }]}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={styles.statusText}>{statusText[patient.status as Status]}</Text>
              <ChevronDown size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Phone size={20} color="#666666" />
              <Text style={styles.contactText}>{patient.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Mail size={20} color="#666666" />
              <Text style={styles.contactText}>{patient.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <MapPin size={20} color="#666666" />
              <Text style={styles.contactText}>{patient.address}</Text>
            </View>
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
                <Text style={styles.recordDateText}>{patient.initialRecord.createdAt}</Text>
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
                    <Text style={styles.fieldValue}>{patient.initialRecord.fullName}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Fecha de nacimiento:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.birthDate}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Sexo:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.sex}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Identificación:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.idNumber}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Estado civil:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.civilStatus}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Nacionalidad:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.nationality}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Ocupación:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.occupation}</Text>
                  </View>
                </View>

                <View style={styles.recordSection}>
                  <Text style={styles.recordSubtitle}>Historial Médico</Text>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Antecedentes patológicos:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.pathologicalHistory}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Antecedentes familiares:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.familyHistory}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Hábitos:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.habits}</Text>
                  </View>
                  <View style={styles.recordField}>
                    <Text style={styles.fieldLabel}>Alergias:</Text>
                    <Text style={styles.fieldValue}>{patient.initialRecord.allergies}</Text>
                  </View>
                </View>
              </View>
            )}
          </Pressable>

          {patient.medicalHistory.map((record) => (
            <Pressable 
              key={record.id} 
              style={styles.recordCard}
              onPress={() => router.push(`/patient/${id}/visit/${record.id}`)}
            >
              <View style={styles.recordHeader}>
                <View style={styles.recordDate}>
                  <Calendar size={16} color="#2D9CDB" />
                  <Text style={styles.recordDateText}>{record.date}</Text>
                </View>
                <Text style={styles.recordType}>{record.type}</Text>
              </View>
              <View style={styles.recordNotes}>
                <FileText size={16} color="#666666" />
                <Text style={styles.recordNotesText} numberOfLines={2}>
                  {record.notes}
                </Text>
              </View>
              <View style={styles.documentList}>
                {record.documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <FileText size={14} color={doc.type === 'prescription' ? '#27AE60' : '#2D9CDB'} />
                    <Text style={styles.documentTitle}>{doc.title}</Text>
                  </View>
                ))}
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
                onPress={() => handleStatusChange(status)}
              >
                <View style={[styles.statusDot, { backgroundColor: statusColors[status] }]} />
                <Text style={[
                  styles.statusOptionText,
                  patient.status === status && styles.statusOptionTextSelected
                ]}>
                  {statusText[status]}
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
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
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
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  addVisitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D9CDB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addVisitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordDateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2D9CDB',
  },
  recordType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  initialRecordContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  recordSection: {
    marginBottom: 20,
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
    marginBottom: 2,
  },
  fieldValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
  },
  recordNotes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  recordNotesText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  documentList: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  documentTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#666666',
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
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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