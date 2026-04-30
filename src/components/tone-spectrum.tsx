'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Poster } from '@/lib/types';

// Tone types matching the Poster type
type ToneType = NonNullable<Poster['tone']>;

// Tone configurations with colors and labels
export const TONE_CONFIG: Record<ToneType, { label: string; color: string; description: string }> = {
  hoppfull: {
    label: 'Hoppfull',
    color: '#3D7A5F',
    description: 'Framtidsoptimism, löften om bättre tider'
  },
  hotande: {
    label: 'Hotande',
    color: '#B8860B',
    description: 'Varningar, dramatisering av faror'
  },
  saklig: {
    label: 'Saklig',
    color: '#6B7280',
    description: 'Faktabaserad, neutral ton'
  },
  nostalgisk: {
    label: 'Nostalgisk',
    color: '#7C6955',
    description: 'Tillbakablickande, refererar till det förflutna'
  },
  upprorisk: {
    label: 'Upprorisk',
    color: '#E8112D',
    description: 'Protest, systemkritik, revolutionär'
  },
  lugn: {
    label: 'Lugn',
    color: '#52BDEC',
    description: 'Trygg, balanserad, stabilitet'
  },
};

// Order tones on a spectrum from confrontational to calm
const TONE_SPECTRUM_ORDER: ToneType[] = [
  'upprorisk',
  'hotande',
  'saklig',
  'nostalgisk',
  'hoppfull',
  'lugn',
];

interface ToneDistribution {
  tone: ToneType;
  count: number;
  percentage: number;
  posters: Poster[];
}

interface ToneByDecade {
  decade: string;
  distribution: ToneDistribution[];
  total: number;
}

interface ToneByParty {
  party: string;
  distribution: ToneDistribution[];
  total: number;
}

function analyzeToneDistribution(posters: Poster[]): ToneDistribution[] {
  const counts = new Map<ToneType, Poster[]>();

  // Initialize all tones
  TONE_SPECTRUM_ORDER.forEach(tone => counts.set(tone, []));

  // Count posters by tone
  posters.forEach(poster => {
    if (poster.tone) {
      const existing = counts.get(poster.tone) || [];
      existing.push(poster);
      counts.set(poster.tone, existing);
    }
  });

  const total = posters.filter(p => p.tone).length || 1;

  return TONE_SPECTRUM_ORDER.map(tone => ({
    tone,
    count: counts.get(tone)?.length || 0,
    percentage: ((counts.get(tone)?.length || 0) / total) * 100,
    posters: counts.get(tone) || [],
  }));
}

function analyzeToneByDecade(posters: Poster[]): ToneByDecade[] {
  const decades = new Map<string, Poster[]>();

  posters.forEach(poster => {
    if (poster.year) {
      const decade = Math.floor(poster.year / 10) * 10;
      const decadeLabel = `${decade}-tal`;
      const existing = decades.get(decadeLabel) || [];
      existing.push(poster);
      decades.set(decadeLabel, existing);
    }
  });

  return Array.from(decades.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([decade, decadePosters]) => ({
      decade,
      distribution: analyzeToneDistribution(decadePosters),
      total: decadePosters.filter(p => p.tone).length,
    }));
}

function analyzeToneByParty(posters: Poster[]): ToneByParty[] {
  const parties = new Map<string, Poster[]>();

  posters.forEach(poster => {
    if (poster.party) {
      const existing = parties.get(poster.party) || [];
      existing.push(poster);
      parties.set(poster.party, existing);
    }
  });

  return Array.from(parties.entries())
    .sort(([, a], [, b]) => b.length - a.length) // Sort by poster count
    .slice(0, 8) // Top 8 parties
    .map(([party, partyPosters]) => ({
      party,
      distribution: analyzeToneDistribution(partyPosters),
      total: partyPosters.filter(p => p.tone).length,
    }));
}

interface ToneSpectrumProps {
  posters: Poster[];
}

