import { useMemo, useState } from 'react';
import { Activity, ArrowRight, LineChart, Ruler, Weight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import type { Route } from '../lib/router';
import { PageHeader } from '../components/Layout';

type BMICategory = {
  label: string;
  color: string;
  range: string;
  advice: string;
};

function classify(bmi: number): BMICategory {
  if (bmi < 18.5)
    return { label: 'Underweight', color: 'text-secondary-600', range: 'Below 18.5', advice: 'Consider adding nutrient-dense foods and strength training. Consult a dietitian for a tailored plan.' };
  if (bmi < 25)
    return { label: 'Healthy', color: 'text-success-600', range: '18.5 – 24.9', advice: 'Great work. Maintain balanced nutrition, regular activity, and consistent sleep.' };
  if (bmi < 30)
    return { label: 'Overweight', color: 'text-warning-600', range: '25.0 – 29.9', advice: 'Small sustainable habits help: more movement, whole foods, and mindful portions.' };
  return { label: 'Obese', color: 'text-error-600', range: '30.0 and above', advice: 'Consider speaking with a clinician about a safe, structured plan that fits your life.' };
}

export function BMI({ navigate }: { navigate: (n: Route['name']) => void }) {
  const { profile } = useAuth();
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState(profile?.height_cm ? String(profile.height_cm) : '170');
  const [weightKg, setWeightKg] = useState('68');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLb, setWeightLb] = useState('150');

  const bmi = useMemo(() => {
    let h = 0;
    let w = 0;
    if (unit === 'metric') {
      h = parseFloat(heightCm) / 100;
      w = parseFloat(weightKg);
    } else {
      const totalIn = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      h = totalIn * 0.0254;
      w = (parseFloat(weightLb) || 0) * 0.453592;
    }
    if (!h || !w || h <= 0 || w <= 0) return null;
    return w / (h * h);
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const category = bmi ? classify(bmi) : null;
  const bmiValue = bmi ? bmi.toFixed(1) : '—';

  // Marker position on the scale (15 to 40)
  const markerPct = bmi ? Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100)) : 0;

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="BMI Calculator"
        title="Know your healthy range"
        subtitle="Body Mass Index is a quick screening tool. It does not account for muscle mass or body composition."
        icon={<LineChart className="h-3.5 w-3.5" />}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="card animate-fade-up p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink-900">Your measurements</h3>
            <div className="inline-flex rounded-lg bg-ink-100 p-1">
              {(['metric', 'imperial'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                    unit === u ? 'bg-white text-primary-700 shadow-soft' : 'text-ink-500'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {unit === 'metric' ? (
              <>
                <Field icon={<Ruler className="h-4 w-4" />} label="Height (cm)">
                  <input type="number" className="input" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
                </Field>
                <Field icon={<Weight className="h-4 w-4" />} label="Weight (kg)">
                  <input type="number" className="input" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
                </Field>
              </>
            ) : (
              <>
                <Field icon={<Ruler className="h-4 w-4" />} label="Height">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" className="input" placeholder="ft" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
                    <input type="number" className="input" placeholder="in" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
                  </div>
                </Field>
                <Field icon={<Weight className="h-4 w-4" />} label="Weight (lb)">
                  <input type="number" className="input" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} />
                </Field>
              </>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-primary-50 p-4 text-xs leading-relaxed text-primary-800">
            <strong className="font-bold">Note:</strong> BMI is a screening tool, not a diagnosis.
            Very muscular individuals may have a high BMI with low body fat.
          </div>
        </div>

        {/* Result */}
        <div className="card animate-fade-up p-6 lg:col-span-3">
          <h3 className="font-display text-lg font-bold text-ink-900">Your result</h3>

          <div className="mt-6 flex flex-col items-center">
            <div className="relative grid h-44 w-44 place-items-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#e9eef3" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="url(#bmiGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={bmi ? 2 * Math.PI * 44 * (1 - Math.min(1, bmi / 40)) : 2 * Math.PI * 44}
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="bmiGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1eaba4" />
                    <stop offset="100%" stopColor="#5b80fb" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <div className="font-display text-4xl font-extrabold text-ink-900">{bmiValue}</div>
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">BMI</div>
              </div>
            </div>

            {category && (
              <div className="mt-5 animate-fade-up text-center">
                <span className={`font-display text-xl font-extrabold ${category.color}`}>
                  {category.label}
                </span>
                <p className="mt-2 max-w-md text-sm text-ink-600">{category.advice}</p>
              </div>
            )}
          </div>

          {/* Scale */}
          <div className="mt-8">
            <div className="relative h-3 rounded-full bg-gradient-to-r from-secondary-400 via-success-400 via-warning-400 to-error-400">
              <div
                className="absolute -top-1.5 h-6 w-1.5 -translate-x-1/2 rounded-full bg-ink-900 shadow-soft transition-all duration-700"
                style={{ left: `${markerPct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-ink-500">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: 'Underweight', color: 'bg-secondary-100 text-secondary-700', range: '< 18.5' },
                { label: 'Healthy', color: 'bg-success-100 text-success-700', range: '18.5–24.9' },
                { label: 'Overweight', color: 'bg-warning-100 text-warning-700', range: '25–29.9' },
                { label: 'Obese', color: 'bg-error-100 text-error-700', range: '≥ 30' },
              ].map((c) => (
                <div key={c.label} className={`rounded-xl px-3 py-2 text-center ${c.color}`}>
                  <div className="text-xs font-bold">{c.label}</div>
                  <div className="text-[11px] opacity-80">{c.range}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => navigate('chat')} className="btn-primary">
              <Activity className="h-4 w-4" /> Ask Vita AI for advice
            </button>
            <button onClick={() => navigate('articles')} className="btn-secondary">
              Read wellness articles <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label flex items-center gap-1.5">
        <span className="text-primary-500">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
