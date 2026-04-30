'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordCloudItem } from '@/lib/word-analysis';

interface WordCloudProps {
  words: WordCloudItem[];
  onWordClick?: (word: WordCloudItem) => void;
  selectedWord?: string | null;
  colorByParty?: boolean;
}

// Party colors for word highlighting
const PARTY_COLORS: Record<string, string> = {
  'Socialdemokraterna': '#E8112D',
  'Moderaterna': '#52BDEC',
  'Centerpartiet': '#009933',
  'Vänsterpartiet': '#DA291C',
  'Liberalerna': '#006AB3',
  'Kristdemokraterna': '#000077',
  'Miljöpartiet': '#83CF39',
  'Sverigedemokraterna': '#DDDD00',
  'Högerpartiet': '#1B365D',
  'Bondeförbundet': '#006B3F',
  'Folkpartiet': '#006AB3',
};

function getWordColor(word: WordCloudItem, colorByParty: boolean): string {
  if (!colorByParty || word.parties.length === 0) {
    // Default warm palette
    return 'var(--text-primary)';
  }

  // Use the color of the most associated party
  const primaryParty = word.parties[0];
  return PARTY_COLORS[primaryParty] || 'var(--text-primary)';
}

function getWordSize(value: number, maxValue: number): number {
  // Scale from 14px to 72px based on frequency
  const minSize = 14;
  const maxSize = 72;
  const normalized = Math.sqrt(value / maxValue); // Use sqrt for better distribution
  return minSize + normalized * (maxSize - minSize);
}

export function WordCloud({ words, onWordClick, selectedWord, colorByParty = false }: WordCloudProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  // Guard mot tom data — Math.max(...[]) returnerar -Infinity och kraschar layout.
  const maxValue = useMemo(
    () => (words.length > 0 ? Math.max(...words.map(w => w.value)) : 1),
    [words]
  );

  // Sort words for display - mix of random and size-based for visual interest
  const sortedWords = useMemo(() => {
    // Create a stable but varied order
    return [...words].sort((a, b) => {
      // Primary sort: larger words first (but with some variance)
      const sizeA = getWordSize(a.value, maxValue);
      const sizeB = getWordSize(b.value, maxValue);

      // Add some deterministic randomness based on word
      const hashA = a.text.charCodeAt(0) % 3;
      const hashB = b.text.charCodeAt(0) % 3;

      return (sizeB + hashB * 10) - (sizeA + hashA * 10);
    });
  }, [words, maxValue]);

  // Tom state — visa kuratoriskt meddelande istället för att krascha.
  // Måste komma EFTER alla useMemo så Hooks-ordning är konstant.
  if (words.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="meta">Ord-explorer</p>
        <p className="mt-4 editorial-quote text-[var(--text-secondary)] max-w-2xl mx-auto">
          Här samlas ord ur affischernas slogans när AI-analysen är klar.
        </p>
      </div>
    );
  }

  return (
    <div className="relative py-12">
      {/* Word cloud container */}
      <div
        className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-5xl mx-auto"
        role="list"
        aria-label="Ordmoln över vanliga ord i valaffischer"
      >
        <AnimatePresence mode="popLayout">
          {sortedWords.map((word, index) => {
            const size = getWordSize(word.value, maxValue);
            const isSelected = selectedWord === word.text;
            const isHovered = hoveredWord === word.text;
            const isOtherSelected = selectedWord && selectedWord !== word.text;
            const color = getWordColor(word, colorByParty);

            return (
              <motion.button
                key={word.text}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: isOtherSelected ? 0.3 : 1,
                  scale: isSelected || isHovered ? 1.1 : 1,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.01,
                  layout: { duration: 0.3 }
                }}
                onClick={() => onWordClick?.(word)}
                onMouseEnter={() => setHoveredWord(word.text)}
                onMouseLeave={() => setHoveredWord(null)}
                className="relative px-2 py-1 cursor-pointer transition-colors duration-200 hover:bg-[var(--bg-warm)] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  fontSize: `${size}px`,
                  lineHeight: 1.1,
                  color: isSelected ? 'var(--accent)' : color,
                  fontWeight: size > 40 ? 700 : size > 25 ? 600 : 400,
                }}
                role="listitem"
                aria-label={`${word.text}: förekommer ${word.value} gånger`}
              >
                <span className="font-[family-name:var(--font-playfair)]">
                  {word.text}
                </span>

                {/* Tooltip on hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none"
                  >
                    <div className="bg-[var(--bg-dark)] text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
                      <p className="font-medium">{word.value} förekomster</p>
                      {word.years.length > 0 && (
                        <p className="text-gray-400 mt-1">
                          {word.years[0]}–{word.years[word.years.length - 1]}
                        </p>
                      )}
                      {word.parties.length > 0 && (
                        <p className="text-gray-400">
                          {word.parties.slice(0, 3).join(', ')}
                          {word.parties.length > 3 && ` +${word.parties.length - 3}`}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface WordDetailProps {
  word: WordCloudItem;
  onClose: () => void;
}

export function WordDetail({ word, onClose }: WordDetailProps) {
  const yearRange = word.years.length > 0
    ? `${word.years[0]}–${word.years[word.years.length - 1]}`
    : 'Okänt';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--text-primary)]">
            &ldquo;{word.text}&rdquo;
          </h3>
          <p className="text-[var(--text-secondary)] mt-1">
            Förekommer {word.value} gånger i valaffischer
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Stäng"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-2">
            Tidsperiod
          </h4>
          <p className="text-[var(--text-primary)] font-medium">{yearRange}</p>
          {word.years.length > 2 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {word.years.map(year => (
                <span
                  key={year}
                  className="px-2 py-1 bg-[var(--bg-primary)] text-xs text-[var(--text-secondary)]"
                >
                  {year}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-2">
            Partier
          </h4>
          {word.parties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {word.parties.map(party => (
                <span
                  key={party}
                  className="px-3 py-1 text-sm font-medium"
                  style={{
                    backgroundColor: PARTY_COLORS[party] ? `${PARTY_COLORS[party]}20` : 'var(--bg-primary)',
                    color: PARTY_COLORS[party] || 'var(--text-primary)',
                  }}
                >
                  {party}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-secondary)]">Ingen partidata</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
