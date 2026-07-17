import { useEffect, useState, type FormEvent } from 'react';
import { Mail, Phone, Save, User as UserIcon } from 'lucide-react';import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { PageHeader } from '../components/Layout';
import { Spinner, Toast } from '../components/ui';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const genders = ['', 'Female', 'Male', 'Non-binary', 'Prefer not to say'];

export function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('Unknown');
  const [heightCm, setHeightCm] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setDateOfBirth(profile.date_of_birth ?? '');
      setGender(profile.gender ?? '');
      setBloodType(profile.blood_type ?? 'Unknown');
      setHeightCm(profile.height_cm ? String(profile.height_cm) : '');
      setPhone(profile.phone ?? '');
      setAddress(profile.address ?? '');
    }
  }, [profile]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName || null,
      date_of_birth: dateOfBirth || null,
      gender: gender || null,
      blood_type: bloodType || null,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      phone: phone || null,
      address: address || null,
      updated_at: new Date().toISOString(),
    });
    await refreshProfile();
    setSaving(false);
    setToast('Profile saved');
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="Profile"
        title="Your personal information"
        subtitle="Keep your details up to date for more accurate guidance and smoother appointments."
        icon={<UserIcon className="h-3.5 w-3.5" />}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <div className="card animate-fade-up p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 font-display text-3xl font-extrabold text-white shadow-glow">
            {(fullName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-ink-900">
            {fullName || 'Your name'}
          </h3>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-500">
            <Mail className="h-3.5 w-3.5" /> {user?.email}
          </div>
          {phone && (
            <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-500">
              <Phone className="h-3.5 w-3.5" /> {phone}
            </div>
          )}
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <Info label="Blood type" value={bloodType} />
            <Info label="Height" value={heightCm ? `${heightCm} cm` : '—'} />
            <Info label="DOB" value={dateOfBirth || '—'} />
            <Info label="Gender" value={gender || '—'} />
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={submit} className="card animate-fade-up p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold text-ink-900">Edit details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Full name</label>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Date of birth</label>
              <input type="date" className="input" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
                {genders.map((g) => (
                  <option key={g || 'none'} value={g}>{g || 'Select…'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Blood type</label>
              <select className="input" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                {bloodTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Height (cm)</label>
              <input type="number" className="input" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="170" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0100" />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, Country" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Spinner /> : <Save className="h-4 w-4" />}
              Save changes
            </button>
          </div>
        </form>
      </div>

      <Toast show={!!toast} message={toast ?? ''} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3">
      <div className="text-xs text-ink-400">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-ink-900">{value}</div>
    </div>
  );
}
