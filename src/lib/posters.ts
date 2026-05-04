/**
 * Poster data layer — centraliserad datahämtning för valaffischer
 *
 * Prioriterar Supabase om konfigurerad, annars fallback till KB API + statiska arrays.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { searchPoliticalPosters, filterElectionYearPosters, transformKBPoster, getPosterById as getKBPosterById } from './kb-api';
import { getAllExternalPosters } from './external-sources';
import { filterPosters, type PosterFilters } from './filter-utils';
import type { Poster, VElectionPoster, PosterSource, RightsStatus } from './types';

export interface GetAllElectionPostersOptions {
  limit?: number;
  sort?: 'year' | '-year';
  party?: string;
  fromYear?: number;
  toYear?: number;
}

/**
 * Transform a Supabase v_election_posters row to our Poster type
 */
function transformSupabasePoster(row: VElectionPoster): Poster {
  return {
    id: row.id,
    title: row.title,
    creator: row.creator,
    year: row.year,
    source: row.source as PosterSource,
    // Prioritera storage_public_url för thumbnailUrl
    thumbnailUrl: row.storage_public_url || row.thumbnail_url || row.image_url || '',
    imageUrl: row.image_url,
    highResUrl: row.high_res_url,
    iiifImageBaseUrl: row.iiif_image_base_url,
    kbDigitaltId: row.kb_digitalt_id,
    rightsStatus: (row.rights_status as RightsStatus) || 'unknown',
    rightsNote: row.rights_note,
    slogan: row.slogan,
    sourceUrl: row.source_url,
    sourceAttribution: row.source_attribution,
    party: row.party,
    themes: row.themes,
    // Supabase Storage fields
    storagePublicUrl: row.storage_public_url,
    uploadStatus: row.upload_status,
  };
}

/**
 * Get posters from Supabase v_election_posters view
 */
async function getPostersFromSupabase(options: GetAllElectionPostersOptions): Promise<Poster[] | null> {
  const { limit = 200, sort = '-year', party, fromYear, toYear } = options;

  try {
    let query = supabase
      .from('v_election_posters')
      .select('*')
      .order('year', { ascending: sort !== '-year' });

    if (party) {
      query = query.eq('party', party);
    }
    if (fromYear) {
      query = query.gte('year', fromYear);
    }
    if (toYear) {
      query = query.lte('year', toYear);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase query error:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map(transformSupabasePoster);
  } catch (err) {
    console.warn('Failed to fetch from Supabase:', err);
    return null;
  }
}

/**
 * Fallback: Get posters from KB API + external sources (static arrays)
 */
async function getPostersFromFallback(options: GetAllElectionPostersOptions): Promise<Poster[]> {
  const { limit = 200, sort = '-year', party, fromYear, toYear } = options;

  // Get KB posters
  const response = await searchPoliticalPosters({ limit: 200 });
  let kbPosters = filterElectionYearPosters(response.hits.map(transformKBPoster));

  // Get external posters (already election year filtered in source)
  let externalPosters = getAllExternalPosters();

  // Apply filters
  if (party) {
    kbPosters = kbPosters.filter(p => p.party === party);
    externalPosters = externalPosters.filter(p => p.party === party);
  }
  if (fromYear) {
    kbPosters = kbPosters.filter(p => (p.year || 0) >= fromYear);
    externalPosters = externalPosters.filter(p => (p.year || 0) >= fromYear);
  }
  if (toYear) {
    kbPosters = kbPosters.filter(p => (p.year || 0) <= toYear);
    externalPosters = externalPosters.filter(p => (p.year || 0) <= toYear);
  }

  // Combine and sort
  const allPosters = [...kbPosters, ...externalPosters];

  allPosters.sort((a, b) => {
    const yearA = a.year || 0;
    const yearB = b.year || 0;
    return sort === '-year' ? yearB - yearA : yearA - yearB;
  });

  return allPosters.slice(0, limit);
}

/**
 * Get all posters from all sources (Supabase preferred, fallback to KB + external)
 *
 * @param options - Query options
 * @returns Array of Poster objects
 */
export async function getAllElectionPosters(
  options: GetAllElectionPostersOptions = {}
): Promise<Poster[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured) {
    const supabasePosters = await getPostersFromSupabase(options);
    if (supabasePosters && supabasePosters.length > 0) {
      return supabasePosters;
    }
    // If Supabase returned empty or errored, fall through to fallback
    console.info('Supabase returned no data, using KB API fallback');
  } else {
    console.info('Supabase not configured, using KB API fallback');
  }

  // Fallback to KB API + external sources
  return getPostersFromFallback(options);
}

