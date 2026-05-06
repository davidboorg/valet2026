'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from './mobile-nav';

const NAV_ITEMS = [
  { href: '/affischer', label: 'Samlingen' },
  { href: '/tidslinje', label: 'Tidslinje' },
  {
    label: 'Analys',
    children: [
      { href: '/ord', label: 'Språket', description: 'Ord och slagord genom 130 år' },
      { href: '/tonlage', label: 'Tonlägen', description: 'Retoriska grepp och känslolägen' },
    ],
  },
  { href: '/om', label: 'Om' },
];

export function Header() {
  const pathname = usePathname();
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAnalysisOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on route change - track previous pathname
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- valid pattern for closing dropdown on navigation
      setAnalysisOpen(false);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  const isAnalysisActive = pathname === '/ord' || pathname === '/tonlage';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logotyp — ikon + wordmark */}
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
          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => {
              // Dropdown for Analys
              if ('children' in item) {
                return (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setAnalysisOpen(!analysisOpen)}
                      className={`flex items-center gap-1.5 text-sm transition-opacity ${
                        isAnalysisActive
                          ? 'text-[var(--text-primary)] font-medium'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      aria-expanded={analysisOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg
                        className={`w-3 h-3 transition-transform ${analysisOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {analysisOpen && item.children && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border)] shadow-lg">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-5 py-4 border-b border-[var(--border)] last:border-b-0 transition-colors ${
                                isChildActive
                                  ? 'bg-[var(--bg-secondary)]'
                                  : 'hover:bg-[var(--bg-secondary)]'
                              }`}
                            >
                              <span className={`block text-sm ${isChildActive ? 'font-medium' : ''}`}>
                                {child.label}
                              </span>
                              <span className="block text-xs text-[var(--text-secondary)] mt-1">
                                {child.description}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular link
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-opacity ${
                    isActive
                      ? 'text-[var(--text-primary)] font-medium border-b border-[var(--border-strong)] pb-0.5'
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
