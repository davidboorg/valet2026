import type { Metadata } from 'next';
import { getAllElectionPosters } from '@/lib/posters';
import {
  analyzeWords,
  getTopWords,
  toWordCloudItems,
  enrichWithSamples,
} from '@/lib/word-analysis';
import { OrdExplorerClient } from './ord-explorer-client';

export const metadata: Metadata = {
  title: 'Ord-explorer — Valaffischen',
  description: 'Utforska de vanligaste orden i svenska valaffischer genom historien. Se hur det politiska språket förändrats över 130 år.',
};

// Revalidate every hour
export const revalidate = 3600;

export default async function OrdExplorerPage() {
  // Fetch all posters
  const posters = await getAllElectionPosters({ limit: 500, sort: '-year' });

  // Enrich with sample slogans for better data coverage
  const enrichedPosters = enrichWithSamples(posters);

  // Analyze word frequencies
  const wordMap = analyzeWords(enrichedPosters);
  const topWords = getTopWords(wordMap, 120);
  const wordCloudItems = toWordCloudItems(topWords, 80);

  // Get unique parties and decades for filters
  const allParties = [...new Set(enrichedPosters.filter(p => p.party).map(p => p.party!))].sort();
  const allDecades = [...new Set(
    enrichedPosters
      .filter(p => p.year)
      .map(p => Math.floor(p.year! / 10) * 10)
  )].sort();

  // Calculate stats — guard mot tom data, Math.min/max(...[]) ger Infinity/-Infinity
  const yearsWithData = enrichedPosters.filter(p => p.year).map(p => p.year!);
  const stats = {
    totalWords: wordMap.size,
    totalPosters: enrichedPosters.length,
    yearRange: yearsWithData.length > 0
      ? { min: Math.min(...yearsWithData), max: Math.max(...yearsWithData) }
      : { min: 1893, max: 2026 },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[var(--bg-dark)] to-[var(--bg-primary)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-4 font-medium">
            AI-analys
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Demokratins
            <br />
            <span className="italic text-[var(--accent)]">ordförråd</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Vilka ord har format svensk politik? Utforska språket i {stats.totalPosters} valaffischer
            från {stats.yearRange.min} till {stats.yearRange.max}.
          </p>

          {/* Stats row */}
          <div className="mt-12 flex justify-center gap-12">
            <div className="text-center">
              <p className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-white">
                {stats.totalWords}
              </p>
              <p className="text-sm text-gray-500 mt-1">unika ord</p>
            </div>
            <div className="text-center">
              <p className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-white">
                {stats.totalPosters}
              </p>
              <p className="text-sm text-gray-500 mt-1">affischer</p>
            </div>
            <div className="text-center">
              <p className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-white">
                {stats.yearRange.max - stats.yearRange.min}
              </p>
              <p className="text-sm text-gray-500 mt-1">år av historia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive word cloud */}
      <OrdExplorerClient
        words={wordCloudItems}
        parties={allParties}
        decades={allDecades}
      />

      {/* Context section */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-[var(--reading-width)] mx-auto px-6 lg:px-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--text-primary)] mb-8">
            Om analysen
          </h2>

          <div className="prose prose-lg max-w-none space-y-6 text-[var(--text-secondary)]">
            <p>
              Ord-explorern analyserar text från valaffischernas slogans, rubriker och
              transkriberat innehåll. Genom att studera vilka ord som återkommer kan vi
              se mönster i hur partierna kommunicerat med väljarna över tid.
            </p>

            <div className="grid md:grid-cols-2 gap-8 not-prose mt-8">
              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3">
                  Tidiga budskap (1890–1930)
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Fokus på klass, arbete, rösträtt och rättvisa. Språket var direkt
                  och agiterande — affischerna talade till en publik som skulle mobiliseras.
                </p>
              </div>

              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3">
                  Folkhemmets tid (1930–1960)
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Trygghet, gemenskap och framsteg blir centrala. Retorik om nationell
                  enighet ersätter klassretorik — &rdquo;vi&rdquo; blir viktigare än &rdquo;de mot oss&rdquo;.
                </p>
              </div>

              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3">
                  Modern politik (1980–idag)
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Individualism, valfrihet och förändring. Språket blir mer personligt
                  och emotionellt — partierna talar om &rdquo;du&rdquo; snarare än &rdquo;folket&rdquo;.
                </p>
              </div>

              <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3">
                  Vad saknas?
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Analysen baseras på tillgänglig data. KB:s digitaliserade samling
                  täcker primärt 1892–1951. Modern data kommer från partiarkiv och medier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
