import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllElectionPosters } from '@/lib/posters';
import { enrichWithSampleRhetoric } from '@/lib/rhetoric-utils';
import { TonlageClient } from './tonlage-client';

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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-3">
            Retorisk analys
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Tonlägen i valretoriken
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl">
            Politisk kommunikation växlar mellan hopp och hot, uppror och lugn.
            Utforska hur tonlägen fördelat sig över tid och mellan partier.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-8 mb-12 pb-8 border-b border-[var(--border)]">
          <div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{postersWithTone}</p>
            <p className="text-sm text-[var(--text-secondary)]">analyserade affischer</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">6</p>
            <p className="text-sm text-[var(--text-secondary)]">tonlägen</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {new Set(enrichedPosters.filter(p => p.year).map(p => Math.floor(p.year! / 10) * 10)).size}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">årtionden</p>
          </div>
        </div>

        {/* Main visualization */}
        <TonlageClient posters={enrichedPosters} />

        {/* Context section */}
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-[var(--text-primary)] mb-4">
            Om tonlägesanalysen
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-[var(--text-secondary)]">
            <div>
              <p className="mb-4">
                Vi kategoriserar affischernas retoriska tonläge i sex huvudkategorier:
                hoppfull, hotande, saklig, nostalgisk, upprorisk och lugn. Varje affisch
                kan ha ett dominant tonläge baserat på ordval, bildspråk och helhetskänsla.
              </p>
              <p>
                Tonläget &quot;upprorisk&quot; var vanligare i arbetarrörelsens tidiga affischer,
                medan &quot;saklig&quot; och &quot;lugn&quot; blivit vanligare i modern tid.
                &quot;Hotande&quot; retorik dyker upp kring kriser och hot mot samhället.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Analyserna är preliminära och baseras på en kombination av manuell
                kategorisering och mönsterigenkänning. I framtiden kommer vi använda
                AI-assisterad analys för att utöka datasettet.
              </p>
              <p>
                <Link href="/affischer" className="text-[var(--accent)] hover:underline">
                  Bläddra bland affischerna →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Link to related features */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/ord"
            className="group p-6 bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <h3 className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              Ord-explorer
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Utforska de vanligaste orden i valaffischer genom ett interaktivt ordmoln.
            </p>
          </Link>
          <Link
            href="/affischer"
            className="group p-6 bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <h3 className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              Samlingen
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Bläddra bland alla affischer med retorik-läge aktiverat.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
