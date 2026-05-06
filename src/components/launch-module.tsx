'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LaunchModuleProps {
  variant?: 'hero' | 'section' | 'footer';
  className?: string;
}

export function LaunchModule({ variant = 'section', className = '' }: LaunchModuleProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // TODO: Connect to actual newsletter service
    // For now, simulate success
    await new Promise(resolve => setTimeout(resolve, 800));
    setStatus('success');
    setEmail('');
  };

  if (variant === 'hero') {
    return (
      <div className={`text-center ${className}`}>
        <p className="meta tracking-[0.25em]">Öppnar inför riksdagsvalet 2026</p>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {status === 'success' ? (
            <p className="text-sm text-[var(--text-secondary)]">
              Tack. Vi hör av oss när museet öppnar.
            </p>
          ) : (
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                className="flex-1 px-4 py-3 bg-transparent border border-[var(--border)] text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-strong)]"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Följ öppningen'}
              </button>
            </div>
          )}
        </motion.form>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <p className="meta tracking-[0.2em] mb-6">Följ öppningen</p>

        {status === 'success' ? (
          <p className="text-sm text-[var(--text-secondary)]">
            Tack. Vi hör av oss.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              className="flex-1 px-4 py-2 bg-transparent border border-[var(--border)] text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-strong)]"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2 border border-[var(--border-strong)] text-sm hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              {status === 'loading' ? '...' : '→'}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Default section variant
  return (
    <section className={`py-24 border-y border-[var(--border)] ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="meta tracking-[0.25em]">Öppnar inför riksdagsvalet 2026</p>

          <h2 className="mt-8 text-3xl md:text-4xl font-light italic">
            Var med från början.
          </h2>

          <p className="mt-6 text-[var(--text-secondary)] leading-relaxed">
            Valaffischen dokumenterar hur svenska partier har talat till väljarna
            sedan 1893. Få besked när museet öppnar — och tipsa gärna om affischer
            du vill ska finnas med.
          </p>

          {status === 'success' ? (
            <motion.p
              className="mt-10 text-sm text-[var(--text-secondary)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Tack. Vi hör av oss när museet öppnar.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                className="flex-1 px-5 py-3 bg-transparent border border-[var(--border)] text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-strong)]"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {status === 'loading' ? 'Skickar...' : 'Följ öppningen'}
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-[var(--text-secondary)]">
            <a href="mailto:david@surpriseventures.io" className="border-b border-current hover:opacity-70 transition-opacity">
              Tipsa om affischer →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
