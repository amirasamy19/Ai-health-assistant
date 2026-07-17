import { useState, type FormEvent } from 'react';
import { ArrowRight, HeartPulse, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../lib/auth';
import type { Route } from '../lib/router';
import { Logo } from '../components/Layout';
import { Spinner } from '../components/ui';

export function AuthPage({
  mode,
  navigate,
}: {
  mode: 'login' | 'signup';
  navigate: (n: Route['name']) => void;
}) {
  const { signIn, signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = isSignup
      ? await signUp(email, password, fullName)
      : await signIn(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      navigate('dashboard');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-aurora">
      <div className="container-page grid min-h-screen items-center gap-12 py-12 lg:grid-cols-2">
        {/* Left brand panel */}
        <div className="hidden flex-col justify-between lg:flex">
          <Logo onClick={() => navigate('landing')} />
          <div className="animate-fade-up">
            <span className="section-eyebrow">
              <HeartPulse className="h-3.5 w-3.5" /> Welcome to Vita AI
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-ink-900">
              Your intelligent
              <br />
              <span className="text-gradient">health companion.</span>
            </h1>
            <p className="mt-5 max-w-md text-ink-600">
              Sign in to access your dashboard, AI symptom guidance, appointments, and your complete
              medical history — all private to you.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink-600">
              {['Private & secure by default', 'AI guidance in seconds', 'All your care in one place'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-100 text-primary-700">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-ink-400">Not a medical device. Always consult a professional.</p>
        </div>

        {/* Form panel */}
        <div className="flex justify-center lg:justify-end">
          <div className="card w-full max-w-md animate-scale-in p-7 sm:p-8">
            <div className="lg:hidden">
              <Logo onClick={() => navigate('landing')} />
            </div>
            <h2 className="mt-6 font-display text-2xl font-extrabold text-ink-900 lg:mt-0">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              {isSignup
                ? 'Start your health journey in under a minute.'
                : 'Sign in to continue to your dashboard.'}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {isSignup && (
                <div>
                  <label className="label">Full name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      className="input pl-10"
                      placeholder="Jordan Avery"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email"
                    className="input pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-700 ring-1 ring-error-100">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <Spinner /> : isSignup ? 'Create account' : 'Sign in'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-500">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => navigate(isSignup ? 'login' : 'signup')}
                className="font-bold text-primary-600 hover:text-primary-700"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
