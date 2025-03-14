import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Save, FileText, FileSpreadsheet, Upload, Share2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function NewVisitScreen() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    type: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    prescription: '',
    labRequest: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    uri: string;
    type: string;
  }>>([]);

  const handleSubmit = () => {
    // En producción, guardar en backend
    console.log('New visit submitted:', form);
    router.back();
  };

  const generatePDF = async (type: 'prescription' | 'labRequest') => {
    if (Platform.OS === 'web') {
      const doc = new jsPDF();
      const title = type === 'prescription' ? 'Receta Médica' : 'Solicitud de Estudios';
      const content = type === 'prescription' ? form.prescription : form.labRequest;
      
      doc.setFont('helvetica');
      doc.setFontSize(16);
      doc.text(title, 20, 20);
      
      doc.setFontSize(12);
      doc.text('Fecha: ' + new Date().toLocaleDateString(), 20, 30);
      
      doc.setFontSize(12);
      const contentLines = doc.splitTextToSize(content, 170);
      doc.text(contentLines, 20, 50);
      
      // Guardar el PDF
      doc.save(`${type === 'prescription' ? 'receta' : 'estudios'}.pdf`);
    }
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        setUploadedFiles([...uploadedFiles, {
          name: file.name,
          uri: file.uri,
          type: file.mimeType || '',
        }]);
      }
    } catch (err) {
      console.error('Error al subir documento:', err);
    }
  };

  const renderDocumentSection = (
    title: string,
    icon: JSX.Element,
    content: string,
    onChangeText: (text: string) => void,
    onGenerate: () => void
  ) => (
    <View style={styles.documentSection}>
      <View style={styles.documentHeader}>
        {icon}
        <Text style={styles.documentTitle}>{title}</Text>
        <Pressable style={styles.generateButton} onPress={onGenerate}>
          <Share2 size={20} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>Generar PDF</Text>
        </Pressable>
      </View>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={onChangeText}
        placeholder={`Escriba el contenido de ${title.toLowerCase()}`}
        multiline
        numberOfLines={6}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333333" />
        </Pressable>
        <Text style={styles.title}>Nueva Consulta</Text>
        <Pressable onPress={handleSubmit} style={styles.saveButton}>
          <Save size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Consulta</Text>
          <TextInput
            style={styles.input}
            value={form.type}
            onChangeText={(text) => setForm({ ...form, type: text })}
            placeholder="Ej: Consulta General, Control, Emergencia"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Síntomas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.symptoms}
            onChangeText={(text) => setForm({ ...form, symptoms: text })}
            placeholder="Describa los síntomas del paciente"
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
          <Text style={styles.label}>Tratamiento</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.treatment}
            onChangeText={(text) => setForm({ ...form, treatment: text })}
            placeholder="Describa el tratamiento prescrito"
            multiline
            numberOfLines={3}
          />
        </View>

        {renderDocumentSection(
          'Receta Médica',
          <FileText size={24} color="#27AE60" />,
          form.prescription,
          (text) => setForm({ ...form, prescription: text }),
          () => generatePDF('prescription')
        )}

        {renderDocumentSection(
          'Solicitud de Estudios',
          <FileSpreadsheet size={24} color="#2D9CDB" />,
          form.labRequest,
          (text) => setForm({ ...form, labRequest: text }),
          () => generatePDF('labRequest')
        )}

        <View style={styles.documentSection}>
          <View style={styles.documentHeader}>
            <Upload size={24} color="#9B51E0" />
            <Text style={styles.documentTitle}>Documentos Adjuntos</Text>
            <Pressable style={styles.uploadButton} onPress={handleUploadDocument}>
              <Text style={styles.uploadButtonText}>Subir Archivo</Text>
            </Pressable>
          </View>
          
          {uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <FileText size={20} color="#666666" />
              <Text style={styles.fileName}>{file.name}</Text>
            </View>
          ))}
          
          {uploadedFiles.length === 0 && (
            <Text style={styles.noFiles}>No hay archivos adjuntos</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas Adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.notes}
            onChangeText={(text) => setForm({ ...form, notes: text })}
            placeholder="Agregue notas adicionales si es necesario"
            multiline
            numberOfLines={3}
          />
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
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333333',
  },
  saveButton: {
    backgroundColor: '#2D9CDB',
    padding: 8,
    borderRadius: 8,
  },
  form: {
    flex: 1,
    padding: 20,
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
  documentSection: {
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D9CDB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  generateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  uploadButton: {
    backgroundColor: '#9B51E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
  },
  noFiles: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    padding: 20,
  },
});