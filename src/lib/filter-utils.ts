/**
 * Filter utilities for election posters
 *
 * Provides testable, composable filtering logic for the poster archive.
 * All filtering is done in-memory on normalized data - no string-based search hacks.
 */

import type { Poster } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface PosterFilters {
  query?: string;           // Free text search
  party?: string;           // Party slug (e.g., 's', 'm', 'c')
  year?: number;            // Specific election year
  fromYear?: number;        // Year range start
  toYear?: number;          // Year range end
  theme?: string;           // Theme slug
  source?: string;          // Source type
  hasImage?: boolean;       // Only posters with images
  analyzed?: boolean;       // Only analyzed posters
}

export interface PartyDefinition {
  slug: string;
  name: string;
  abbreviation: string;
  aliases: string[];        // Historical names and variants
  color?: string;
  founded?: number;
}

export interface ThemeDefinition {
  slug: string;
  name: string;
  keywords: string[];       // Words that indicate this theme
}

// ============================================================================
// PARTY DEFINITIONS
// ============================================================================

export const PARTIES: PartyDefinition[] = [
  {
    slug: 's',
    name: 'Socialdemokraterna',
    abbreviation: 'S',
    aliases: ['SAP', 'Socialdemokratiska arbetarepartiet', 'Sveriges socialdemokratiska arbetareparti', 'Sossarna'],
    color: '#E8112D',
    founded: 1889,
  },
  {
    slug: 'm',
    name: 'Moderaterna',
    abbreviation: 'M',
    aliases: ['Högerpartiet', 'Allmänna valmansförbundet', 'AVF', 'Högern', 'Nya moderaterna'],
    color: '#52BDEC',
    founded: 1904,
  },
  {
    slug: 'c',
    name: 'Centerpartiet',
    abbreviation: 'C',
    aliases: ['Bondeförbundet', 'Centern'],
    color: '#009933',
    founded: 1913,
  },
  {
    slug: 'l',
    name: 'Liberalerna',
    abbreviation: 'L',
    aliases: ['Folkpartiet', 'Folkpartiet liberalerna', 'FP', 'Frisinnade'],
    color: '#006AB3',
    founded: 1902,
  },
  {
    slug: 'v',
    name: 'Vänsterpartiet',
    abbreviation: 'V',
    aliases: ['VPK', 'SKP', 'Kommunisterna', 'Vänsterpartiet kommunisterna', 'Sveriges kommunistiska parti'],
    color: '#DA291C',
    founded: 1917,
  },
  {
    slug: 'mp',
    name: 'Miljöpartiet',
    abbreviation: 'MP',
    aliases: ['Miljöpartiet de gröna', 'Gröna'],
    color: '#83CF39',
    founded: 1981,
  },
  {
    slug: 'kd',
    name: 'Kristdemokraterna',
    abbreviation: 'KD',
    aliases: ['KDS', 'Kristen demokratisk samling'],
    color: '#000077',
    founded: 1964,
  },
  {
    slug: 'sd',
    name: 'Sverigedemokraterna',
    abbreviation: 'SD',
    aliases: [],
    color: '#DDDD00',
    founded: 1988,
  },
];

// ============================================================================
// THEME DEFINITIONS
// ============================================================================

export const THEMES: ThemeDefinition[] = [
  {
    slug: 'rostratt',
    name: 'Rösträtt',
    keywords: ['rösträtt', 'rösta', 'val', 'demokrati', 'folkomröstning'],
  },
  {
    slug: 'arbete',
    name: 'Arbete & jobb',
    keywords: ['arbete', 'arbetare', 'jobb', 'sysselsättning', 'arbetslöshet', 'fackförening'],
  },
  {
    slug: 'fred',
    name: 'Fred & säkerhet',
    keywords: ['fred', 'krig', 'försvar', 'neutralitet', 'säkerhet', 'militär'],
  },
  {
    slug: 'valfard',
    name: 'Välfärd',
    keywords: ['välfärd', 'trygghet', 'pension', 'vård', 'omsorg', 'folkhem'],
  },
  {
    slug: 'jordbruk',
    name: 'Jordbruk & landsbygd',
    keywords: ['jordbruk', 'bonde', 'lantbruk', 'landsbygd', 'glesbygd'],
  },
  {
    slug: 'miljo',
    name: 'Miljö & klimat',
    keywords: ['miljö', 'klimat', 'natur', 'grön', 'hållbar', 'förnybar'],
  },
  {
    slug: 'invandring',
    name: 'Invandring & integration',
    keywords: ['invandring', 'integration', 'migration', 'flyktingar', 'asyl'],
  },
  {
    slug: 'skatt',
    name: 'Skatter & ekonomi',
    keywords: ['skatt', 'ekonomi', 'budget', 'statsfinans', 'tillväxt'],
  },
];

