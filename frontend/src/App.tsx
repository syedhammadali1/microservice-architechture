import { useEffect, useState } from 'react';
import { AuthResponse } from './api';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

const STORAGE_KEY = 'salon-auth';

export default function App() {
  const [auth, setAuth] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  if (!auth) {
    return <AuthForm onAuthSuccess={setAuth} />;
  }

  return <Dashboard auth={auth} onLogout={() => setAuth(null)} />;
}
