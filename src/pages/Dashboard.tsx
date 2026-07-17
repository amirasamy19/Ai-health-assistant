import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarHeart,
  CalendarPlus,
  HeartPulse,
  LineChart,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';import { useAuth } from '../lib/auth';
import { supabase, type Appointment, type MedicalEntry, type SymptomCheck } from '../lib/supabase';
import type { Route } from '../lib/router';
import { PageHeader } from '../components/Layout';
import { EmptyState, Spinner } from '../components/ui';

export function Dashboard({ navigate }: { navigate: (n: Route['name']) => void }) {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [history, setHistory] = useState<MedicalEntry[]>([]);
  const [checks, setChecks] = useState<SymptomCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const [appts, hist, ch] = await Promise.all([
        supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: true }),
        supabase
          .from('medical_history')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_date', { ascending: false }),
        supabase
          .from('symptom_checks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);
      setAppointments((appts.data as Appointment[]) ?? []);
      setHistory((hist.data as MedicalEntry[]) ?? []);
      setChecks((ch.data as SymptomCheck[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const upcoming = appointments.filter(
    (a) => new Date(`${a.appointment_date}T00:00:00`) >= new Date(new Date().toDateString())
  );

  const firstName = (profile?.full_name ?? user?.email ?? 'there').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="Dashboard"
        title={`${greeting}, ${firstName}.`}
        subtitle="A snapshot of your health, upcoming care, and recent activity."
        icon={<Activity className="h-3.5 w-3.5" />}
      />

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a, i) => (
          <button
            key={a.label}
            onClick={() => navigate(a.route)}
            className="card-hover group animate-fade-up p-5 text-left"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
              <a.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-base font-bold text-ink-900">{a.label}</div>
            <div className="mt-1 text-xs text-ink-500">{a.desc}</div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Upcoming appointments */}
          <div className="card animate-fade-up p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink-900">Upcoming appointments</h3>
              <button
                onClick={() => navigate('appointments')}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                View all <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={<CalendarHeart className="h-6 w-6" />}
                  title="No upcoming visits"
                  description="Book your next consultation in a few taps."
                  action={
                    <button onClick={() => navigate('appointments')} className="btn-primary">
                      <CalendarPlus className="h-4 w-4" /> Book appointment
                    </button>
                  }
                />
              ) : (
                upcoming.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 rounded-xl border border-ink-100 p-4 transition-colors hover:bg-ink-50"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-ink-900">{a.doctor_name}</div>
                      <div className="truncate text-sm text-ink-500">
                        {a.specialty ?? 'Consultation'} · {a.location ?? 'Clinic'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-ink-900">
                        {new Date(a.appointment_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-ink-500">{a.appointment_time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats column */}
          <div className="space-y-6">
            <div className="card animate-fade-up p-6">
              <h3 className="font-display text-lg font-bold text-ink-900">Health snapshot</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatTile label="Appointments" value={appointments.length} icon={<CalendarHeart className="h-4 w-4" />} tone="primary" />
                <StatTile label="Records" value={history.length} icon={<ShieldCheck className="h-4 w-4" />} tone="secondary" />
                <StatTile label="Symptom checks" value={checks.length} icon={<Stethoscope className="h-4 w-4" />} tone="accent" />
                <StatTile label="Upcoming" value={upcoming.length} icon={<TrendingUp className="h-4 w-4" />} tone="success" />
              </div>
            </div>

            <div className="card animate-fade-up p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-base font-bold text-ink-900">Ask Vita AI</div>
                  <div className="text-xs text-ink-500">Always here to help</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-500">
                Wondering about a symptom, medication, or wellness goal? Start a conversation.
              </p>
              <button onClick={() => navigate('chat')} className="btn-primary mt-4 w-full">
                <MessageIcon /> Start chatting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      {!loading && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card animate-fade-up p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink-900">Recent symptom checks</h3>
              <button onClick={() => navigate('symptoms')} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                New check
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {checks.length === 0 ? (
                <p className="text-sm text-ink-500">No checks yet. Try the symptom checker to get started.</p>
              ) : (
                checks.slice(0, 3).map((c) => (
                  <div key={c.id} className="rounded-xl border border-ink-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {c.symptoms.slice(0, 3).map((s) => (
                          <span key={s} className="chip bg-ink-100 text-ink-700">{s}</span>
                        ))}
                      </div>
                      <UrgencyBadge urgency={c.urgency} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-500">{c.analysis}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card animate-fade-up p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink-900">Medical history</h3>
              <button onClick={() => navigate('history')} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                Manage
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-ink-500">No records yet. Add your first entry on the History page.</p>
              ) : (
                history.slice(0, 4).map((h) => (
                  <div key={h.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary-50 text-secondary-600">
                      <HeartPulse className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-ink-900">{h.title}</div>
                      <div className="text-xs capitalize text-ink-500">{h.entry_type}</div>
                    </div>
                    {h.recorded_date && (
                      <div className="text-xs text-ink-400">
                        {new Date(h.recorded_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const quickActions: { label: string; desc: string; icon: typeof Activity; route: Route['name'] }[] = [
  { label: 'Symptom Checker', desc: 'Analyze how you feel', icon: Stethoscope, route: 'symptoms' },
  { label: 'Book Appointment', desc: 'Schedule a visit', icon: CalendarPlus, route: 'appointments' },
  { label: 'Chat with AI', desc: 'Ask anything', icon: Bot, route: 'chat' },
  { label: 'Calculate BMI', desc: 'Know your range', icon: LineChart, route: 'bmi' },
];

function StatTile({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'primary' | 'secondary' | 'accent' | 'success';
}) {
  const tones = {
    primary: 'bg-primary-50 text-primary-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    accent: 'bg-accent-50 text-accent-700',
    success: 'bg-success-50 text-success-700',
  };
  return (
    <div className="rounded-xl border border-ink-100 p-3">
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}>{icon}</div>
      <div className="mt-2 font-display text-xl font-extrabold text-ink-900">{value}</div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  );
}

function MessageIcon() {
  return <ArrowRight className="h-4 w-4" />;
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const map: Record<string, string> = {
    low: 'bg-success-50 text-success-700',
    moderate: 'bg-warning-50 text-warning-700',
    high: 'bg-error-50 text-error-700',
  };
  return <span className={`chip ${map[urgency] ?? 'bg-ink-100 text-ink-700'}`}>{urgency}</span>;
}