// ============================================================================
// NORMALIZATION HELPERS
// ============================================================================

/**
 * Normalize text for comparison (lowercase, remove diacritics)
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
}

/**
 * Check if text contains any of the search terms as whole words
 *
 * Short terms (3 chars or less) require word boundary matching to avoid
 * false positives (e.g., 'S' matching 'Moderaterna').
 */
function containsAny(text: string, terms: string[]): boolean {
  const normalized = normalizeText(text);
  return terms.some(term => {
    const normalizedTerm = normalizeText(term);
    if (normalizedTerm.length <= 3) {
      // Short terms need word boundary matching
      const regex = new RegExp(`\\b${normalizedTerm}\\b`, 'i');
      return regex.test(normalized);
    }
    // Longer terms can use substring matching
    return normalized.includes(normalizedTerm);
  });
}

// ============================================================================
// PARTY MATCHING
// ============================================================================

/**
 * Find party definition by slug
 */
export function getPartyBySlug(slug: string): PartyDefinition | undefined {
  return PARTIES.find(p => p.slug === slug);
}

/**
 * Find party definition by name (checks name, abbreviation, and aliases)
 */
export function getPartyByName(name: string): PartyDefinition | undefined {
  const normalized = normalizeText(name);
  return PARTIES.find(p =>
    normalizeText(p.name) === normalized ||
    normalizeText(p.abbreviation) === normalized ||
    p.aliases.some(alias => normalizeText(alias) === normalized)
  );
}

/**
 * Check if a poster matches a party
 */
export function posterMatchesParty(poster: Poster, partySlug: string): boolean {
  const party = getPartyBySlug(partySlug);
  if (!party) return false;

  // Direct party field match
  if (poster.party) {
    const posterPartyNormalized = normalizeText(poster.party);
    if (
      posterPartyNormalized === normalizeText(party.name) ||
      posterPartyNormalized === normalizeText(party.abbreviation) ||
      party.aliases.some(alias => posterPartyNormalized === normalizeText(alias))
    ) {
      return true;
    }
  }

  // Check title for party references
  const searchTerms = [party.name, party.abbreviation, ...party.aliases];
  if (containsAny(poster.title, searchTerms)) {
    return true;
  }

  return false;
}

// ============================================================================
// THEME MATCHING
// ============================================================================

/**
 * Find theme definition by slug
 */
export function getThemeBySlug(slug: string): ThemeDefinition | undefined {
  return THEMES.find(t => t.slug === slug);
}

/**
 * Check if a poster matches a theme
 */
export function posterMatchesTheme(poster: Poster, themeSlug: string): boolean {
  const theme = getThemeBySlug(themeSlug);
  if (!theme) return false;

  // Check themes array if present
  if (poster.themes && poster.themes.length > 0) {
    if (poster.themes.some(t => normalizeText(t) === normalizeText(theme.name))) {
      return true;
    }
  }

  // Check title and slogan for theme keywords
  const textToSearch = [
    poster.title,
    poster.slogan || '',
    poster.transcribedText || '',
  ].join(' ');

  return containsAny(textToSearch, theme.keywords);
}

// ============================================================================
// TEXT SEARCH
// ============================================================================

/**
 * Check if a poster matches a free text query
 */
