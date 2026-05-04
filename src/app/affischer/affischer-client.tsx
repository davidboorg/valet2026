'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { Poster } from '@/lib/types';
import { PosterGrid } from '@/components/poster-grid';
import { RhetoricLegend, enrichWithSampleRhetoric } from '@/components/rhetoric-overlay';

interface AffischerClientProps {
  posters: Poster[];
  totalPosters: number;
  currentPage: number;
  totalPages: number;
  activeFilters: Array<{ type: string; label: string; clearUrl: string }>;
  buildFilterUrl: (updates: Record<string, string | undefined>) => string;
}

export function AffischerClient({
  posters,
  totalPosters: _totalPosters, // Used by parent for stats display
  currentPage,
  totalPages,
  activeFilters,
  buildFilterUrl,
}: AffischerClientProps) {
  const [rhetoricMode, setRhetoricMode] = useState(false);

  // Enrich posters with sample rhetoric data when in rhetoric mode
  const displayPosters = useMemo(() => {
    if (rhetoricMode) {
      return enrichWithSampleRhetoric(posters);
    }
    return posters;
  }, [posters, rhetoricMode]);

  return (
    <>
      {/* Rhetoric mode toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRhetoricMode(!rhetoricMode)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border transition-opacity ${
              rhetoricMode
                ? 'border-[var(--border-strong)] text-[var(--text-primary)] bg-[var(--bg-secondary)]'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Retorik-läge
          </button>

          {rhetoricMode && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="meta"
            >
              AI-analys aktiv
            </motion.span>
          )}
        </div>

        {/* Link to ord-explorer */}
        {rhetoricMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link
              href="/ord"
              className="text-sm text-[var(--text-secondary)] border-b border-current pb-0.5 hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              Utforska ord-molnet
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Rhetoric legend */}
      <AnimatePresence>
        {rhetoricMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <RhetoricLegend />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Link
              key={`${filter.type}-${filter.label}`}
              href={filter.clearUrl}
              className="inline-flex items-center gap-1 px-3 py-1 border border-[var(--border-strong)] text-[var(--text-primary)] text-sm hover:opacity-70 transition-opacity"
            >
              {filter.label}
              <span className="ml-1">×</span>
            </Link>
          ))}
          <Link
            href="/affischer"
            className="inline-flex items-center px-3 py-1 text-sm text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
          >
            Rensa alla
          </Link>
        </div>
      )}

      {/* Results */}
      {displayPosters.length > 0 ? (
        <PosterGrid posters={displayPosters} showRhetoric={rhetoricMode} />
      ) : (
        <div className="py-24 text-center">
          <p className="meta">Ingen träff</p>
          <p className="mt-4 editorial-quote text-[var(--text-secondary)] max-w-2xl mx-auto">
            Inga affischer matchar dina filter.
          </p>
          <Link
            href="/affischer"
            className="inline-flex items-center mt-8 text-sm border-b border-current pb-0.5 hover:opacity-70 transition-opacity"
          >
            Visa alla affischer →
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-16 flex items-center justify-center gap-4"
          aria-label="Sidnavigering"
        >
          {currentPage > 1 && (
            <Link
              href={buildFilterUrl({ page: String(currentPage - 1) })}
              className="px-5 py-2 border border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
            >
              ← Föregående
            </Link>
          )}

          <span className="meta px-4 py-2">
            Sida {currentPage} av {totalPages}
          </span>

          {currentPage < totalPages && (
            <Link
              href={buildFilterUrl({ page: String(currentPage + 1) })}
              className="px-5 py-2 border border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
            >
              Nästa →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
