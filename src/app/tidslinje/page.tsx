import { Suspense } from 'react';
import Link from 'next/link';
import { getAllElectionPosters } from '@/lib/posters';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { VerticalTimeline } from '@/components/vertical-timeline';
import type { Poster } from '@/lib/types';

// Force dynamic — KB API timeout vid Vercel build i USA
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tidslinje — Valaffischen',
  description: 'Utforska svenska valaffischer genom historien. Filtrera på parti och årtionde.',
};

// Fetch parties from Supabase
async function getParties() {
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .order('founded_year', { ascending: true });

  if (error) {
    console.error('Failed to fetch parties:', error);
    return [];
  }

  return data || [];
}

// Fetch election contexts from Supabase
async function getElectionContexts() {
  const { data, error } = await supabase
    .from('election_contexts')
    .select('election_year, headline, key_issues')
    .order('election_year', { ascending: true });

  if (error) {
    console.error('Failed to fetch election contexts:', error);
    return [];
  }

  return data || [];
}

// Fetch posters from Supabase with curation data
async function getPostersFromSupabase(): Promise<Poster[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('posters')
    .select(`
      *,
      poster_curation (
        attributed_party,
        election_year,
        themes
      )
    `)
    .order('year', { ascending: true });

  if (error) {
    console.error('Failed to fetch posters from Supabase:', error);
    return [];
  }

  if (!data || data.length === 0) return [];

  return data.map((p): Poster => ({
    id: p.kb_digitalt_id,
    source: 'kb',
    kbDigitaltId: p.kb_digitalt_id,
    title: p.title,
    creator: p.creator || undefined,
    year: p.year || undefined,
    iiifImageBaseUrl: p.iiif_image_base_url,
    thumbnailUrl: p.iiif_image_base_url
      ? `${p.iiif_image_base_url}/full/200,/0/default.jpg`
      : '',
    rightsStatus: p.rights_status as 'free' | 'restricted',
    kbDigitaltUrl: p.kb_digitalt_url,
    sourceUrl: p.kb_digitalt_url,
    sourceAttribution: 'Kungliga biblioteket',
    party: (p.poster_curation as { attributed_party?: string }[])?.[0]?.attributed_party || undefined,
  }));
}

function TimelineSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 animate-pulse">
      <div className="h-10 w-64 bg-[var(--bg-secondary)] mb-8" />
      <div className="space-y-12">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="h-8 w-32 bg-[var(--bg-secondary)] mb-4" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="aspect-[3/4] bg-[var(--bg-secondary)]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function TidslinjePage() {
  // getAllElectionPosters returnerar både KB (1892-1951) OCH externa
  // (Wikimedia/affischerna/Stockholmskällan/SD/M/etc) — så hela tidslinjen
  // 1893-2022 syns, inte bara KB-eran som stannar 1951.
  const [allPosters, parties, electionContexts] = await Promise.all([
    getAllElectionPosters({ limit: 500, sort: '-year' }),
    getParties(),
    getElectionContexts(),
  ]);

  // Behåll bara poster med både bild och år — tidslinjen visar visuella ankaren.
  const posters: Poster[] = allPosters.filter(
    (p) => (p.thumbnailUrl || p.imageUrl) && p.year
  );

  // Räkna täckning per årtionde
  const decadeCounts = new Map<number, number>();
  for (const p of posters) {
    if (!p.year) continue;
    const dec = Math.floor(p.year / 10) * 10;
    decadeCounts.set(dec, (decadeCounts.get(dec) ?? 0) + 1);
  }
  const yearMin = Math.min(...posters.map(p => p.year!));
  const yearMax = Math.max(...posters.map(p => p.year!));

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Editorial hero — full skärmbredd, tyst, bara typografi och datapunkter */}
      <section className="pt-40 pb-20 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="meta">{yearMin}—{yearMax}  ·  Riksdagsval</p>
          <h1 className="display mt-6 italic">
            Tidslinje
          </h1>
          <p className="lead mt-8 max-w-2xl">
            {posters.length} valaffischer från svenska riksdagsval, ordnade kronologiskt.
            Materialet täcker mer än 130 år — från Allmänna valmansförbundets formering
            till Sverigedemokraternas inträde i regeringsunderlag.
          </p>

          {/* Datatag-rad i dataland-stil */}
          <div className="data-tags mt-12">
            <span>{yearMax - yearMin} år</span>
            <span>{decadeCounts.size} årtionden</span>
            <span>{new Set(posters.filter(p => p.party).map(p => p.party)).size} partier</span>
            <span>{posters.length} affischer</span>
            <span>{parties.length} partiprofiler</span>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-24">
        <Suspense fallback={<TimelineSkeleton />}>
          <VerticalTimeline
            posters={posters}
            parties={parties}
            electionContexts={electionContexts}
          />
        </Suspense>
      </section>

      {/* CTA — mörk, full bredd, dataland-stil */}
      <section className="section-fullbleed dark py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="meta">Sök vidare</p>
              <h2 className="h1 mt-6 italic">
                Filtrera, jämför, bläddra.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Link
                href="/affischer"
                className="inline-flex items-center text-lg border-b border-current pb-1 hover:opacity-70 transition-opacity"
              >
                Till samlingen →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