export function posterMatchesQuery(poster: Poster, query: string): boolean {
  if (!query || query === '*') return true;

  const normalizedQuery = normalizeText(query);
  const searchableFields = [
    poster.title,
    poster.creator || '',
    poster.party || '',
    poster.slogan || '',
    poster.transcribedText || '',
    poster.collection || '',
    String(poster.year || ''),
  ];

  return searchableFields.some(field =>
    normalizeText(field).includes(normalizedQuery)
  );
}

// ============================================================================
// YEAR FILTERING
// ============================================================================

/**
 * Check if a poster matches year criteria
 */
export function posterMatchesYear(
  poster: Poster,
  year?: number,
  fromYear?: number,
  toYear?: number
): boolean {
  if (!poster.year) return false;

  // Exact year match
  if (year !== undefined) {
    return poster.year === year;
  }

  // Year range
  if (fromYear !== undefined && poster.year < fromYear) return false;
  if (toYear !== undefined && poster.year > toYear) return false;

  return true;
}

// ============================================================================
// MAIN FILTER FUNCTION
// ============================================================================

/**
 * Filter posters based on all criteria
 *
 * @param posters - Array of posters to filter
 * @param filters - Filter criteria
 * @returns Filtered array of posters
 */
export function filterPosters(posters: Poster[], filters: PosterFilters): Poster[] {
  return posters.filter(poster => {
    // Text search
    if (filters.query && !posterMatchesQuery(poster, filters.query)) {
      return false;
    }

    // Party filter
    if (filters.party && !posterMatchesParty(poster, filters.party)) {
      return false;
    }

    // Year filter
    if (filters.year || filters.fromYear || filters.toYear) {
      if (!posterMatchesYear(poster, filters.year, filters.fromYear, filters.toYear)) {
        return false;
      }
    }

    // Theme filter
    if (filters.theme && !posterMatchesTheme(poster, filters.theme)) {
      return false;
    }

    // Source filter
    if (filters.source && poster.source !== filters.source) {
      return false;
    }

    // Has image filter
    if (filters.hasImage !== undefined) {
      const hasImage = Boolean(
        poster.storagePublicUrl ||
        poster.thumbnailUrl ||
        poster.imageUrl ||
        poster.iiifImageBaseUrl
      );
      if (filters.hasImage !== hasImage) return false;
    }

    // Analyzed filter
    if (filters.analyzed !== undefined) {
      const isAnalyzed = Boolean(poster.themes?.length || poster.slogan || poster.transcribedText);
      if (filters.analyzed !== isAnalyzed) return false;
    }

    return true;
  });
}

// ============================================================================
// SORTING
// ============================================================================

export type SortField = 'year' | 'title' | 'party';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

/**
 * Sort posters by field
 */
export function sortPosters(posters: Poster[], options: SortOptions): Poster[] {
  const { field, direction } = options;
  const multiplier = direction === 'desc' ? -1 : 1;

  return [...posters].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'year':
        comparison = (a.year || 0) - (b.year || 0);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title, 'sv');
        break;
      case 'party':
        comparison = (a.party || '').localeCompare(b.party || '', 'sv');
        break;
    }

    return comparison * multiplier;
  });
}

// ============================================================================
// AGGREGATION
// ============================================================================

/**
 * Count posters by party
 */
export function countByParty(posters: Poster[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const party of PARTIES) {
    const count = posters.filter(p => posterMatchesParty(p, party.slug)).length;
    if (count > 0) {
      counts.set(party.slug, count);
    }
  }

  return counts;
}

/**
 * Count posters by decade
 */
export function countByDecade(posters: Poster[]): Map<number, number> {
  const counts = new Map<number, number>();

  for (const poster of posters) {
    if (poster.year) {
      const decade = Math.floor(poster.year / 10) * 10;
      counts.set(decade, (counts.get(decade) || 0) + 1);
    }
  }

  return counts;
}

/**
 * Get unique election years from posters
 */
export function getUniqueYears(posters: Poster[]): number[] {
  const years = new Set<number>();
  for (const poster of posters) {
    if (poster.year) {
      years.add(poster.year);
    }
  }
  return Array.from(years).sort((a, b) => b - a);
}
