import type { Metadata } from 'next';
import { getAllElectionPosters } from '@/lib/posters';
import {
  analyzeWords,
  getTopWords,
  toWordCloudItems,
  enrichWithSamples,
} from '@/lib/word-analysis';
import { OrdExplorerClient } from './ord-explorer-client';
import { MotionDatapunkter } from '@/components/motion-assets';

export const metadata: Metadata = {
  title: 'Ord-explorer — Valaffischen',
  description: 'Utforska de vanligaste orden i svenska valaffischer genom historien. Se hur det politiska språket förändrats över 130 år.',
};

// Force dynamic rendering — KB API timeout vid Vercel build i USA
export const dynamic = 'force-dynamic';

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
      {/* Hero section — mörk, editorial */}
      <section className="section-fullbleed dark py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="meta">Maskinläst arkiv</p>
              <h1 className="display mt-6 italic">
                Demokratins ordförråd
              </h1>
              <p className="lead mt-8 max-w-xl text-[rgba(255,255,255,0.7)]">
                Vilka ord har format svensk politik? Utforska språket i {stats.totalPosters} valaffischer
                från {stats.yearRange.min} till {stats.yearRange.max}.
              </p>

              {/* Datatag-rad */}
              <div className="data-tags mt-12">
                <span>{stats.totalWords} unika ord</span>
                <span>{stats.totalPosters} affischer</span>
                <span>{stats.yearRange.max - stats.yearRange.min} år</span>
                <span>Textanalys + AI</span>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <MotionDatapunkter className="text-[var(--text-inverse)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Demo data disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-4">
          <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
            <span className="font-medium">Demo-data:</span> Ordanalys inkluderar mönsterbaserad kategorisering.
            Fullständig AI-transkribering pågår.
          </p>
        </div>
      </div>

      {/* Interactive word cloud */}
      <OrdExplorerClient
        words={wordCloudItems}
        parties={allParties}
        decades={allDecades}
      />

      {/* Context section */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <p className="meta">Metod</p>
          <h2 className="h1 mt-4 italic">Om analysen</h2>

          <p className="lead mt-8">
            Ord-explorern analyserar text från valaffischernas slogans, rubriker och
            transkriberat innehåll. Genom att studera vilka ord som återkommer kan vi
            se mönster i hur partierna kommunicerat med väljarna över tid.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <p className="meta mb-3">1890–1930</p>
              <h3 className="h3">Tidiga budskap</h3>
              <p className="caption mt-3">
                Fokus på klass, arbete, rösträtt och rättvisa. Språket var direkt
                och agiterande — affischerna talade till en publik som skulle mobiliseras.
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <p className="meta mb-3">1930–1960</p>
              <h3 className="h3">Folkhemmets tid</h3>
              <p className="caption mt-3">
                Trygghet, gemenskap och framsteg blir centrala. Retorik om nationell
                enighet ersätter klassretorik.
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <p className="meta mb-3">1980–idag</p>
              <h3 className="h3">Modern politik</h3>
              <p className="caption mt-3">
                Individualism, valfrihet och förändring. Språket blir mer personligt
                och emotionellt — partierna talar om &ldquo;du&rdquo; snarare än &ldquo;folket&rdquo;.
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <p className="meta mb-3">Luckor</p>
              <h3 className="h3">Vad saknas?</h3>
              <p className="caption mt-3">
                Analysen baseras på tillgänglig data. KB täcker primärt 1892–1951.
                Modern data kommer från partiarkiv och medier.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
