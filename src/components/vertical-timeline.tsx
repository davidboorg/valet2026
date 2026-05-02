'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { Poster } from '@/lib/types';
import { resolvePosterImage } from '@/lib/poster-image';

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

interface VerticalTimelineProps {
  posters: Poster[];
  parties: Party[];
  electionContexts?: ElectionContext[];
}

// Group posters by decade
function groupByDecade(posters: Poster[]): Map<number, Map<number, Poster[]>> {
  const decades = new Map<number, Map<number, Poster[]>>();

  posters.forEach((poster) => {
    if (poster.year) {
      const decade = Math.floor(poster.year / 10) * 10;

      if (!decades.has(decade)) {
        decades.set(decade, new Map());
      }

      const years = decades.get(decade)!;
      if (!years.has(poster.year)) {
        years.set(poster.year, []);
      }
      years.get(poster.year)!.push(poster);
    }
  });

  // Sort decades descending (newest first) and years within each decade
  const sortedDecades = new Map(
    [...decades.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([decade, years]) => [
        decade,
        new Map([...years.entries()].sort((a, b) => b[0] - a[0]))
      ])
  );

  return sortedDecades;
}

// Match poster to party
function matchesParty(poster: Poster, partySlug: string, parties: Party[]): boolean {
  const party = parties.find(p =>
    p.slug === partySlug ||
    p.abbreviation?.toLowerCase() === partySlug.toLowerCase()
  );

  if (!party) return false;

  const posterParty = poster.party?.toLowerCase();
  if (!posterParty) return false;

  if (posterParty === party.slug ||
      posterParty === party.abbreviation?.toLowerCase() ||
      posterParty === party.name.toLowerCase()) {
    return true;
  }

  if (party.historical_names) {
    return party.historical_names.some(name =>
      posterParty === name.toLowerCase()
    );
  }

  return false;
}

export function VerticalTimeline({
  posters,
  parties,
  electionContexts = []
}: VerticalTimelineProps) {
  const searchParams = useSearchParams();
  const selectedParty = searchParams.get('party');

  // Filter posters by selected party
  const filteredPosters = useMemo(() => {
    if (!selectedParty) return posters;
    return posters.filter(poster => matchesParty(poster, selectedParty, parties));
  }, [posters, selectedParty, parties]);

  // Group by decade
  const decadeGroups = useMemo(() => groupByDecade(filteredPosters), [filteredPosters]);

  // Get context for a year
  const getContextForYear = (year: number) => {
    return electionContexts.find(c => c.election_year === year);
  };

  // Get selected party info
  const selectedPartyObj = useMemo(() => {
    if (!selectedParty) return null;
    return parties.find(p =>
      p.slug === selectedParty ||
      p.abbreviation?.toLowerCase() === selectedParty.toLowerCase()
    );
  }, [selectedParty, parties]);

  const accentColor = selectedPartyObj?.color || '#1a1a1a';

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
      {/* Party filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/tidslinje"
          className={`px-4 py-2 text-sm border transition-colors ${
            !selectedParty
              ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Alla partier
        </Link>
        {parties.slice(0, 8).map((party) => (
          <Link
            key={party.slug}
            href={`/tidslinje?party=${party.slug || party.abbreviation?.toLowerCase()}`}
            className={`px-4 py-2 text-sm border transition-colors ${
              selectedParty === party.slug || selectedParty === party.abbreviation?.toLowerCase()
                ? 'text-white border-current'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
            }`}
            style={
              selectedParty === party.slug || selectedParty === party.abbreviation?.toLowerCase()
                ? { backgroundColor: party.color || '#1a1a1a', borderColor: party.color || '#1a1a1a' }
                : undefined
            }
          >
            {party.abbreviation || party.name}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filteredPosters.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">
            Inga affischer hittades{selectedPartyObj && ` för ${selectedPartyObj.name}`}.
          </p>
        </div>
      )}

      {/* Decade navigation */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from(decadeGroups.keys()).map((decade) => (
          <a
            key={decade}
            href={`#decade-${decade}`}
            className="flex-shrink-0 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-warm)] text-sm font-medium text-[var(--text-primary)] transition-colors"
          >
            {decade}-tal
          </a>
        ))}
      </div>

      {/* Decades */}
      <div className="space-y-16">
        {Array.from(decadeGroups.entries()).map(([decade, years]) => {
          const totalInDecade = Array.from(years.values()).reduce((sum, arr) => sum + arr.length, 0);

          return (
            <section key={decade} id={`decade-${decade}`} className="scroll-mt-24">
              {/* Decade header */}
              <div className="sticky top-16 z-10 bg-[var(--bg-primary)] py-4 border-b border-[var(--border)] mb-6">
                <div className="flex items-baseline gap-4">
                  <h2
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ color: accentColor }}
                  >
                    {decade}-talet
                  </h2>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {totalInDecade} affischer
                  </span>
                </div>
              </div>

              {/* Years within decade */}
              <div className="space-y-10">
                {Array.from(years.entries()).map(([year, yearPosters]) => {
                  const context = getContextForYear(year);

                  return (
                    <div key={year}>
                      {/* Year header */}
                      <div className="flex items-baseline gap-3 mb-4">
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">
                          {year}
                        </h3>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {yearPosters.length} st
                        </span>
                        {context?.headline && (
                          <span className="text-sm text-[var(--text-secondary)] italic hidden sm:inline">
                            — {context.headline}
                          </span>
                        )}
                      </div>

                      {/* Posters - horizontal scroll on mobile, grid on desktop */}
                      <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 sm:overflow-visible scrollbar-hide">
                          {yearPosters.map((poster) => {
                            const imageUrl = resolvePosterImage(poster);
                            return (
                            <Link
                              key={poster.id}
                              href={`/affischer/${poster.id}`}
                              className="group flex-shrink-0 w-[140px] sm:w-auto"
                            >
                              <div className="relative aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden">
                                {imageUrl && (
                                  <Image
                                    src={imageUrl.startsWith('/') ? imageUrl : imageUrl.replace('/200,/', '/400,/')}
                                    alt={poster.title}
                                    fill
                                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 20vw, 12vw"
                                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium transition-opacity">
                                    Visa
                                  </span>
                                </div>
                              </div>
                              {/* Title below image */}
                              <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 group-hover:text-[var(--text-primary)] transition-colors">
                                {poster.title}
                              </p>
                              {poster.party && (
                                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                  {poster.party}
                                </span>
                              )}
                            </Link>
                          );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Summary stats */}
      {filteredPosters.length > 0 && (
        <div className="mt-16 pt-8 border-t border-[var(--border)] grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {filteredPosters.length}
            </span>
            <p className="text-sm text-[var(--text-secondary)]">affischer</p>
          </div>
          <div>
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {decadeGroups.size}
            </span>
            <p className="text-sm text-[var(--text-secondary)]">årtionden</p>
          </div>
          <div>
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {Array.from(decadeGroups.values()).reduce((sum, years) => sum + years.size, 0)}
            </span>
            <p className="text-sm text-[var(--text-secondary)]">valår</p>
          </div>
        </div>
      )}
    </div>
  );
}
