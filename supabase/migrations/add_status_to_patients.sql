-- Crear el tipo enum para los estados del paciente
CREATE TYPE patient_status AS ENUM ('neutro', 'estable', 'seguimiento', 'urgente');

-- Agregar la columna status a la tabla patients
ALTER TABLE patients 
ADD COLUMN status patient_status DEFAULT 'neutro';

-- Actualizar la política RLS para incluir el nuevo campo
CREATE POLICY "Doctors can update their patients status" ON patients
FOR UPDATE TO authenticated
USING (doctor_id = auth.uid())
WITH CHECK (doctor_id = auth.uid()); 