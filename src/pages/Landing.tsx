import {
  Activity,
  ArrowRight,
  Bot,
  CalendarHeart,
  HeartPulse,
  LineChart,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
} from 'lucide-react';
import type { Route } from '../lib/router';
import { articles } from '../lib/articles';

export function Landing({ navigate }: { navigate: (n: Route['name']) => void }) {
  return (
    <div className="bg-aurora">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Health Companion
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Your health,
              <br />
              <span className="text-gradient">understood in minutes.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              Vita AI turns symptoms into clarity, books the right care, and keeps your medical
              history in one private place — so you always know the next right step.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate('signup')} className="btn-primary">
                Start free <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => navigate('symptoms')} className="btn-secondary">
                Try symptom checker
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary-600" /> Private &amp; secure
              </span>
              <span className="inline-flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary-600" /> Evidence-informed
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-600" /> 40k+ members
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-scale-in lg:pl-8">
            <HeroCard />
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
      </section>

      {/* Stats bar */}
      <section className="border-y border-ink-100 bg-white/60">
        <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {[
            { label: 'Symptoms analyzed', value: '1.2M+' },
            { label: 'Avg. response time', value: '<2s' },
            { label: 'Articles curated', value: '500+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">
            <Sparkles className="h-3.5 w-3.5" /> Everything you need
          </span>
          <h2 className="section-title">A complete health toolkit, in one app</h2>
          <p className="mt-4 text-ink-500">
            From the first symptom to the follow-up, Vita AI supports every step of your care
            journey with calm, trustworthy guidance.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => navigate(f.route)}
              className="card-hover group animate-fade-up p-6 text-left"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-ink-300 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/60 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <Activity className="h-3.5 w-3.5" /> How it works
            </span>
            <h2 className="section-title">From symptom to clarity in three steps</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 font-display text-lg font-extrabold text-white shadow-soft">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles preview */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> Knowledge library
            </span>
            <h2 className="section-title">Latest health articles</h2>
          </div>
          <button onClick={() => navigate('articles')} className="btn-secondary">
            Browse all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <button
              key={a.id}
              onClick={() => navigate('articles')}
              className="card-hover group animate-fade-up overflow-hidden text-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="chip bg-primary-50 text-primary-700">{a.category}</span>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink-900">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-ink-500">{a.excerpt}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 px-8 py-14 text-center shadow-glow sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-20" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Take charge of your health today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-50">
              Join thousands who use Vita AI to understand their symptoms, book care, and stay on
              top of their wellbeing.
            </p>
            <button
              onClick={() => navigate('signup')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary-700 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              Create your free account <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const features: {
  title: string;
  desc: string;
  icon: typeof Activity;
  route: Route['name'];
}[] = [
  {
    title: 'AI Symptom Checker',
    desc: 'Describe what you feel and get instant, guidance-ranked analysis with clear next steps.',
    icon: Stethoscope,
    route: 'symptoms',
  },
  {
    title: 'Book Appointments',
    desc: 'Schedule consultations with specialists and keep every visit organized in one place.',
    icon: CalendarHeart,
    route: 'appointments',
  },
  {
    title: 'Chat with AI Assistant',
    desc: 'Ask anything, anytime — from sleep tips to medication questions — and get grounded answers.',
    icon: MessageSquareHeart,
    route: 'chat',
  },
  {
    title: 'Medical History',
    desc: 'Securely store conditions, medications, allergies, and immunizations for quick reference.',
    icon: ShieldCheck,
    route: 'history',
  },
  {
    title: 'BMI & Wellness Tracking',
    desc: 'Calculate your BMI and understand what it means for your long-term health goals.',
    icon: LineChart,
    route: 'bmi',
  },
  {
    title: 'Emergency Contacts',
    desc: 'Keep loved ones and caregivers one tap away when it matters most.',
    icon: HeartPulse,
    route: 'emergency',
  },
];

const steps = [
  {
    title: 'Describe your symptoms',
    desc: 'Select what you are feeling — Vita AI listens and analyzes in seconds.',
  },
  {
    title: 'Get clear guidance',
    desc: 'Receive a ranked assessment with recommendations and an urgency level.',
  },
  {
    title: 'Act with confidence',
    desc: 'Book the right care, save the record, and track your recovery over time.',
  },
];

function HeroCard() {
  return (
    <div className="relative">
      <div className="card overflow-hidden p-0 shadow-glow">
        <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink-900">Vita AI Assistant</div>
              <div className="flex items-center gap-1.5 text-xs text-success-600">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500" /> Online
              </div>
            </div>
          </div>
          <span className="chip bg-primary-50 text-primary-700">Live</span>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-2.5 text-sm text-white">
              I have a mild headache and a slight fever since last night.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-ink-100 px-4 py-2.5 text-sm text-ink-800">
              That sounds uncomfortable. Based on what you describe, it may be an early viral
              illness. Rest, hydrate, and monitor your temperature. Want me to suggest next steps?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[60%] rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-2.5 text-sm text-white">
              Yes please.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2 rounded-2xl rounded-tl-sm bg-ink-100 px-4 py-3 text-sm text-ink-800">
              <p className="font-semibold">Here is a quick plan:</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" /> Hydrate with water &amp; clear fluids</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" /> Rest in a cool, quiet room</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" /> Consider paracetamol as directed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-ink-100 px-5 py-4">
          <div className="flex-1 rounded-xl bg-ink-100 px-4 py-2.5 text-sm text-ink-400">
            Ask anything about your health…
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 text-white">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Floating accents */}
      <div className="absolute -left-6 -top-6 hidden animate-float rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-100 sm:block">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-error-50 text-error-600">
            <HeartPulse className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs text-ink-500">Heart rate</div>
            <div className="text-sm font-bold text-ink-900">72 bpm</div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-4 hidden animate-float rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-100 sm:block" style={{ animationDelay: '1.5s' }}>
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary-50 text-secondary-600">
            <Syringe className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs text-ink-500">Next vaccine</div>
            <div className="text-sm font-bold text-ink-900">In 12 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
