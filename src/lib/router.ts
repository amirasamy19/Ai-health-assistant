import { useEffect, useState, useCallback } from 'react';

export type Route =
  | { name: 'landing' }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'dashboard' }
  | { name: 'symptoms' }
  | { name: 'appointments' }
  | { name: 'chat' }
  | { name: 'history' }
  | { name: 'bmi' }
  | { name: 'articles' }
  | { name: 'profile' }
  | { name: 'emergency' };

const routeMap: Record<string, Route['name']> = {
  '': 'landing',
  '/': 'landing',
  login: 'login',
  signup: 'signup',
  dashboard: 'dashboard',
  symptoms: 'symptoms',
  appointments: 'appointments',
  chat: 'chat',
  history: 'history',
  bmi: 'bmi',
  articles: 'articles',
  profile: 'profile',
  emergency: 'emergency',
};

function parse(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  const name = routeMap[raw] ?? 'landing';
  return { name } as Route;
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parse());

  useEffect(() => {
    const onHash = () => {
      setRoute(parse());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((name: Route['name']) => {
    window.location.hash = name === 'landing' ? '/' : `/${name}`;
  }, []);

  return { route, navigate };
}
