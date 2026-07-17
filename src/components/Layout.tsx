import { useEffect, useState, type ReactNode } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import type { Route } from '../lib/router';

type NavItem = { name: Route['name']; label: string };

const publicNav: NavItem[] = [
  { name: 'symptoms', label: 'Symptom Checker' },
  { name: 'articles', label: 'Articles' },
  { name: 'bmi', label: 'BMI' },
];

const appNav: NavItem[] = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'symptoms', label: 'Symptoms' },
  { name: 'appointments', label: 'Appointments' },
  { name: 'chat', label: 'AI Chat' },
  { name: 'history', label: 'History' },
  { name: 'bmi', label: 'BMI' },
  { name: 'articles', label: 'Articles' },
  { name: 'emergency', label: 'Emergency' },
];

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2.5 focus:outline-none">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft transition-transform group-hover:scale-105">
        <Activity className="h-5 w-5" strokeWidth={2.5} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-white" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink-900">
        Vita<span className="text-primary-600">AI</span>
      </span>
    </button>
  );
}

export function Navbar({ route, navigate }: { route: Route; navigate: (n: Route['name']) => void }) {
  const { user, profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const isApp = !!user;
  const items = isApp ? appNav : publicNav;
  const isActive = (n: Route['name']) => route.name === n;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo onClick={() => navigate(isApp ? 'dashboard' : 'landing')} />

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.name)}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(item.name)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isApp ? (
            <>
              <button
                onClick={() => navigate('profile')}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-primary-700">
                  {(profile?.full_name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate">
                  {profile?.full_name ?? 'Account'}
                </span>
              </button>
              <button onClick={signOut} className="btn-secondary">
                Sign out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('login')} className="btn-ghost">
                Log in
              </button>
              <button onClick={() => navigate('signup')} className="btn-primary">
                Get started
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-ink-200 text-ink-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="container-page pb-4">
            <div className="card animate-scale-in p-3">
              <div className="grid gap-1">
                {items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.name)}
                    className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      isActive(item.name)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-ink-700 hover:bg-ink-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-2 border-t border-ink-100 pt-3">
                {isApp ? (
                  <>
                    <button onClick={() => navigate('profile')} className="btn-secondary w-full">
                      Profile
                    </button>
                    <button onClick={signOut} className="btn-secondary w-full">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate('login')} className="btn-secondary w-full">
                      Log in
                    </button>
                    <button onClick={() => navigate('signup')} className="btn-primary w-full">
                      Get started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer({ navigate }: { navigate: (n: Route['name']) => void }) {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo onClick={() => navigate('landing')} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              Vita AI is your intelligent health companion — symptom guidance, appointment booking,
              and trusted wellness knowledge, all in one place.
            </p>
            <p className="mt-4 text-xs text-ink-400">
              Not a medical device. Always consult a qualified healthcare professional.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-ink-900">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li><button onClick={() => navigate('symptoms')} className="hover:text-primary-600">Symptom Checker</button></li>
              <li><button onClick={() => navigate('appointments')} className="hover:text-primary-600">Appointments</button></li>
              <li><button onClick={() => navigate('chat')} className="hover:text-primary-600">AI Assistant</button></li>
              <li><button onClick={() => navigate('bmi')} className="hover:text-primary-600">BMI Calculator</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-ink-900">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li><button onClick={() => navigate('articles')} className="hover:text-primary-600">Health Articles</button></li>
              <li><button onClick={() => navigate('history')} className="hover:text-primary-600">Medical History</button></li>
              <li><button onClick={() => navigate('emergency')} className="hover:text-primary-600">Emergency Contacts</button></li>
              <li><button onClick={() => navigate('profile')} className="hover:text-primary-600">Profile</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Vita AI. For educational use only.</p>
          <p>Built with care for your wellbeing.</p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="animate-fade-up">
      {eyebrow && (
        <span className="section-eyebrow">
          {icon}
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 max-w-2xl text-base text-ink-500">{subtitle}</p>}
    </div>
  );
}
