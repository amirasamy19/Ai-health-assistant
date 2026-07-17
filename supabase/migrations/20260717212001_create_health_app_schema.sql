/*
# AI Health Assistant — Core Schema

## Overview
Creates the full data model for a multi-user AI Health Assistant app:
user profiles, appointments, medical history entries, emergency contacts,
saved symptom checks, and AI chat messages. All tables are owner-scoped
to the authenticated user via `user_id` with `auth.uid()` defaults and RLS.

## New Tables
1. `profiles` — extends auth.users with health-related profile fields
   - id (uuid, PK, references auth.users)
   - full_name (text)
   - date_of_birth (date)
   - gender (text)
   - blood_type (text)
   - height_cm (numeric)
   - phone (text)
   - address (text)
   - avatar_url (text)
   - created_at / updated_at (timestamptz)

2. `appointments` — booked consultations
   - id (uuid, PK)
   - user_id (uuid, owner, default auth.uid())
   - doctor_name (text)
   - specialty (text)
   - appointment_date (date)
   - appointment_time (text)
   - location (text)
   - reason (text)
   - status (text, default 'scheduled')
   - notes (text)
   - created_at (timestamptz)

3. `medical_history` — user health records
   - id (uuid, PK)
   - user_id (uuid, owner, default auth.uid())
   - entry_type (text): condition, medication, allergy, surgery, immunization, test
   - title (text)
   - description (text)
   - recorded_date (date)
   - severity (text)
   - created_at (timestamptz)

4. `emergency_contacts` — user's emergency contacts
   - id (uuid, PK)
   - user_id (uuid, owner, default auth.uid())
   - name (text)
   - relationship (text)
   - phone (text)
   - email (text)
   - is_primary (boolean, default false)
   - created_at (timestamptz)

5. `symptom_checks` — saved AI symptom checker results
   - id (uuid, PK)
   - user_id (uuid, owner, default auth.uid())
   - symptoms (text[])
   - analysis (text)
   - urgency (text)
   - recommendations (text[])
   - created_at (timestamptz)

6. `chat_messages` — AI assistant conversation history
   - id (uuid, PK)
   - user_id (uuid, owner, default auth.uid())
   - role (text): user | assistant
   - content (text)
   - created_at (timestamptz)

## Security
- RLS enabled on every table.
- Owner-scoped CRUD policies (4 per table) using auth.uid() = user_id.
- profiles: id = auth.uid(), select/update own profile.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  date_of_birth date,
  gender text,
  blood_type text,
  height_cm numeric,
  phone text,
  address text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_name text NOT NULL,
  specialty text,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  location text,
  reason text,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_appointments" ON appointments;
CREATE POLICY "select_own_appointments" ON appointments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_appointments" ON appointments;
CREATE POLICY "insert_own_appointments" ON appointments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_appointments" ON appointments;
CREATE POLICY "update_own_appointments" ON appointments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_appointments" ON appointments;
CREATE POLICY "delete_own_appointments" ON appointments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS medical_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type text NOT NULL,
  title text NOT NULL,
  description text,
  recorded_date date,
  severity text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_medical_history" ON medical_history;
CREATE POLICY "select_own_medical_history" ON medical_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_medical_history" ON medical_history;
CREATE POLICY "insert_own_medical_history" ON medical_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_medical_history" ON medical_history;
CREATE POLICY "update_own_medical_history" ON medical_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_medical_history" ON medical_history;
CREATE POLICY "delete_own_medical_history" ON medical_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text,
  phone text NOT NULL,
  email text,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "select_own_emergency_contacts" ON emergency_contacts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "insert_own_emergency_contacts" ON emergency_contacts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "update_own_emergency_contacts" ON emergency_contacts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "delete_own_emergency_contacts" ON emergency_contacts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS symptom_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms text[] NOT NULL,
  analysis text NOT NULL,
  urgency text NOT NULL,
  recommendations text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE symptom_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_symptom_checks" ON symptom_checks;
CREATE POLICY "select_own_symptom_checks" ON symptom_checks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_symptom_checks" ON symptom_checks;
CREATE POLICY "insert_own_symptom_checks" ON symptom_checks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_symptom_checks" ON symptom_checks;
CREATE POLICY "update_own_symptom_checks" ON symptom_checks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_symptom_checks" ON symptom_checks;
CREATE POLICY "delete_own_symptom_checks" ON symptom_checks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chat_messages" ON chat_messages;
CREATE POLICY "select_own_chat_messages" ON chat_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_chat_messages" ON chat_messages;
CREATE POLICY "insert_own_chat_messages" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_chat_messages" ON chat_messages;
CREATE POLICY "update_own_chat_messages" ON chat_messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_chat_messages" ON chat_messages;
CREATE POLICY "delete_own_chat_messages" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_appointments_user_date ON appointments(user_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_history_user ON medical_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON chat_messages(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_symptom_checks_user ON symptom_checks(user_id, created_at);
