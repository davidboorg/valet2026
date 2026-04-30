'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from './mobile-nav';

const NAV_ITEMS = [
  { href: '/affischer', label: 'Samlingen' },
  { href: '/tidslinje', label: 'Tidslinje' },
  { href: '/ord', label: 'Ord-explorer', isHighlighted: true },
  { href: '/tonlage', label: 'Tonlägen', isHighlighted: true },
  { href: '/partier', label: 'Partier' },
  { href: '/utstallningar', label: 'Utställningar' },
  { href: '/om', label: 'Om' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logotyp — ikon (affisch på käpp) + wordmark + tagline */}
          <Link
            href="/"
            className="group flex items-center gap-3 leading-none"
            aria-label="Valaffischen — hem"
          >
            <svg
              viewBox="0 0 100 140"
              className="h-12 w-[34px] shrink-0 text-[var(--text-primary)] transition-opacity group-hover:opacity-70"
              aria-hidden="true"
            >
              <path d="M 12 6 L 88 6 L 88 92 L 75 105 L 12 105 Z" fill="currentColor" />
              <path d="M 88 92 L 75 105 L 88 105 Z" fill="var(--bg-primary)" />
              <line x1="88" y1="92" x2="75" y2="105" stroke="currentColor" strokeWidth="0.8" />
              <rect x="49" y="105" width="2" height="32" fill="currentColor" />
            </svg>

            <div className="flex flex-col leading-none">
              <span className="text-2xl font-medium tracking-tight text-[var(--text-primary)] transition-opacity group-hover:opacity-70">
                Valaffischen
              </span>
              <span className="mt-1.5 text-[9px] font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)]">
                Ett digitalt museum
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden sm:flex items-center gap-8">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? 'text-[var(--accent)] font-medium'
                      : item.isHighlighted
                        ? 'text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
