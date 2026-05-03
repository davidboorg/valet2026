/**
 * Poster data layer — centraliserad datahämtning för valaffischer
 *
 * Prioriterar Supabase om konfigurerad, annars fallback till KB API + statiska arrays.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { searchPoliticalPosters, filterElectionYearPosters, transformKBPoster } from './kb-api';
import { getAllExternalPosters } from './external-sources';
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
 * Tries Supabase first, then falls back to searching KB API and external sources.
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

  // Fallback: try KB API (the id might be a dark-ID)
  // Note: This would require getPosterById from kb-api which fetches from KB directly
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