export function ToneSpectrum({ posters }: ToneSpectrumProps) {
  const [viewMode, setViewMode] = useState<'overall' | 'decade' | 'party'>('overall');
  const [selectedTone, setSelectedTone] = useState<ToneType | null>(null);

  const overallDistribution = useMemo(() => analyzeToneDistribution(posters), [posters]);
  const byDecade = useMemo(() => analyzeToneByDecade(posters), [posters]);
  const byParty = useMemo(() => analyzeToneByParty(posters), [posters]);

  const totalWithTone = posters.filter(p => p.tone).length;

  return (
    <div className="space-y-8">
      {/* View mode toggle */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: 'overall', label: 'Överblick' },
          { value: 'decade', label: 'Per årtionde' },
          { value: 'party', label: 'Per parti' },
        ].map(mode => (
          <button
            key={mode.value}
            onClick={() => setViewMode(mode.value as typeof viewMode)}
            className={`px-4 py-2 text-sm font-medium border transition-all ${
              viewMode === mode.value
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Overall spectrum visualization */}
      {viewMode === 'overall' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main spectrum bar */}
          <div className="relative">
            <div className="flex h-16 rounded-sm overflow-hidden shadow-lg">
              {overallDistribution.map((item, index) => (
                <motion.button
                  key={item.tone}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedTone(selectedTone === item.tone ? null : item.tone)}
                  className={`relative h-full transition-all ${
                    selectedTone === item.tone ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-primary)]' : ''
                  }`}
                  style={{
                    width: `${Math.max(item.percentage, 2)}%`,
                    backgroundColor: TONE_CONFIG[item.tone].color,
                    transformOrigin: 'left',
                  }}
                  title={`${TONE_CONFIG[item.tone].label}: ${item.count} affischer (${item.percentage.toFixed(1)}%)`}
                >
                  {item.percentage > 10 && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                      {item.percentage.toFixed(0)}%
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Spectrum labels */}
            <div className="flex justify-between mt-2 text-xs text-[var(--text-secondary)]">
              <span>Upprorisk</span>
              <span>Lugn</span>
            </div>
          </div>

          {/* Legend with counts */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {overallDistribution.map(item => (
              <button
                key={item.tone}
                onClick={() => setSelectedTone(selectedTone === item.tone ? null : item.tone)}
                className={`p-4 rounded-sm border transition-all ${
                  selectedTone === item.tone
                    ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                    : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full mb-2"
                  style={{ backgroundColor: TONE_CONFIG[item.tone].color }}
                />
                <p className="font-medium text-[var(--text-primary)]">
                  {TONE_CONFIG[item.tone].label}
                </p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {item.count}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {item.percentage.toFixed(1)}% av {totalWithTone}
                </p>
              </button>
            ))}
          </div>

          {/* Selected tone description */}
          <AnimatePresence>
            {selectedTone && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className="p-6 rounded-sm border-l-4"
                  style={{ borderColor: TONE_CONFIG[selectedTone].color, backgroundColor: 'var(--bg-secondary)' }}
                >
                  <h4 className="font-medium text-lg text-[var(--text-primary)] mb-2">
                    {TONE_CONFIG[selectedTone].label}
                  </h4>
                  <p className="text-[var(--text-secondary)]">
                    {TONE_CONFIG[selectedTone].description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* By decade view */}
      {viewMode === 'decade' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {byDecade.map((decade, decadeIndex) => (
            <motion.div
              key={decade.decade}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: decadeIndex * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <div className="flex items-center justify-between sm:w-24 sm:justify-end">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {decade.decade}
                </span>
                <span className="text-xs text-[var(--text-secondary)] sm:hidden">
                  {decade.total} st
                </span>
              </div>
              <div className="flex-1 h-6 sm:h-8 flex rounded-sm overflow-hidden bg-[var(--bg-secondary)]">
                {decade.distribution.map(item => (
                  item.count > 0 && (
                    <div
                      key={item.tone}
                      className="h-full transition-all hover:opacity-80"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: TONE_CONFIG[item.tone].color,
                      }}
                      title={`${TONE_CONFIG[item.tone].label}: ${item.count}`}
                    />
                  )
                ))}
              </div>
              <div className="hidden sm:block w-12 text-right text-xs text-[var(--text-secondary)]">
                {decade.total}
              </div>
            </motion.div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 pt-6 border-t border-[var(--border)]">
            {TONE_SPECTRUM_ORDER.map(tone => (
              <div key={tone} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: TONE_CONFIG[tone].color }}
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  {TONE_CONFIG[tone].label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* By party view */}
      {viewMode === 'party' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {byParty.map((party, partyIndex) => (
            <motion.div
              key={party.party}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: partyIndex * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <div className="flex items-center justify-between sm:w-32 sm:justify-end">
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {party.party}
                </span>
                <span className="text-xs text-[var(--text-secondary)] sm:hidden">
                  {party.total} st
                </span>
              </div>
              <div className="flex-1 h-6 sm:h-8 flex rounded-sm overflow-hidden bg-[var(--bg-secondary)]">
                {party.distribution.map(item => (
                  item.count > 0 && (
                    <div
                      key={item.tone}
                      className="h-full transition-all hover:opacity-80"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: TONE_CONFIG[item.tone].color,
                      }}
                      title={`${TONE_CONFIG[item.tone].label}: ${item.count}`}
                    />
                  )
                ))}
              </div>
              <div className="hidden sm:block w-12 text-right text-xs text-[var(--text-secondary)]">
                {party.total}
              </div>
            </motion.div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 pt-6 border-t border-[var(--border)]">
            {TONE_SPECTRUM_ORDER.map(tone => (
              <div key={tone} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: TONE_CONFIG[tone].color }}
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  {TONE_CONFIG[tone].label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Compact tone indicator for use in poster cards or lists
 */
interface ToneIndicatorProps {
  tone: ToneType;
  size?: 'sm' | 'md';
}

export function ToneIndicator({ tone, size = 'sm' }: ToneIndicatorProps) {
  const config = TONE_CONFIG[tone];

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-sm text-white font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{ backgroundColor: config.color }}
      title={config.description}
    >
      {config.label}
    </div>
  );
}
