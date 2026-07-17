import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing. Auth and data features will not work.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_type: string | null;
  height_cm: number | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  user_id: string;
  doctor_name: string;
  specialty: string | null;
  appointment_date: string;
  appointment_time: string;
  location: string | null;
  reason: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export type MedicalEntry = {
  id: string;
  user_id: string;
  entry_type: string;
  title: string;
  description: string | null;
  recorded_date: string | null;
  severity: string | null;
  created_at: string;
};

export type EmergencyContact = {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  phone: string;
  email: string | null;
  is_primary: boolean;
  created_at: string;
};

export type SymptomCheck = {
  id: string;
  user_id: string;
  symptoms: string[];
  analysis: string;
  urgency: string;
  recommendations: string[];
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};
