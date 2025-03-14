import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Save } from 'lucide-react-native';

export default function NewPatientScreen() {
  const [form, setForm] = useState({
    // Datos de Identificación
    fullName: '',
    birthDate: '',
    sex: '',
    address: '',
    phone: '',
    email: '',
    idNumber: '',
    civilStatus: '',
    nationality: '',
    occupation: '',

    // Historial Médico
    consultReason: '',
    pathologicalHistory: '',
    familyHistory: '',
    habits: '',
    currentMedications: '',
    allergies: '',

    // Exploración Física
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      weight: '',
      height: '',
    },
    physicalExam: '',

    // Información Adicional
    labResults: '',
    diagnosis: '',
    treatment: '',
    prognosis: '',
  });

  const handleSubmit = () => {
    // En producción, guardar en backend
    console.log('Form submitted:', form);
    router.back();
  };

  const renderSection = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.form}>
        {renderSection('Datos de Identificación')}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={form.fullName}
            onChangeText={(text) => setForm({ ...form, fullName: text })}
            placeholder="Ingrese el nombre completo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <TextInput
            style={styles.input}
            value={form.birthDate}
            onChangeText={(text) => setForm({ ...form, birthDate: text })}
            placeholder="DD/MM/AAAA"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sexo</Text>
          <TextInput
            style={styles.input}
            value={form.sex}
            onChangeText={(text) => setForm({ ...form, sex: text })}
            placeholder="Masculino/Femenino"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Domicilio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.address}
            onChangeText={(text) => setForm({ ...form, address: text })}
            placeholder="Ingrese el domicilio completo"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            placeholder="Ingrese el número de teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico (Opcional)</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Identificación</Text>
          <TextInput
            style={styles.input}
            value={form.idNumber}
            onChangeText={(text) => setForm({ ...form, idNumber: text })}
            placeholder="Ingrese el número de identificación"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
            <Text style={styles.label}>Estado Civil</Text>
            <TextInput
              style={styles.input}
              value={form.civilStatus}
              onChangeText={(text) => setForm({ ...form, civilStatus: text })}
              placeholder="Estado civil"
            />
          </View>
          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>Nacionalidad</Text>
            <TextInput
              style={styles.input}
              value={form.nationality}
              onChangeText={(text) => setForm({ ...form, nationality: text })}
              placeholder="Nacionalidad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ocupación</Text>
          <TextInput
            style={styles.input}
            value={form.occupation}
            onChangeText={(text) => setForm({ ...form, occupation: text })}
            placeholder="Ingrese la ocupación"
          />
        </View>

        {renderSection('Historial Médico')}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Motivo de la Consulta</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.consultReason}
            onChangeText={(text) => setForm({ ...form, consultReason: text })}
            placeholder="Describa el motivo de la consulta"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Antecedentes Personales Patológicos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.pathologicalHistory}
            onChangeText={(text) => setForm({ ...form, pathologicalHistory: text })}
            placeholder="Describa los antecedentes patológicos"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Antecedentes Familiares</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.familyHistory}
            onChangeText={(text) => setForm({ ...form, familyHistory: text })}
            placeholder="Describa los antecedentes familiares"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hábitos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.habits}
            onChangeText={(text) => setForm({ ...form, habits: text })}
            placeholder="Describa los hábitos del paciente"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medicamentos Actuales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.currentMedications}
            onChangeText={(text) => setForm({ ...form, currentMedications: text })}
            placeholder="Liste los medicamentos actuales"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alergias</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.allergies}
            onChangeText={(text) => setForm({ ...form, allergies: text })}
            placeholder="Liste las alergias conocidas"
            multiline
            numberOfLines={3}
          />
        </View>

        {renderSection('Exploración Física')}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Signos Vitales</Text>
          <View style={styles.vitalSigns}>
            <View style={styles.vitalSignRow}>
              <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
                <Text style={styles.subLabel}>Presión Arterial</Text>
                <TextInput
                  style={styles.input}
                  value={form.vitalSigns.bloodPressure}
                  onChangeText={(text) => setForm({
                    ...form,
                    vitalSigns: { ...form.vitalSigns, bloodPressure: text }
                  })}
                  placeholder="mmHg"
                />
              </View>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.subLabel}>Frecuencia Cardíaca</Text>
                <TextInput
                  style={styles.input}
                  value={form.vitalSigns.heartRate}
                  onChangeText={(text) => setForm({
                    ...form,
                    vitalSigns: { ...form.vitalSigns, heartRate: text }
                  })}
                  placeholder="lpm"
                />
              </View>
            </View>
            <View style={styles.vitalSignRow}>
              <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
                <Text style={styles.subLabel}>Temperatura</Text>
                <TextInput
                  style={styles.input}
                  value={form.vitalSigns.temperature}
                  onChangeText={(text) => setForm({
                    ...form,
                    vitalSigns: { ...form.vitalSigns, temperature: text }
                  })}
                  placeholder="°C"
                />
              </View>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.subLabel}>Frecuencia Respiratoria</Text>
                <TextInput
                  style={styles.input}
                  value={form.vitalSigns.respiratoryRate}
                  onChangeText={(text) => setForm({
                    ...form,
                    vitalSigns: { ...form.vitalSigns, respiratoryRate: text }
                  })}
                  placeholder="rpm"
                />
              </View>
            </View>
            <View style={styles.vitalSignRow}>
              <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
                <Text style={styles.subLabel}>Peso</Text>
                <TextInput
                  style={styles.input}
                  value={form.vitalSigns.weight}
                  onChangeText={(text) => setForm({
                    ...form,
                    vitalSigns: { ...form.vitalSigns, weight: text }
                  })}
                  placeholder="kg"
                />
              </View>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.subLabel}>Altura</Text>
                <TextInput
                  style={styles.input}
                  value={form.vitalSigns.height}
                  onChangeText={(text) => setForm({
                    ...form,
                    vitalSigns: { ...form.vitalSigns, height: text }
                  })}
                  placeholder="cm"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Exploración Física por Sistemas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.physicalExam}
            onChangeText={(text) => setForm({ ...form, physicalExam: text })}
            placeholder="Describa la exploración física por aparatos y sistemas"
            multiline
            numberOfLines={4}
          />
        </View>

        {renderSection('Información Adicional')}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Resultados de Laboratorio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.labResults}
            onChangeText={(text) => setForm({ ...form, labResults: text })}
            placeholder="Ingrese los resultados de estudios de laboratorio"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diagnóstico</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.diagnosis}
            onChangeText={(text) => setForm({ ...form, diagnosis: text })}
            placeholder="Ingrese el diagnóstico"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Plan de Tratamiento</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.treatment}
            onChangeText={(text) => setForm({ ...form, treatment: text })}
            placeholder="Describa el plan de tratamiento"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pronóstico</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.prognosis}
            onChangeText={(text) => setForm({ ...form, prognosis: text })}
            placeholder="Ingrese el pronóstico"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <Pressable style={styles.saveButton} onPress={handleSubmit}>
        <Save size={24} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Guardar Expediente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#2D9CDB',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  subLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  marginRight: {
    marginRight: 8,
  },
  vitalSigns: {
    gap: 12,
  },
  vitalSignRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D9CDB',
    padding: 16,
    gap: 8,
    margin: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});