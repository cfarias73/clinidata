import { createClient } from '@supabase/supabase-js';
import * as FileSystem from 'expo-file-system';

const supabaseUrl = 'https://lzirdeibtwkoupbwretf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aXJkZWlidHdrb3VwYndyZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5OTA4NTYsImV4cCI6MjA1NzU2Njg1Nn0.ng1Y4Qv2pYBrE538Ik79B8y7eqygczK9yu9lp3f2H1I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Doctor {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  specialty: string;
  phone?: string;
  password?: string; // This will not be stored directly, but hashed
}

export type Patient = {
  id: string;
  created_at: string;
  doctor_id: string;
  full_name: string;
  date_of_birth: string;
  sex: 'M' | 'F';
  phone?: string;
  email?: string;
  address?: string;
  status: 'neutro' | 'estable' | 'seguimiento' | 'urgente';
  last_visit?: string;
};

export type Visit = {
  id: string;
  created_at: string;
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  visit_type: string;
  symptoms?: string;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
  prescription?: string;
  lab_request?: string;
  status: string;
};

// Auth types
export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Helper functions for database operations
export const supabaseHelper = {
  // Auth operations
  async signUp(userData: SignUpData) {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;

    // 2. Create doctor profile
    if (authData.user) {
      const doctorData = {
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
      };

      const { error: profileError } = await supabase
        .from('doctors')
        .insert([doctorData]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  async signIn(credentials: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        if (error.message.includes('network')) {
          throw new Error('Error de conexión. Por favor verifica tu conexión a internet.');
        }
        throw error;
      }
      return data;
    } catch (error: any) {
      console.error('SignIn error:', error);
      throw error;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  },

  // Doctor operations
  async getDoctorByEmail(email: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select()
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Patient operations
  async createPatient(patientData: Omit<Patient, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPatientsByDoctorId(doctorId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select()
      .eq('doctor_id', doctorId);
    
    if (error) throw error;
    return data;
  },

  async getPatientById(patientId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select()
      .eq('id', patientId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Visit operations
  async createVisit(visitData: Omit<Visit, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('visits')
      .insert([visitData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // File operations
  async uploadVisitFile(visitId: string, patientId: string, file: {
    name: string;
    uri: string;
    type: string;
  }) {
    try {
      // 1. Asegurarse de que el bucket existe
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketName = 'visit_files';
      
      if (!buckets?.find(b => b.name === bucketName)) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: false,
          fileSizeLimit: 52428800, // 50MB
        });
        if (createError) throw createError;
      }

      // 2. Generar un nombre de archivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${patientId}/${visitId}/${Date.now()}.${fileExt}`;

      // 3. Leer el archivo como base64
      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      // 4. Subir el archivo
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileContent, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 5. Obtener la URL del archivo
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return { fileName, publicUrl };
    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    }
  },

  async getVisitFiles(visitId: string, patientId: string) {
    try {
      const { data, error } = await supabase.storage
        .from('visit_files')
        .list(`${patientId}/${visitId}`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener archivos:', error);
      throw error;
    }
  }
};