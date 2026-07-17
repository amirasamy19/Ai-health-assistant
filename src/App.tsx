import { AuthProvider, useAuth } from './lib/auth';
import { useRouter } from './lib/router';
import { Navbar, Footer, PageShell } from './components/Layout';
import { Spinner } from './components/ui';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { SymptomChecker } from './pages/SymptomChecker';
import { Appointments } from './pages/Appointments';
import { Chat } from './pages/Chat';
import { MedicalHistory } from './pages/MedicalHistory';
import { BMI } from './pages/BMI';
import { Articles } from './pages/Articles';
import { Profile } from './pages/Profile';
import { EmergencyContacts } from './pages/Emergency';

function AppRoutes() {
  const { route, navigate } = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-aurora">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-10 w-10 text-primary-600" />
          <p className="text-sm font-medium text-ink-500">Loading Vita AI…</p>
        </div>
      </div>
    );
  }

  const protectedRoutes = ['dashboard', 'appointments', 'chat', 'history', 'profile', 'emergency'];
  const needsAuth = protectedRoutes.includes(route.name);
  if (needsAuth && !user) {
    return <AuthPage mode="login" navigate={navigate} />;
  }

  let page: React.ReactNode;
  switch (route.name) {
    case 'landing':
      page = user ? <Dashboard navigate={navigate} /> : <Landing navigate={navigate} />;
      break;
    case 'login':
      page = user ? <Dashboard navigate={navigate} /> : <AuthPage mode="login" navigate={navigate} />;
      break;
    case 'signup':
      page = user ? <Dashboard navigate={navigate} /> : <AuthPage mode="signup" navigate={navigate} />;
      break;
    case 'dashboard':
      page = <Dashboard navigate={navigate} />;
      break;
    case 'symptoms':
      page = <SymptomChecker navigate={navigate} />;
      break;
    case 'appointments':
      page = <Appointments />;
      break;
    case 'chat':
      page = <Chat />;
      break;
    case 'history':
      page = <MedicalHistory />;
      break;
    case 'bmi':
      page = <BMI navigate={navigate} />;
      break;
    case 'articles':
      page = <Articles />;
      break;
    case 'profile':
      page = <Profile />;
      break;
    case 'emergency':
      page = <EmergencyContacts />;
      break;
    default:
      page = <Landing navigate={navigate} />;
  }

  const bare = route.name === 'login' || route.name === 'signup';

  return (
    <PageShell>
      {!bare && <Navbar route={route} navigate={navigate} />}
      <main className="flex-1">{page}</main>
      {!bare && <Footer navigate={navigate} />}
    </PageShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
