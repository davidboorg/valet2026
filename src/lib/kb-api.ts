import type { KBSearchResponse, KBPoster, Poster } from './types';
import { extractDarkId, buildKbDigitaltUrl } from './iiif';
import { isElectionYear } from './election-years';

const KB_SEARCH_API = 'https://data.kb.se/search';

// Libris ID for the political poster collection
export const POLITIK_COLLECTION_ID = 'https://libris.kb.se/9slpxtq171tppxn0#it';

export interface SearchOptions {
  query?: string;
  genreForm?: string;
  collectionId?: string;
  fromYear?: number;
  toYear?: number;
  limit?: number;
  offset?: number;
  sort?: 'datePublished' | '-datePublished' | 'title' | '-title' | 'relevance' | 'random';
}

/**
 * Search KB's digitized collections
 */
export async function searchKB(options: SearchOptions = {}): Promise<KBSearchResponse> {
  const {
    query = '*',
    genreForm = 'Affischer',
    collectionId,
    fromYear,
    toYear,
    limit = 20,
    offset = 0,
    sort,
  } = options;

  const params = new URLSearchParams();
  params.set('q', query);
  params.set('genreForm', genreForm);
  params.set('limit', String(limit));
  params.set('offset', String(offset));

  if (collectionId) {
    params.set('isPartOf.@id', collectionId);
  }

  if (fromYear) {
    params.set('from', `${fromYear}-01-01`);
  }

  if (toYear) {
    params.set('to', `${toYear}-12-31`);
  }

  if (sort) {
    params.set('_sort', sort);
  }

  const url = `${KB_SEARCH_API}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`KB API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Search only political posters
 */
export async function searchPoliticalPosters(options: Omit<SearchOptions, 'collectionId'> = {}): Promise<KBSearchResponse> {
  return searchKB({
    ...options,
    collectionId: POLITIK_COLLECTION_ID,
  });
}

/**
 * Get a single poster by dark-ID
 */
export async function getPosterById(darkId: string): Promise<KBPoster | null> {
  try {
    // First try to get it from the API directly
    const response = await fetch(`https://data.kb.se/${darkId}.jsonld`, {
      headers: {
        Accept: 'application/ld+json',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Transform the FilePackage response to match KBPoster structure
    // This is a simplified version - the full transform would be more complex
    return {
      '@id': data['@id'],
      '@type': data['@type'],
      title: data.name || darkId,
      accessAllowed: data.accessAllowed ?? true,
      identifiedBy: data.identifiedBy,
    };
  } catch {
    console.error('Failed to fetch poster:', darkId);
    return null;
  }
}

/**
 * Transform KB API poster to our application Poster type
 */
export function transformKBPoster(kbPoster: KBPoster): Poster {
  const darkId = extractDarkId(kbPoster['@id']) || kbPoster['@id'];

  // Extract Regina ID
  const reginaId = kbPoster.identifiedBy?.find(
    (id) => id.typeNote === 'Regina-ID'
  )?.value;

  // Extract Libris ID
  const librisId = kbPoster.isPartOf?.meta?.controlNumber;

  // Extract year from datePublished
  const year = kbPoster.datePublished
    ? parseInt(kbPoster.datePublished.split('-')[0], 10)
    : undefined;

  // Extract creator from contribution
  const creator = kbPoster.contribution?.[0]?.agent?.[0]?.displayName ||
    kbPoster.contribution?.[0]?.agent?.[0]?.name;

  // Determine rights status
  const rightsStatus = kbPoster.usageAndAccessPolicy?.some(
    (policy) => policy.value === 'Free'
  )
    ? 'free'
    : 'restricted';

  // Extract genre forms
  const genreForm = [
    ...(kbPoster.genreForm?.map((g) => g.prefLabel?.sv || '') || []),
    ...(kbPoster.isPartOf?.genreForm?.map((g) => g.prefLabel?.sv || '') || []),
  ].filter(Boolean);

  return {
    id: darkId,
    source: 'kb' as const,
    kbDigitaltId: darkId,
    reginaId,
    librisId,
    title: kbPoster.title,
    creator,
    year,
    iiifImageBaseUrl: kbPoster.imageServiceId || '',
    thumbnailUrl: kbPoster.thumbnail || '',
    rightsStatus,
    kbDigitaltUrl: buildKbDigitaltUrl(darkId),
    sourceUrl: buildKbDigitaltUrl(darkId),
    sourceAttribution: 'Kungliga biblioteket',
    collection: kbPoster.isPartOf?.title,
    genreForm,
  };
}

/**
 * Search and transform results to application Poster type
 */
export async function searchPosters(options: SearchOptions = {}): Promise<{
  posters: Poster[];
  total: number;
}> {
  const response = await searchKB(options);

  return {
    posters: response.hits.map(transformKBPoster),
    total: response.total,
  };
}

/**
 * Search political posters filtered to Swedish election years only
 */
export async function searchElectionPosters(options: Omit<SearchOptions, 'collectionId'> = {}): Promise<{
  posters: Poster[];
  total: number;
  electionYearCount: number;
}> {
  // Fetch more to compensate for filtering
  const response = await searchPoliticalPosters({
    ...options,
    limit: (options.limit || 20) * 3,
  });

  const allPosters = response.hits.map(transformKBPoster);
  const electionPosters = allPosters.filter(p => isElectionYear(p.year));

  return {
    posters: electionPosters.slice(0, options.limit || 20),
    total: response.total,
    electionYearCount: electionPosters.length,
  };
}

/**
 * Filter an array of posters to only election years
 */
export function filterElectionYearPosters(posters: Poster[]): Poster[] {
  return posters.filter(p => isElectionYear(p.year));
}

// Re-export from posters.ts for backward compatibility
export { getAllElectionPosters } from './posters';
