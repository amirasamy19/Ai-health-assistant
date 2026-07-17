import { useEffect, useState, type FormEvent } from 'react';
import {
  CalendarHeart,
  CalendarPlus,
  CheckCircle2,
  Clock,
  MapPin,
  Pencil,
  Stethoscope,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type Appointment } from '../lib/supabase';
import { PageHeader } from '../components/Layout';
import { EmptyState, Modal, Spinner, Toast } from '../components/ui';

const specialties = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Mental Health',
  'Orthopedics',
  'Gynecology',
  'Ophthalmology',
];

const doctors: Record<string, string[]> = {
  'General Practice': ['Dr. Lena Okoye', 'Dr. Marcus Reyes'],
  Cardiology: ['Dr. Priya Nair', 'Dr. Aisha Bello'],
  Dermatology: ['Dr. Sofia Marchetti'],
  Pediatrics: ['Dr. Hannah Kim', 'Dr. Omar Farouk'],
  'Mental Health': ['Dr. Daniel Cohen', 'Dr. Yuki Tanaka'],
  Orthopedics: ['Dr. Rafael Santos'],
  Gynecology: ['Dr. Elena Petrova'],
  Ophthalmology: ['Dr. James Whitfield'],
};

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const locations = ['Riverside Medical Center', 'Northgate Clinic', 'Telehealth (Video)', 'Lakeside Hospital'];

type FormState = {
  doctor_name: string;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  reason: string;
  notes: string;
};

const emptyForm: FormState = {
  doctor_name: '',
  specialty: '',
  appointment_date: '',
  appointment_time: '',
  location: '',
  reason: '',
  notes: '',
};

export function Appointments() {
  const { user } = useAuth();
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true });
    setItems((data as Appointment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (a: Appointment) => {
    setEditing(a);
    setForm({
      doctor_name: a.doctor_name,
      specialty: a.specialty ?? '',
      appointment_date: a.appointment_date,
      appointment_time: a.appointment_time,
      location: a.location ?? '',
      reason: a.reason ?? '',
      notes: a.notes ?? '',
    });
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      doctor_name: form.doctor_name,
      specialty: form.specialty || null,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      location: form.location || null,
      reason: form.reason || null,
      notes: form.notes || null,
      status: 'scheduled' as const,
    };
    if (editing) {
      await supabase.from('appointments').update(payload).eq('id', editing.id);
      setToast('Appointment updated');
    } else {
      await supabase.from('appointments').insert(payload);
      setToast('Appointment booked');
    }
    setSaving(false);
    setOpen(false);
    setTimeout(() => setToast(null), 2200);
    load();
  };

  const remove = async (a: Appointment) => {
    await supabase.from('appointments').delete().eq('id', a.id);
    setToast('Appointment cancelled');
    setTimeout(() => setToast(null), 2200);
    load();
  };

  const upcoming = items.filter(
    (a) => new Date(`${a.appointment_date}T00:00:00`) >= new Date(new Date().toDateString())
  );
  const past = items.filter(
    (a) => new Date(`${a.appointment_date}T00:00:00`) < new Date(new Date().toDateString())
  );

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="Appointments"
        title="Book and manage your visits"
        subtitle="Schedule consultations, keep track of upcoming care, and review your visit history."
        icon={<CalendarHeart className="h-3.5 w-3.5" />}
      />

      <div className="mt-8 flex justify-between">
        <div />
        <button onClick={openNew} className="btn-primary">
          <CalendarPlus className="h-4 w-4" /> Book appointment
        </button>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<CalendarHeart className="h-6 w-6" />}
            title="No appointments yet"
            description="Book your first consultation to get started."
            action={
              <button onClick={openNew} className="btn-primary">
                <CalendarPlus className="h-4 w-4" /> Book appointment
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <Section title="Upcoming" items={upcoming} onEdit={openEdit} onDelete={remove} />
          {past.length > 0 && (
            <Section title="Past" items={past} onEdit={openEdit} onDelete={remove} muted />
          )}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit appointment' : 'Book an appointment'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Specialty</label>
            <select
              className="input"
              value={form.specialty}
              onChange={(e) => {
                const spec = e.target.value;
                const docs = doctors[spec] ?? [];
                setForm((f) => ({ ...f, specialty: spec, doctor_name: docs[0] ?? '' }));
              }}
              required
            >
              <option value="">Select a specialty…</option>
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Doctor</label>
            <select
              className="input"
              value={form.doctor_name}
              onChange={(e) => setForm((f) => ({ ...f, doctor_name: e.target.value }))}
              required
            >
              <option value="">Select a doctor…</option>
              {(doctors[form.specialty] ?? []).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                className="input"
                value={form.appointment_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm((f) => ({ ...f, appointment_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Time</label>
              <select
                className="input"
                value={form.appointment_time}
                onChange={(e) => setForm((f) => ({ ...f, appointment_time: e.target.value }))}
                required
              >
                <option value="">Select…</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Location</label>
            <select
              className="input"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            >
              <option value="">Select a location…</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Reason for visit</label>
            <input
              className="input"
              placeholder="e.g. Annual checkup"
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input min-h-[90px] resize-y"
              placeholder="Anything the doctor should know…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Spinner /> : <CheckCircle2 className="h-4 w-4" />}
              {editing ? 'Save changes' : 'Confirm booking'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast show={!!toast} message={toast ?? ''} />
    </div>
  );
}

function Section({
  title,
  items,
  onEdit,
  onDelete,
  muted,
}: {
  title: string;
  items: Appointment[];
  onEdit: (a: Appointment) => void;
  onDelete: (a: Appointment) => void;
  muted?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a, i) => (
          <div
            key={a.id}
            className={`card-hover animate-fade-up p-5 ${muted ? 'opacity-80' : ''}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(a)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(a)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-error-50 hover:text-error-600"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 font-display text-base font-bold text-ink-900">{a.doctor_name}</div>
            <div className="text-sm text-ink-500">{a.specialty ?? 'Consultation'}</div>
            <div className="mt-4 space-y-1.5 text-sm text-ink-600">
              <div className="flex items-center gap-2">
                <CalendarHeart className="h-4 w-4 text-primary-500" />
                {new Date(a.appointment_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-500" />
                {a.appointment_time}
              </div>
              {a.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  {a.location}
                </div>
              )}
              {a.reason && (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-primary-500" />
                  {a.reason}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
