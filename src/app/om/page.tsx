import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Om projektet',
  description: 'Om Valaffischen - ett digitalt arkiv för svenska valaffischer från Kungliga bibliotekets samlingar.',
};

export default function OmPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-3">
            Om projektet
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Valaffischen
          </h1>

          <div className="mt-12 space-y-8 text-lg text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong className="text-[var(--text-primary)]">Valaffischen</strong> är ett digitalt arkiv som
              gör svenska valaffischer från Kungliga bibliotekets samlingar tillgängliga för
              allmänheten. Materialet spänner över mer än 130 år av politisk kommunikation.
            </p>

            <p>
              Innan radio, television och internet var affischen det främsta mediet för
              politiska budskap. I valrörelser täcktes städernas väggar, anslagstavlor och
              plank av konkurrerande slagord och bilder.
            </p>

            <p>
              Dessa affischer är tidsdokument. De visar hur partierna försökte övertyga
              väljarna, vilka frågor som var aktuella, och hur det politiska språket
              förändrats över tid.
            </p>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-8 max-w-3xl">
          <div className="p-8 bg-[var(--bg-secondary)]">
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[var(--text-primary)] mb-4">
              Källmaterial
            </h2>
            <p className="text-[var(--text-secondary)]">
              Samtliga affischer kommer från{' '}
              <a
                href="https://www.kb.se"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Kungliga bibliotekets
              </a>{' '}
              digitaliserade samlingar. Bilderna är fria att använda under Public Domain
              Mark 1.0.
            </p>
          </div>

          <div className="p-8 bg-[var(--bg-secondary)]">
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[var(--text-primary)] mb-4">
              Tekniken
            </h2>
            <p className="text-[var(--text-secondary)]">
              Museet använder{' '}
              <a
                href="https://iiif.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                IIIF
              </a>{' '}
              (International Image Interoperability Framework) för att visa bilderna i
              hög upplösning med möjlighet att zooma in på detaljer.
            </p>
          </div>
        </div>

        <div className="mt-12 p-8 border border-[var(--border)] max-w-3xl">
          <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[var(--text-primary)] mb-4">
            Syfte
          </h2>
          <p className="text-[var(--text-secondary)]">
            Detta är ett bildningsprojekt utan kommersiellt eller partipolitiskt syfte.
            Målet är att göra demokratins visuella historia tillgänglig och sökbar för
            forskare, studenter, journalister och alla som är intresserade av svensk
            politisk historia.
          </p>
        </div>

        <div className="mt-16 max-w-3xl">
          <Link
            href="/affischer"
            className="inline-flex items-center px-8 py-4 bg-[var(--accent)] text-[var(--text-inverse)] font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Utforska samlingen
            <svg className="ml-3 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
