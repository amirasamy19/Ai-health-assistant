import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  Save,
  Stethoscope,
  X,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase, type SymptomCheck } from '../lib/supabase';
import { analyzeSymptoms, healthDisclaimer } from '../lib/health';
import type { Route } from '../lib/router';
import { PageHeader } from '../components/Layout';
import { EmptyState, Spinner, Toast } from '../components/ui';

const allSymptoms = [
  'Fever', 'Chills', 'Headache', 'Migraine', 'Cough', 'Sore throat', 'Runny nose', 'Sneezing',
  'Shortness of breath', 'Chest pain', 'Tight chest', 'Palpitations', 'Nausea', 'Vomiting',
  'Diarrhea', 'Stomach pain', 'Abdominal cramps', 'Bloating', 'Rash', 'Itchy skin', 'Hives',
  'Fatigue', 'Dizziness', 'Lightheaded', 'Fainting', 'Back pain', 'Anxiety', 'Stress', 'Panic',
  'Sad mood', 'Trouble sleeping', 'Joint pain', 'Muscle ache', 'Loss of smell', 'Loss of taste',
];

export function SymptomChecker({ navigate }: { navigate: (n: Route['name']) => void }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ analysis: string; urgency: string; recommendations: string[] } | null>(null);
  const [history, setHistory] = useState<SymptomCheck[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from('symptom_checks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setHistory((data as SymptomCheck[]) ?? []);
      setLoadingHistory(false);
    })();
  }, [user]);

  const toggle = (s: string) => {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    setResult(null);
  };

  const addCustom = () => {
    const v = query.trim();
    if (v && !selected.includes(v)) {
      setSelected((prev) => [...prev, v]);
      setQuery('');
      setResult(null);
    }
  };

  const run = async () => {
    if (selected.length === 0) return;
    setAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 900)); // brief "thinking" delay
    const res = analyzeSymptoms(selected);
    setResult(res);
    setAnalyzing(false);
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  const save = async () => {
    if (!result || !user) return;
    const { data } = await supabase
      .from('symptom_checks')
      .insert({
        user_id: user.id,
        symptoms: selected,
        analysis: result.analysis,
        urgency: result.urgency,
        recommendations: result.recommendations,
      })
      .select('*')
      .maybeSingle();
    if (data) {
      setHistory((prev) => [data as SymptomCheck, ...prev]);
      setToast('Saved to your records');
      setTimeout(() => setToast(null), 2200);
    }
  };

  const filtered = allSymptoms.filter((s) => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="AI Symptom Checker"
        title="Understand what you're feeling"
        subtitle="Select your symptoms and let Vita AI provide ranked guidance and clear next steps."
        icon={<Stethoscope className="h-3.5 w-3.5" />}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Selector */}
        <div className="card animate-fade-up p-6 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {selected.length === 0 ? (
              <p className="text-sm text-ink-400">No symptoms selected yet.</p>
            ) : (
              selected.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  className="chip bg-primary-100 text-primary-800 transition-colors hover:bg-primary-200"
                >
                  {s} <X className="h-3 w-3" />
                </button>
              ))
            )}
          </div>

          <div className="mt-5 flex gap-2">
            <input
              className="input"
              placeholder="Search or add a symptom…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            />
            <button onClick={addCustom} className="btn-secondary shrink-0">
              Add
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {filtered.map((s) => {
              const active = selected.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  className={`chip transition-all ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                  }`}
                >
                  {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {s}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={run} disabled={selected.length === 0 || analyzing} className="btn-primary">
              {analyzing ? <Spinner /> : <Activity className="h-4 w-4" />}
              {analyzing ? 'Analyzing…' : 'Analyze symptoms'}
            </button>
            <button onClick={reset} className="btn-ghost">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-6">
          <div className="card animate-fade-up p-6">
            <h3 className="font-display text-lg font-bold text-ink-900">Result</h3>
            {analyzing ? (
              <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
                <Spinner className="h-8 w-8 text-primary-600" />
                <p className="text-sm text-ink-500">Analyzing your symptoms…</p>
              </div>
            ) : result ? (
              <div className="mt-4 animate-fade-up">
                <UrgencyBanner urgency={result.urgency} />
                <p className="mt-4 text-sm leading-relaxed text-ink-700">{result.analysis}</p>
                <div className="mt-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-ink-500">Recommendations</div>
                  <ul className="mt-2 space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
                  {healthDisclaimer}
                </div>
                {user && (
                  <button onClick={save} className="btn-secondary mt-4 w-full">
                    <Save className="h-4 w-4" /> Save to records
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink-500">
                Select your symptoms and run the analysis to see guidance here.
              </p>
            )}
          </div>

          {!user && (
            <div className="card animate-fade-up p-6 text-center">
              <p className="text-sm text-ink-600">Want to save your checks and track them over time?</p>
              <button onClick={() => navigate('signup')} className="btn-primary mt-4 w-full">
                Create an account <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {user && (
        <div className="mt-10">
          <h3 className="font-display text-lg font-bold text-ink-900">Saved checks</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingHistory ? (
              <div className="col-span-full flex justify-center py-8">
                <Spinner className="h-6 w-6 text-primary-600" />
              </div>
            ) : history.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={<Clock className="h-6 w-6" />}
                  title="No saved checks"
                  description="Your analyzed symptom checks will appear here once you save them."
                />
              </div>
            ) : (
              history.map((c) => (
                <div key={c.id} className="card-hover p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {c.symptoms.slice(0, 3).map((s) => (
                        <span key={s} className="chip bg-ink-100 text-ink-700">{s}</span>
                      ))}
                      {c.symptoms.length > 3 && (
                        <span className="chip bg-ink-100 text-ink-500">+{c.symptoms.length - 3}</span>
                      )}
                    </div>
                    <UrgencyBadge urgency={c.urgency} />
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-ink-600">{c.analysis}</p>
                  <div className="mt-3 text-xs text-ink-400">
                    {new Date(c.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Toast show={!!toast} message={toast ?? ''} />
    </div>
  );
}

function UrgencyBanner({ urgency }: { urgency: string }) {
  const map: Record<string, { cls: string; icon: typeof AlertTriangle; label: string }> = {
    low: { cls: 'bg-success-50 text-success-700 ring-success-100', icon: CheckCircle2, label: 'Low urgency' },
    moderate: { cls: 'bg-warning-50 text-warning-700 ring-warning-100', icon: AlertTriangle, label: 'Moderate urgency' },
    high: { cls: 'bg-error-50 text-error-700 ring-error-100', icon: AlertTriangle, label: 'High urgency — seek care' },
  };
  const c = map[urgency] ?? map.low;
  const Icon = c.icon;
  return (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ring-1 ${c.cls}`}>
      <Icon className="h-4 w-4" /> {c.label}
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const map: Record<string, string> = {
    low: 'bg-success-50 text-success-700',
    moderate: 'bg-warning-50 text-warning-700',
    high: 'bg-error-50 text-error-700',
  };
  return <span className={`chip ${map[urgency] ?? 'bg-ink-100 text-ink-700'}`}>{urgency}</span>;
}
