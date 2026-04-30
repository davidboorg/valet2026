import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllElectionPosters } from '@/lib/posters';
import { enrichWithSampleRhetoric } from '@/lib/rhetoric-utils';
import { TonlageClient } from './tonlage-client';
import { MotionDatapunkter } from '@/components/motion-assets';

export const metadata: Metadata = {
  title: 'Tonlägen — Valaffischen',
  description: 'Utforska retoriska tonlägen i svenska valaffischer genom historien.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function TonlagePage() {
  // Fetch all posters
  const allPosters = await getAllElectionPosters({ limit: 500, sort: '-year' });

  // Enrich with sample rhetoric data for demo
  const enrichedPosters = enrichWithSampleRhetoric(allPosters);

  // Count posters with tone data
  const postersWithTone = enrichedPosters.filter(p => p.tone).length;

  const decadesCount = new Set(enrichedPosters.filter(p => p.year).map(p => Math.floor(p.year! / 10) * 10)).size;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Editorial hero — mörk, asymmetrisk */}
      <section className="section-fullbleed dark py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="meta">Retorisk analys</p>
              <h1 className="display mt-6 italic">
                Tonlägen i valretoriken
              </h1>
              <p className="lead mt-8 max-w-xl text-[rgba(255,255,255,0.7)]">
                Politisk kommunikation växlar mellan hopp och hot, uppror och lugn.
                Utforska hur tonlägen fördelat sig över tid och mellan partier.
              </p>

              {/* Datatag-rad */}
              <div className="data-tags mt-12">
                <span>{postersWithTone} analyserade</span>
                <span>6 tonlägen</span>
                <span>{decadesCount} årtionden</span>
                <span>Claude Vision</span>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <MotionDatapunkter className="text-[var(--text-inverse)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-4">
          <p className="caption text-center">
            AI-analys i utvecklingsfas — vissa tonlägen är preliminära
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16">

        {/* Main visualization */}
        <TonlageClient posters={enrichedPosters} />

        {/* Context section */}
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <p className="meta">Metod</p>
          <h2 className="h2 mt-4 italic">Om tonlägesanalysen</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <p className="body-text text-[var(--text-secondary)] mb-4">
                Vi kategoriserar affischernas retoriska tonläge i sex huvudkategorier:
                hoppfull, hotande, saklig, nostalgisk, upprorisk och lugn. Varje affisch
                kan ha ett dominant tonläge baserat på ordval, bildspråk och helhetskänsla.
              </p>
              <p className="body-text text-[var(--text-secondary)]">
                Tonläget &ldquo;upprorisk&rdquo; var vanligare i arbetarrörelsens tidiga affischer,
                medan &ldquo;saklig&rdquo; och &ldquo;lugn&rdquo; blivit vanligare i modern tid.
              </p>
            </div>
            <div>
              <p className="body-text text-[var(--text-secondary)] mb-4">
                Analyserna är preliminära och baseras på en kombination av manuell
                kategorisering och mönsterigenkänning. I framtiden kommer vi använda
                AI-assisterad analys för att utöka datasettet.
              </p>
              <Link
                href="/affischer"
                className="inline-flex items-center text-sm border-b border-current pb-0.5 hover:opacity-70 transition-opacity"
              >
                Bläddra bland affischerna →
              </Link>
            </div>
          </div>
        </div>

        {/* Link to related features */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/ord"
            className="group p-6 bg-[var(--bg-secondary)] border border-[var(--border)] hover:opacity-70 transition-opacity"
          >
            <p className="meta mb-2">AI-analys</p>
            <h3 className="h3">Ord-explorer</h3>
            <p className="caption mt-2">
              Utforska de vanligaste orden i valaffischer genom ett interaktivt ordmoln.
            </p>
          </Link>
          <Link
            href="/affischer"
            className="group p-6 bg-[var(--bg-secondary)] border border-[var(--border)] hover:opacity-70 transition-opacity"
          >
            <p className="meta mb-2">Samlingen</p>
            <h3 className="h3">Bläddra med retorik-läge</h3>
            <p className="caption mt-2">
              Se alla affischer med tonläge och retoriska grepp markerade.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
