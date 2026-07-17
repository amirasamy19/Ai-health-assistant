import { useEffect, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  HeartPulse,
  Pill,
  Plus,
  Pencil,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TestTube,
  Trash2,
  AlertTriangle,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type MedicalEntry } from '../lib/supabase';
import { PageHeader } from '../components/Layout';
import { EmptyState, Modal, Spinner, Toast } from '../components/ui';

const entryTypes = [
  { value: 'condition', label: 'Condition', icon: HeartPulse },
  { value: 'medication', label: 'Medication', icon: Pill },
  { value: 'allergy', label: 'Allergy', icon: AlertTriangle },
  { value: 'surgery', label: 'Surgery', icon: Stethoscope },
  { value: 'immunization', label: 'Immunization', icon: Syringe },
  { value: 'test', label: 'Test / Lab', icon: TestTube },
];

const severityLevels = ['Mild', 'Moderate', 'Severe', 'N/A'];

const typeStyles: Record<string, string> = {
  condition: 'bg-error-50 text-error-700',
  medication: 'bg-secondary-50 text-secondary-700',
  allergy: 'bg-warning-50 text-warning-700',
  surgery: 'bg-primary-50 text-primary-700',
  immunization: 'bg-success-50 text-success-700',
  test: 'bg-accent-50 text-accent-700',
};

type FormState = {
  entry_type: string;
  title: string;
  description: string;
  recorded_date: string;
  severity: string;
};

const emptyForm: FormState = {
  entry_type: 'condition',
  title: '',
  description: '',
  recorded_date: '',
  severity: 'N/A',
};

export function MedicalHistory() {
  const { user } = useAuth();
  const [items, setItems] = useState<MedicalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MedicalEntry | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('medical_history')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_date', { ascending: false });
    setItems((data as MedicalEntry[]) ?? []);
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

  const openEdit = (e: MedicalEntry) => {
    setEditing(e);
    setForm({
      entry_type: e.entry_type,
      title: e.title,
      description: e.description ?? '',
      recorded_date: e.recorded_date ?? '',
      severity: e.severity ?? 'N/A',
    });
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      entry_type: form.entry_type,
      title: form.title,
      description: form.description || null,
      recorded_date: form.recorded_date || null,
      severity: form.severity === 'N/A' ? null : form.severity,
    };
    if (editing) {
      await supabase.from('medical_history').update(payload).eq('id', editing.id);
      setToast('Record updated');
    } else {
      await supabase.from('medical_history').insert(payload);
      setToast('Record added');
    }
    setSaving(false);
    setOpen(false);
    setTimeout(() => setToast(null), 2200);
    load();
  };

  const remove = async (e: MedicalEntry) => {
    await supabase.from('medical_history').delete().eq('id', e.id);
    setToast('Record deleted');
    setTimeout(() => setToast(null), 2200);
    load();
  };

  const filtered = filter === 'all' ? items : items.filter((i) => i.entry_type === filter);

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="Medical History"
        title="Your complete health record"
        subtitle="Keep conditions, medications, allergies, surgeries, immunizations, and tests in one private place."
        icon={<ShieldCheck className="h-3.5 w-3.5" />}
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          {entryTypes.map((t) => (
            <FilterChip
              key={t.value}
              label={t.label}
              active={filter === t.value}
              onClick={() => setFilter(t.value)}
            />
          ))}
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> Add record
        </button>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<ShieldCheck className="h-6 w-6" />}
            title="No records yet"
            description="Add your first medical record to start building your health history."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus className="h-4 w-4" /> Add record
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e, i) => {
            const type = entryTypes.find((t) => t.value === e.entry_type);
            const Icon = type?.icon ?? UserIcon;
            return (
              <div
                key={e.id}
                className="card-hover animate-fade-up p-5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${typeStyles[e.entry_type] ?? 'bg-ink-100 text-ink-700'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(e)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(e)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-error-50 hover:text-error-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 font-display text-base font-bold text-ink-900">{e.title}</div>
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {type?.label ?? e.entry_type}
                </div>
                {e.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-ink-500">{e.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
                  {e.recorded_date && (
                    <span>{new Date(e.recorded_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  )}
                  {e.severity && <span className="chip bg-ink-100 text-ink-700">{e.severity}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit record' : 'Add medical record'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {entryTypes.map((t) => {
                const active = form.entry_type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, entry_type: t.value }))}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${
                      active
                        ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500'
                        : 'border-ink-200 text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    <t.icon className="h-5 w-5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              placeholder="e.g. Hypertension, Lisinopril 10mg"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[80px] resize-y"
              placeholder="Notes, dosage, context…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                className="input"
                value={form.recorded_date}
                onChange={(e) => setForm((f) => ({ ...f, recorded_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Severity</label>
              <select
                className="input"
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
              >
                {severityLevels.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Spinner /> : <CheckCircle2 className="h-4 w-4" />}
              {editing ? 'Save changes' : 'Add record'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast show={!!toast} message={toast ?? ''} />
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`chip transition-all ${
        active ? 'bg-primary-600 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
      }`}
    >
      {label}
    </button>
  );
}
