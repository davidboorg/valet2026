'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface Party {
  slug: string | null;
  name: string;
  abbreviation: string | null;
  color: string | null;
  poster_count?: number;
}

interface PartyFilterTabsProps {
  parties: Party[];
  selectedParty: string | null;
  posterCountByParty?: Record<string, number>;
}

export function PartyFilterTabs({
  parties,
  selectedParty,
  posterCountByParty = {}
}: PartyFilterTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePartyClick = useCallback((partySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (partySlug) {
      params.set('party', partySlug);
    } else {
      params.delete('party');
    }

    // Reset year selection when changing party
    params.delete('year');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Filter to parties that have posters (or show all if no count data)
  const visibleParties = parties.filter(p => {
    const slug = p.slug || p.abbreviation?.toLowerCase();
    if (!slug) return false;
    const count = posterCountByParty[slug] ?? p.poster_count ?? 0;
    return Object.keys(posterCountByParty).length === 0 || count > 0;
  });

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {/* "Alla" tab */}
      <button
        onClick={() => handlePartyClick(null)}
        className={`
          flex-shrink-0 px-4 py-2 text-sm font-medium rounded-sm transition-colors
          ${!selectedParty
            ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }
        `}
      >
        Alla
      </button>

      {/* Party tabs */}
      {visibleParties.map((party) => {
        const slug = party.slug || party.abbreviation?.toLowerCase();
        const isSelected = selectedParty === slug;
        const count = posterCountByParty[slug!] ?? party.poster_count ?? 0;

        return (
          <button
            key={slug}
            onClick={() => handlePartyClick(slug!)}
            className={`
              flex-shrink-0 px-4 py-2 text-sm font-medium rounded-sm transition-colors
              flex items-center gap-2
              ${isSelected
                ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }
            `}
            style={isSelected && party.color ? {
              backgroundColor: party.color,
              color: getContrastColor(party.color)
            } : undefined}
          >
            {/* Party color dot */}
            {party.color && !isSelected && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: party.color }}
              />
            )}

            <span>{party.abbreviation || party.name}</span>

            {count > 0 && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-sm
                ${isSelected
                  ? 'bg-white/20'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                }
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Helper to determine text color based on background
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