/**
 * Get a single poster by ID
 *
 * Tries Supabase first, then falls back to KB API and external sources.
 */
export async function getPosterById(id: string): Promise<Poster | null> {
  // Try Supabase first
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('v_election_posters')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return transformSupabasePoster(data);
      }
    } catch (err) {
      console.warn('Failed to fetch poster from Supabase:', err);
    }
  }

  // Fallback: search in external sources
  const externalPosters = getAllExternalPosters();
  const externalMatch = externalPosters.find(p => p.id === id);
  if (externalMatch) {
    return externalMatch;
  }

  // Fallback: try KB API directly (id might be a dark-ID like "dark-123456")
  try {
    // First try direct fetch
    const kbPoster = await getKBPosterById(id);
    if (kbPoster) {
      return transformKBPoster(kbPoster);
    }

    // If that fails, search in the collection
    const response = await searchPoliticalPosters({ limit: 200 });
    const foundPoster = response.hits.find(p => p['@id'].includes(id));
    if (foundPoster) {
      return transformKBPoster(foundPoster);
    }
  } catch (err) {
    console.warn('Failed to fetch poster from KB API:', err);
  }

  return null;
}

/**
 * Get posters by party
 */
export async function getPostersByParty(
  party: string,
  options: Omit<GetAllElectionPostersOptions, 'party'> = {}
): Promise<Poster[]> {
  return getAllElectionPosters({ ...options, party });
}

/**
 * Get posters by year range
 */
export async function getPostersByYearRange(
  fromYear: number,
  toYear: number,
  options: Omit<GetAllElectionPostersOptions, 'fromYear' | 'toYear'> = {}
): Promise<Poster[]> {
  return getAllElectionPosters({ ...options, fromYear, toYear });
}

/**
 * Search posters with filter utilities
 *
 * Uses the testable filter-utils for proper party/theme matching.
 */
export async function searchPosters(filters: PosterFilters): Promise<Poster[]> {
  // Get all posters first (with basic Supabase filters if available)
  const allPosters = await getAllElectionPosters({
    limit: 500,
    sort: '-year',
    fromYear: filters.fromYear,
    toYear: filters.toYear,
  });

  // Apply client-side filtering using filter-utils
  return filterPosters(allPosters, filters);
}

/**
 * Get featured posters for homepage
 *
 * Returns a curated selection of visually striking posters.
 */
export async function getFeaturedPosters(limit: number = 5): Promise<Poster[]> {
  const allPosters = await getAllElectionPosters({ limit: 100, sort: '-year' });

  // Prioritize posters with images
  const withImages = allPosters.filter(
    p => p.storagePublicUrl || p.thumbnailUrl || p.imageUrl || p.iiifImageBaseUrl
  );

  // Try to get variety across decades and parties
  const selected: Poster[] = [];
  const usedDecades = new Set<number>();
  const usedParties = new Set<string>();

  for (const poster of withImages) {
    if (selected.length >= limit) break;

    const decade = poster.year ? Math.floor(poster.year / 10) * 10 : 0;
    const party = poster.party?.toLowerCase() || 'unknown';

    // Prioritize diversity
    if (!usedDecades.has(decade) || !usedParties.has(party)) {
      selected.push(poster);
      usedDecades.add(decade);
      usedParties.add(party);
    }
  }

  // Fill remaining slots if needed
  while (selected.length < limit && selected.length < withImages.length) {
    const next = withImages.find(p => !selected.includes(p));
    if (next) selected.push(next);
    else break;
  }

  return selected;
}

/**
 * Get related posters (same party or era)
 */
export async function getRelatedPosters(
  poster: Poster,
  limit: number = 6
): Promise<Poster[]> {
  const allPosters = await getAllElectionPosters({ limit: 200 });

  // Filter out the current poster
  const others = allPosters.filter(p => p.id !== poster.id);

  // Score by relevance
  const scored = others.map(p => {
    let score = 0;

    // Same party is highly relevant
    if (poster.party && p.party && p.party.toLowerCase() === poster.party.toLowerCase()) {
      score += 10;
    }

    // Same decade is relevant
    if (poster.year && p.year) {
      const posterDecade = Math.floor(poster.year / 10) * 10;
      const pDecade = Math.floor(p.year / 10) * 10;
      if (posterDecade === pDecade) {
        score += 5;
      }
    }

    // Has image is a plus
    if (p.storagePublicUrl || p.thumbnailUrl || p.imageUrl) {
      score += 2;
    }

    return { poster: p, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.poster);
}

// Re-export filter utilities for convenience
export { filterPosters, type PosterFilters } from './filter-utils';
