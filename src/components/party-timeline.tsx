'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PartyFilterTabs } from './party-filter-tabs';
import { YearCluster } from './year-cluster';
import type { Poster } from '@/lib/types';

interface Party {
  slug: string | null;
  name: string;
  abbreviation: string | null;
  color: string | null;
  historical_names?: string[] | null;
}

interface ElectionContext {
  election_year: number;
  headline: string | null;
  key_issues: string[] | null;
}

interface PartyTimelineProps {
  posters: Poster[];
  parties: Party[];
  electionContexts?: ElectionContext[];
}

// Group posters by year
function groupByYear(posters: Poster[]): Map<number, Poster[]> {
  const years = new Map<number, Poster[]>();

  posters.forEach((poster) => {
    if (poster.year) {
      if (!years.has(poster.year)) {
        years.set(poster.year, []);
      }
      years.get(poster.year)!.push(poster);
    }
  });

  return new Map([...years.entries()].sort((a, b) => a[0] - b[0]));
}

// Match poster to party (handles historical names)
function matchesParty(poster: Poster, partySlug: string, parties: Party[]): boolean {
  const party = parties.find(p =>
    p.slug === partySlug ||
    p.abbreviation?.toLowerCase() === partySlug.toLowerCase()
  );

  if (!party) return false;

  // Check direct match on poster's party field
  const posterParty = poster.party?.toLowerCase();

  if (!posterParty) return false;

  // Match against current name
  if (posterParty === party.slug ||
      posterParty === party.abbreviation?.toLowerCase() ||
      posterParty === party.name.toLowerCase()) {
    return true;
  }

  // Match against historical names
  if (party.historical_names) {
    return party.historical_names.some(name =>
      posterParty === name.toLowerCase()
    );
  }

  return false;
}

export function PartyTimeline({
  posters,
  parties,
  electionContexts = []
}: PartyTimelineProps) {
  const searchParams = useSearchParams();
  const selectedParty = searchParams.get('party');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  // Filter posters by selected party
  const filteredPosters = useMemo(() => {
    if (!selectedParty) return posters;
    return posters.filter(poster => matchesParty(poster, selectedParty, parties));
  }, [posters, selectedParty, parties]);

  // Group by year
  const yearGroups = useMemo(() => groupByYear(filteredPosters), [filteredPosters]);

  // Calculate poster count by party for tabs
  const posterCountByParty = useMemo(() => {
    const counts: Record<string, number> = {};

    parties.forEach(party => {
      const slug = party.slug || party.abbreviation?.toLowerCase();
      if (slug) {
        counts[slug] = posters.filter(p => matchesParty(p, slug, parties)).length;
      }
    });

    return counts;
  }, [posters, parties]);

  // Get selected party object for color
  const selectedPartyObj = useMemo(() => {
    if (!selectedParty) return null;
    return parties.find(p =>
      p.slug === selectedParty ||
      p.abbreviation?.toLowerCase() === selectedParty.toLowerCase()
    );
  }, [selectedParty, parties]);

  // Get context for a year
  const getContextForYear = useCallback((year: number) => {
    return electionContexts.find(c => c.election_year === year);
  }, [electionContexts]);

  // Toggle year expansion
  const handleToggleYear = useCallback((year: number) => {
    setExpandedYear(prev => prev === year ? null : year);
  }, []);

  // Close expanded year when clicking outside
  const handleBackdropClick = useCallback(() => {
    setExpandedYear(null);
  }, []);

  const years = Array.from(yearGroups.keys());
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <div className="relative">
      {/* Party filter tabs */}
      <div className="sticky top-0 z-30 bg-[var(--bg-secondary)] border-y border-[var(--border)] py-4 mb-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] flex-shrink-0">
              Tidslinje:
            </span>
            <PartyFilterTabs
              parties={parties}
              selectedParty={selectedParty}
              posterCountByParty={posterCountByParty}
            />
          </div>
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Empty state */}
        {years.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--text-secondary)]">
              Inga affischer hittades
              {selectedParty && ` för ${selectedPartyObj?.name || selectedParty}`}.
            </p>
          </div>
        )}

        {/* Timeline with years */}
        {years.length > 0 && (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-8 left-8 right-8 h-px bg-[var(--border)]" />

            {/* Year clusters */}
            <div
              className="relative flex justify-between items-start pt-0 pb-64 overflow-x-auto"
              style={{ minWidth: years.length * 80 }}
            >
              {years.map((year) => {
                const yearPosters = yearGroups.get(year) || [];
                const context = getContextForYear(year);

                return (
                  <YearCluster
                    key={year}
                    year={year}
                    posters={yearPosters}
                    isExpanded={expandedYear === year}
                    onToggle={() => handleToggleYear(year)}
                    context={context}
                    partyColor={selectedPartyObj?.color}
                  />
                );
              })}
            </div>

            {/* Backdrop to close expanded year */}
            {expandedYear && (
              <div
                className="fixed inset-0 z-10"
                onClick={handleBackdropClick}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* Stats summary */}
        {years.length > 0 && (
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            <div className="flex flex-wrap gap-8 text-sm text-[var(--text-secondary)]">
              <div>
                <span className="text-2xl font-[var(--font-playfair)] text-[var(--text-primary)]">
                  {filteredPosters.length}
                </span>
                <span className="ml-2">affischer</span>
              </div>
              <div>
                <span className="text-2xl font-[var(--font-playfair)] text-[var(--text-primary)]">
                  {years.length}
                </span>
                <span className="ml-2">år representerade</span>
              </div>
              <div>
                <span className="text-2xl font-[var(--font-playfair)] text-[var(--text-primary)]">
                  {minYear}–{maxYear}
                </span>
                <span className="ml-2">tidsspann</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
