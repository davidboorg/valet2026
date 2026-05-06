'use client';

import { useState, useEffect } from 'react';

const CORRECT_PASSWORD = 'Olofpalme';
const STORAGE_KEY = 'valaffischen-auth';

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setIsAuthenticated(stored === 'true');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated - show site
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Login screen
  return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-white tracking-tight">
            Valaffischen
          </h1>
          <p className="mt-3 text-sm text-white/50">
            Förhandsvisning
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Lösenord"
              className="w-full px-4 py-3 bg-transparent border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/50"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs text-red-400">
                Fel lösenord
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
}
