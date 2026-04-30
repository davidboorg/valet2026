import type { Poster } from '@/lib/types';
import { PosterCard } from './poster-card';

interface PosterGridProps {
  posters: Poster[];
  loading?: boolean;
  showRhetoric?: boolean;
}

export function PosterGrid({ posters, loading = false, showRhetoric = false }: PosterGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[var(--bg-secondary)] rounded-sm aspect-[3/4]"
          />
        ))}
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="text-center py-24">
        <svg
          className="mx-auto h-16 w-16 text-[var(--border)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-6 font-[var(--font-playfair)] text-xl text-[var(--text-primary)]">
          Inga affischer hittades
        </h3>
        <p className="mt-2 text-[var(--text-secondary)]">
          Prova att ändra din sökning eller ta bort filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {posters.map((poster, index) => (
        <PosterCard
          key={poster.id}
          poster={poster}
          priority={index < 10}
          showRhetoric={showRhetoric}
        />
      ))}
    </div>
  );
}
