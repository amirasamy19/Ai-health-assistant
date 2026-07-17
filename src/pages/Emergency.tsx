import { useEffect, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  HeartPulse,
  Mail,
  Pencil,
  Phone,
  Plus,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type EmergencyContact } from '../lib/supabase';
import { PageHeader } from '../components/Layout';
import { EmptyState, Modal, Spinner, Toast } from '../components/ui';

const relationships = ['Spouse', 'Parent', 'Child', 'Sibling', 'Partner', 'Friend', 'Doctor', 'Caregiver', 'Other'];

type FormState = {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  is_primary: boolean;
};

const emptyForm: FormState = { name: '', relationship: '', phone: '', email: '', is_primary: false };

export function EmergencyContacts() {
  const { user } = useAuth();
  const [items, setItems] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false });
    setItems((data as EmergencyContact[]) ?? []);
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

  const openEdit = (c: EmergencyContact) => {
    setEditing(c);
    setForm({
      name: c.name,
      relationship: c.relationship ?? '',
      phone: c.phone,
      email: c.email ?? '',
      is_primary: c.is_primary,
    });
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    if (form.is_primary) {
      await supabase.from('emergency_contacts').update({ is_primary: false }).eq('user_id', user.id);
    }
    const payload = {
      user_id: user.id,
      name: form.name,
      relationship: form.relationship || null,
      phone: form.phone,
      email: form.email || null,
      is_primary: form.is_primary,
    };
    if (editing) {
      await supabase.from('emergency_contacts').update(payload).eq('id', editing.id);
      setToast('Contact updated');
    } else {
      await supabase.from('emergency_contacts').insert(payload);
      setToast('Contact added');
    }
    setSaving(false);
    setOpen(false);
    setTimeout(() => setToast(null), 2200);
    load();
  };

  const remove = async (c: EmergencyContact) => {
    await supabase.from('emergency_contacts').delete().eq('id', c.id);
    setToast('Contact removed');
    setTimeout(() => setToast(null), 2200);
    load();
  };

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="Emergency Contacts"
        title="People who matter most"
        subtitle="Keep trusted contacts one tap away so help is always within reach."
        icon={<HeartPulse className="h-3.5 w-3.5" />}
      />

      {/* Emergency banner */}
      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-error-600 to-error-500 p-6 text-white shadow-soft sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
            <HeartPulse className="h-6 w-6" />
          </span>
          <div>
            <div className="font-display text-lg font-bold">In an emergency</div>
            <div className="text-sm text-error-50">Call your local emergency number immediately.</div>
          </div>
        </div>
        <a
          href="tel:911"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-error-700 transition-transform hover:-translate-y-0.5"
        >
          <Phone className="h-4 w-4" /> Call 911
        </a>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> Add contact
        </button>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No emergency contacts yet"
            description="Add a trusted person so they are reachable when it matters most."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus className="h-4 w-4" /> Add contact
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <div
              key={c.id}
              className={`card-hover animate-fade-up p-5 ${c.is_primary ? 'ring-2 ring-primary-300' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${c.is_primary ? 'bg-primary-100 text-primary-700' : 'bg-ink-100 text-ink-600'}`}>
                  <HeartPulse className="h-5 w-5" />
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(c)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-error-50 hover:text-error-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="font-display text-base font-bold text-ink-900">{c.name}</div>
                {c.is_primary && (
                  <span className="chip bg-primary-50 text-primary-700">
                    <Star className="h-3 w-3" /> Primary
                  </span>
                )}
              </div>
              {c.relationship && (
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{c.relationship}</div>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-ink-700 hover:text-primary-600">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-50 text-primary-600">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  {c.phone}
                </a>
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-ink-700 hover:text-primary-600">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary-50 text-secondary-600">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    {c.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit contact' : 'Add emergency contact'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Full name" />
          </div>
          <div>
            <label className="label">Relationship</label>
            <select className="input" value={form.relationship} onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}>
              <option value="">Select…</option>
              {relationships.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required placeholder="+1 555 0100" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="optional" />
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-ink-200 p-3">
            <input type="checkbox" checked={form.is_primary} onChange={(e) => setForm((f) => ({ ...f, is_primary: e.target.checked }))} className="h-4 w-4 rounded accent-primary-600" />
            <span className="text-sm font-medium text-ink-700">Set as primary emergency contact</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Spinner /> : <CheckCircle2 className="h-4 w-4" />}
              {editing ? 'Save changes' : 'Add contact'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast show={!!toast} message={toast ?? ''} />
    </div>
  );
}
