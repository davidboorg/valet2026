import { getAllElectionPosters } from '@/lib/posters';
import { HomeClient } from '@/components/home-client';
import type { Poster } from '@/lib/types';

export const revalidate = 3600;

/**
 * Kuraterad sekvens av 8 ikoniska public-domain-affischer som driver hero.
 * Varje ID matchar en post i src/lib/external-sources.ts (WIKIMEDIA_POSTERS)
 * OCH finns lokalt cachad i public/affischer/ (via poster-manifest.json).
 * Sekvensen är vald för dramaturgi: rösträtt → kosackvalet → folkhemmet →
 * efterkrigstid → välfärd → modern tid. 130 år i 56 sekunder.
 */
const HERO_SEQUENCE_IDS = [
  'wm-1928-h-dalaman',             // Kosackvalet 1928 — den mest kända
  'wm-1917-rostratt',              // Kvinnlig rösträtt — demokratins genombrott
  'wm-1922-engstrom-kraftor',      // Albert Engströms kräftor — folkomröstning
  'wm-1914-h-forsvaret',           // "Försvaret främst" 1914
  'wm-1945-bf',                    // Bondeförbundet "Rättvisa åt landsbygden"
  'wm-1916-sac',                   // 1 Maj 1916 — arbetarrörelsen
  'wm-1928-h-svensk-samling',      // "Välj högern för svensk samling" 1928
  'wm-1912-rostratt',              // Rösträttsmöte 1912
];

export default async function HomePage() {
  const allPosters = await getAllElectionPosters({ limit: 200, sort: '-year' });

  // Bygg hero-sekvens i exakt den kuraterade ordningen
  const posterById = new Map(allPosters.map((p) => [p.id, p]));
  const heroPosters: Poster[] = HERO_SEQUENCE_IDS
    .map((id) => posterById.get(id))
    .filter((p): p is Poster => Boolean(p && (p.imageUrl || p.thumbnailUrl)));

  // Fallback om inga av de kuraterade hittas — använd första 8 fria affischer
  const heroFallback =
    heroPosters.length > 0
      ? heroPosters
      : allPosters
          .filter((p) => p.rightsStatus === 'free' && (p.imageUrl || p.thumbnailUrl))
          .slice(0, 8);

  const featured = allPosters.filter((p) => p.thumbnailUrl || p.imageUrl).slice(0, 8);
  const decades = new Set(
    allPosters.map((p) => (p.year ? Math.floor(p.year / 10) * 10 : null)).filter(Boolean)
  );
  const partiesCount = new Set(allPosters.filter((p) => p.party).map((p) => p.party)).size;

  const yearsWithData = allPosters.filter((p) => p.year).map((p) => p.year!);
  const yearMin = yearsWithData.length > 0 ? Math.min(...yearsWithData) : 1892;
  const yearMax = yearsWithData.length > 0 ? Math.max(...yearsWithData) : 2026;

  return (
    <HomeClient
      allPosters={allPosters}
      heroPosters={heroFallback}
      featured={featured}
      decades={decades.size}
      partiesCount={partiesCount}
      yearMin={yearMin}
      yearMax={yearMax}
    />
  );
}
