import { getAllElectionPosters } from '@/lib/posters';
import { HomeClient } from '@/components/home-client';

export const revalidate = 3600;

export default async function HomePage() {
  const allPosters = await getAllElectionPosters({ limit: 200, sort: '-year' });

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
      featured={featured}
      decades={decades.size}
      partiesCount={partiesCount}
      yearMin={yearMin}
      yearMax={yearMax}
    />
  );
}
