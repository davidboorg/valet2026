/**
 * Poster image resolver
 *
 * Prioriteringsordning för bildkällor:
 * 1. Supabase Storage (storagePublicUrl) — vår primära bildkälla
 * 2. Lokalt cachad bild (public/affischer/) — legacy/fallback
 * 3. Externa URL:er (thumbnailUrl, imageUrl) — sista utväg
 *
 * Supabase Storage är nu den föredragna källan efter migrering.
 * Den lokala cachen (poster-manifest.json) behålls som fallback.
 */

import type { Poster } from './types';

// Statisk import av manifestet. Om filen inte finns blir det tom mapping
// och vi fallback:ar till externa URL:er.
let manifest: Record<string, string> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  manifest = require('../../data/poster-manifest.json');
} catch {
  manifest = {};
}

export const POSTER_MANIFEST = manifest;

/**
 * Returnerar bästa tillgängliga URL för en affisch.
 *
 * Prioriteringsordning:
 * 1. Supabase Storage URL (om uppladdad)
 * 2. Lokalt cachad bild i public/affischer/
 * 3. Extern thumbnailUrl
 * 4. Extern imageUrl
 * 5. Tom sträng (caller måste hantera "ingen bild")
 */
export function resolvePosterImage(poster: Poster): string {
  // 1. Supabase Storage (primär källa efter migrering)
  if (poster.storagePublicUrl) {
    return poster.storagePublicUrl;
  }

  // 2. Lokal cache (legacy fallback)
  const local = manifest[poster.id];
  if (local) return local;

  // 3-4. Externa URL:er
  return poster.thumbnailUrl || poster.imageUrl || '';
}

/**
 * Returnerar full-resolution URL — föredrar storage/lokal kopia,
 * annars går direkt till imageUrl (originalupplösning) över thumbnailUrl.
 */
export function resolvePosterFullImage(poster: Poster): string {
  // 1. Supabase Storage (primär källa)
  if (poster.storagePublicUrl) {
    return poster.storagePublicUrl;
  }

  // 2. Lokal cache
  const local = manifest[poster.id];
  if (local) return local;

  // 3. Externa URL:er (imageUrl har högre upplösning)
  return poster.imageUrl || poster.thumbnailUrl || '';
}

/**
 * Är den här affischens bild hostad av oss (Storage eller lokal)?
 * Användbart för att visa "hosted" vs "extern källa"-badge.
 */
export function isLocallyHosted(poster: Poster): boolean {
  return Boolean(poster.storagePublicUrl || manifest[poster.id]);
}

/**
 * Är bilden uppladdad till Supabase Storage?
 */
export function isInStorage(poster: Poster): boolean {
  return Boolean(poster.storagePublicUrl);
}

/**
 * Hur många affischer i en lista är hostade av oss?
 */
export function countLocallyHosted(posters: Poster[]): number {
  return posters.filter(isLocallyHosted).length;
}

/**
 * Hur många affischer i en lista är i Supabase Storage?
 */
export function countInStorage(posters: Poster[]): number {
  return posters.filter(isInStorage).length;
}

/**
 * Bildkälla för debugging/admin
 */
export type ImageSource = 'storage' | 'local' | 'external' | 'none';

export function getImageSource(poster: Poster): ImageSource {
  if (poster.storagePublicUrl) return 'storage';
  if (manifest[poster.id]) return 'local';
  if (poster.thumbnailUrl || poster.imageUrl) return 'external';
  return 'none';
}
