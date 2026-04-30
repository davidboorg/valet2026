'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Poster } from '@/lib/types';

interface ElectionContext {
  election_year: number;
  headline: string | null;
  key_issues: string[] | null;
}

interface YearClusterProps {
  year: number;
  posters: Poster[];
  isExpanded: boolean;
  onToggle: () => void;
  context?: ElectionContext | null;
  partyColor?: string | null;
}

export function YearCluster({
  year,
  posters,
  isExpanded,
  onToggle,
  context,
  partyColor
}: YearClusterProps) {
  const count = posters.length;

  return (
    <div className="relative">
      {/* Year marker button */}
      <button
        onClick={onToggle}
        className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        aria-expanded={isExpanded}
        aria-label={`${year}, ${count} affischer. ${isExpanded ? 'Klicka för att fälla ihop' : 'Klicka för att expandera'}`}
      >
        {/* Dot indicator */}
        <div
          className={`
            w-4 h-4 rounded-full border-2 transition-all
            ${isExpanded
              ? 'bg-[var(--accent)] border-[var(--accent)] scale-125'
              : 'bg-[var(--bg-primary)] border-[var(--text-secondary)] group-hover:border-[var(--accent)] group-hover:scale-110'
            }
          `}
          style={partyColor && isExpanded ? {
            backgroundColor: partyColor,
            borderColor: partyColor
          } : undefined}
        />

        {/* Year label */}
        <span className={`
          mt-2 text-sm font-medium transition-colors
          ${isExpanded
            ? 'text-[var(--accent)]'
            : 'text-[var(--text-primary)] group-hover:text-[var(--accent)]'
          }
        `}>
          {year}
        </span>

        {/* Count badge */}
        <span className="text-xs text-[var(--text-secondary)]">
          {count} {count === 1 ? 'st' : 'st'}
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-20 w-[320px] md:w-[480px] lg:w-[640px]">
          {/* Arrow pointing up */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[var(--bg-secondary)] border-l border-t border-[var(--border)]"
          />

          {/* Content card */}
          <div className="relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-sm shadow-lg p-4">
            {/* Context headline */}
            {context?.headline && (
              <div className="mb-4 pb-4 border-b border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {context.headline}
                </p>
                {context.key_issues && context.key_issues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {context.key_issues.map((issue) => (
                      <span
                        key={issue}
                        className="text-xs px-2 py-0.5 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-sm"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Poster thumbnails */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {posters.slice(0, 12).map((poster) => (
                <Link
                  key={poster.id}
                  href={`/affischer/${poster.id}`}
                  className="group/poster relative aspect-[3/4] bg-[var(--bg-primary)] overflow-hidden"
                >
                  <Image
                    src={poster.thumbnailUrl.replace('/200,/', '/300,/')}
                    alt={poster.title}
                    fill
                    sizes="80px"
                    className="object-contain group-hover/poster:scale-105 transition-transform"
                  />
                </Link>
              ))}

              {/* "Show more" card if there are more posters */}
              {count > 12 && (
                <Link
                  href={`/affischer?year=${year}`}
                  className="aspect-[3/4] bg-[var(--bg-primary)] flex items-center justify-center hover:bg-[var(--bg-warm)] transition-colors"
                >
                  <span className="text-xs text-[var(--text-secondary)] text-center">
                    +{count - 12}
                    <br />
                    till
                  </span>
                </Link>
              )}
            </div>

            {/* View all link */}
            <Link
              href={`/affischer?year=${year}`}
              className="mt-4 block text-center text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Se alla från {year} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
