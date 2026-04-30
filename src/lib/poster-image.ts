/**
 * Poster image resolver
 *
 * Returnerar lokal sökväg (/affischer/<id>.jpg) om bilden är cachad i
 * public/affischer/, annars extern URL som fallback.
 *
 * Cachen byggs av `scripts/download-posters.ts` och dess output ligger i
 * `data/poster-manifest.json`. Vi importerar manifestet vid build-time så
 * resolveringen är synkron och inte kräver runtime-fetch.
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
 * 1. Lokalt cachad bild i public/affischer/ (om manifest har den)
 * 2. Extern thumbnailUrl
 * 3. Extern imageUrl
 * 4. Tom sträng (caller måste hantera "ingen bild")
 */
export function resolvePosterImage(poster: Poster): string {
  const local = manifest[poster.id];
  if (local) return local;
  return poster.thumbnailUrl || poster.imageUrl || '';
}

/**
 * Returnerar full-resolution URL — föredrar lokal kopia om finns,
 * annars går direkt till imageUrl (originalupplösning) över thumbnailUrl.
 */
export function resolvePosterFullImage(poster: Poster): string {
  const local = manifest[poster.id];
  if (local) return local;
  return poster.imageUrl || poster.thumbnailUrl || '';
}

/**
 * Är den här affischens bild lokalt cachad?
 * Användbart för att t.ex. visa "live från KB"-badge eller "lokal kopia".
 */
export function isLocallyHosted(poster: Poster): boolean {
  return Boolean(manifest[poster.id]);
}

/**
 * Hur många affischer i en lista är lokalt cachade?
 * Bra för debug/admin-vyer.
 */
export function countLocallyHosted(posters: Poster[]): number {
  return posters.filter(isLocallyHosted).length;
}
