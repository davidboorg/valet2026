'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { WordCloud, WordDetail } from '@/components/word-cloud';
import type { WordCloudItem } from '@/lib/word-analysis';

interface OrdExplorerClientProps {
  words: WordCloudItem[];
  parties: string[];
  decades: number[];
}

export function OrdExplorerClient({ words, parties, decades }: OrdExplorerClientProps) {
  const [selectedWord, setSelectedWord] = useState<WordCloudItem | null>(null);
  const [filterParty, setFilterParty] = useState<string | null>(null);
  const [filterDecade, setFilterDecade] = useState<number | null>(null);
  const [colorByParty, setColorByParty] = useState(false);

  // Filter words based on selected filters
  const filteredWords = useMemo(() => {
    return words.filter(word => {
      if (filterParty && !word.parties.includes(filterParty)) {
        return false;
      }
      if (filterDecade) {
        const hasYearInDecade = word.years.some(
          year => year >= filterDecade && year < filterDecade + 10
        );
        if (!hasYearInDecade) return false;
      }
      return true;
    });
  }, [words, filterParty, filterDecade]);

  const handleWordClick = (word: WordCloudItem) => {
    setSelectedWord(prev => prev?.text === word.text ? null : word);
  };

  const clearFilters = () => {
    setFilterParty(null);
    setFilterDecade(null);
    setSelectedWord(null);
  };

  const hasFilters = filterParty || filterDecade;

  return (
    <section className="py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Decade filter */}
            <div className="relative">
              <select
                value={filterDecade || ''}
                onChange={(e) => setFilterDecade(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none px-4 py-2 pr-10 bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] cursor-pointer hover:border-[var(--border-strong)] transition-colors"
              >
                <option value="">Alla årtionden</option>
                {decades.map(decade => (
                  <option key={decade} value={decade}>
                    {decade}-talet
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Party filter */}
            <div className="relative">
              <select
                value={filterParty || ''}
                onChange={(e) => setFilterParty(e.target.value || null)}
                className="appearance-none px-4 py-2 pr-10 bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] cursor-pointer hover:border-[var(--border-strong)] transition-colors"
              >
                <option value="">Alla partier</option>
                {parties.map(party => (
                  <option key={party} value={party}>
                    {party}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Color toggle */}
            <button
              onClick={() => setColorByParty(!colorByParty)}
              className={`px-4 py-2 text-sm border transition-colors ${
                colorByParty
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
              }`}
            >
              Färg per parti
            </button>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Rensa filter
              </button>
            )}
          </div>

          {/* Word count */}
          <p className="text-sm text-[var(--text-secondary)]">
            Visar {filteredWords.length} av {words.length} ord
          </p>
        </div>

        {/* Active filters display */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              {filterDecade && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--accent-subtle)] text-[var(--accent)] text-sm">
                  {filterDecade}-talet
                  <button
                    onClick={() => setFilterDecade(null)}
                    className="ml-1 hover:text-[var(--accent-hover)]"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterParty && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--accent-subtle)] text-[var(--accent)] text-sm">
                  {filterParty}
                  <button
                    onClick={() => setFilterParty(null)}
                    className="ml-1 hover:text-[var(--accent-hover)]"
                  >
                    ×
                  </button>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Word cloud */}
        {filteredWords.length > 0 ? (
          <WordCloud
            words={filteredWords}
            onWordClick={handleWordClick}
            selectedWord={selectedWord?.text}
            colorByParty={colorByParty}
          />
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg text-[var(--text-secondary)]">
              Inga ord matchar de valda filtren.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[var(--accent)] hover:underline"
            >
              Visa alla ord
            </button>
          </div>
        )}

        {/* Selected word detail */}
        <AnimatePresence>
          {selectedWord && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              <WordDetail
                word={selectedWord}
                onClose={() => setSelectedWord(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explore more */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-wrap justify-center gap-4">
          <Link
            href="/affischer"
            className="px-6 py-3 bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Utforska affischerna
          </Link>
          <Link
            href="/tidslinje"
            className="px-6 py-3 border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Se tidslinjen
          </Link>
        </div>
      </div>
    </section>
  );
}
