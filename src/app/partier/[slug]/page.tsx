import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { searchPoliticalPosters, transformKBPoster } from '@/lib/kb-api';
import type { Poster } from '@/lib/types';
import { resolvePosterImage } from '@/lib/poster-image';

// Party data - same as in page.tsx
// In production, this would come from Supabase
const partiesData: Record<
  string,
  {
    name: string;
    abbreviation: string | null;
    historicalNames: string[];
    foundedYear: number;
    color: string;
    active: boolean;
    description: string;
    longDescription?: string;
  }
> = {
  socialdemokraterna: {
    name: 'Socialdemokraterna',
    abbreviation: 'S',
    historicalNames: ['Sveriges socialdemokratiska arbetareparti', 'SAP'],
    foundedYear: 1889,
    color: '#E8112D',
    active: true,
    description: 'Sveriges äldsta och största politiska parti.',
    longDescription: `Socialdemokraterna grundades 1889 och har dominerat svensk politik under större delen av 1900-talet. Partiets affischer speglar utvecklingen från arbetarrörelsens tidiga kamp till välfärdsstatens uppbyggnad.

De tidiga affischerna kännetecknas av klassisk arbetarikonografi — röda fanor, sammanslutna händer, industriarbetare. Under mellankrigstiden utvecklades ett mer sofistikerat bildspråk, och Per Albin Hanssons folkhemsbegrepp fick visuellt uttryck.

Efterkrigstidens affischer präglas av optimism och framtidstro, medan 1970- och 80-talens affischer ofta har en mer defensiv ton mot Moderaternas utmaningar.`,
  },
  moderaterna: {
    name: 'Moderaterna',
    abbreviation: 'M',
    historicalNames: ['Högerpartiet', 'Allmänna valmansförbundet'],
    foundedYear: 1904,
    color: '#52BDEC',
    active: true,
    description: 'Konservativt parti med rötter i 1800-talets höger.',
    longDescription: `Moderaterna har genomgått flera namnbyten som speglar partiets ideologiska utveckling. Som Allmänna valmansförbundet (1904–1934) och sedan Högerpartiet (1934–1969) var partiet öppet konservativt.

Namnbytet till Moderata samlingspartiet 1969 markerade en ideologisk omorientering mot mer liberal-konservativ position. De äldre affischerna har ofta nationalistiska motiv, medan modernare affischer betonar individuell frihet och entreprenörskap.`,
  },
  centerpartiet: {
    name: 'Centerpartiet',
    abbreviation: 'C',
    historicalNames: ['Bondeförbundet'],
    foundedYear: 1913,
    color: '#009933',
    active: true,
    description: 'Från bondeförbund till grönt centerparti.',
    longDescription: `Centerpartiet grundades 1913 som Bondeförbundet för att företräda landsbygdens intressen. Affischerna från den tidiga perioden visar bondeikonografi — åkermark, sädeskärvar, arbetande bönder.

Namnbytet till Centerpartiet 1957 speglade en breddning av partiets väljarappell. Under kärnkraftsdebatten på 1970- och 80-talen profilerade sig partiet starkt på miljöfrågor.`,
  },
  vansterpartiet: {
    name: 'Vänsterpartiet',
    abbreviation: 'V',
    historicalNames: ['Vänsterpartiet kommunisterna', 'VPK', 'Sveriges kommunistiska parti', 'SKP'],
    foundedYear: 1917,
    color: '#DA291C',
    active: true,
    description: 'Från kommunistparti till demokratisk vänster.',
    longDescription: `Vänsterpartiet bildades 1917 som utbrytning ur Socialdemokraterna. Partiets affischer från den tidiga perioden är starkt påverkade av internationell kommunistisk bildvärld.

Under kalla kriget distanserade sig partiet gradvis från Moskva, och namnbytet från VPK till Vänsterpartiet 1990 markerade en tydlig ideologisk omsvängning.`,
  },
  liberalerna: {
    name: 'Liberalerna',
    abbreviation: 'L',
    historicalNames: ['Folkpartiet', 'Folkpartiet liberalerna', 'FP'],
    foundedYear: 1934,
    color: '#006AB3',
    active: true,
    description: 'Liberalt parti med rötter i frisinne och folkbildning.',
    longDescription: `Liberalerna har sina rötter i 1800-talets liberala rörelse och frisinnet. Partiet bildades i sin moderna form 1934 och hette Folkpartiet fram till 2015.

Affischerna betonar ofta utbildning, frihet och individuella rättigheter. Under Bengt Westerbergs tid på 1990-talet tog partiet ställning mot rasism, vilket avspeglades i kampanjmaterial.`,
  },
  kristdemokraterna: {
    name: 'Kristdemokraterna',
    abbreviation: 'KD',
    historicalNames: ['Kristen demokratisk samling', 'KDS'],
    foundedYear: 1964,
    color: '#000077',
    active: true,
    description: 'Värdekonservativt parti med kristna rötter.',
    longDescription: `Kristdemokraterna grundades 1964 som ett värdekonservativt alternativ. Partiet kämpade länge för att komma in i riksdagen och lyckades först 1991.

Affischerna betonar traditionella värderingar, familj och kristna värden. Partiet har ofta använt varma, positiva bilder i sina kampanjer.`,
  },
  miljopartiet: {
    name: 'Miljöpartiet',
    abbreviation: 'MP',
    historicalNames: ['Miljöpartiet de gröna'],
    foundedYear: 1981,
    color: '#83CF39',
    active: true,
    description: 'Grönt parti fokuserat på miljö och hållbarhet.',
    longDescription: `Miljöpartiet grundades 1981 som en del av den internationella gröna vågen. Partiet kom in i riksdagen första gången 1988.

Affischerna har en distinkt grön profil och fokuserar på miljö, fred och alternativa livsstilar. Partiet har ofta använt okonventionella kampanjmetoder.`,
  },
  sverigedemokraterna: {
    name: 'Sverigedemokraterna',
    abbreviation: 'SD',
    historicalNames: [],
    foundedYear: 1988,
    color: '#DDDD00',
    active: true,
    description: 'Nationalkonservativt parti.',
    longDescription: `Sverigedemokraterna grundades 1988 och kom in i riksdagen 2010. Partiet har genomgått en betydande utveckling sedan starten.

Partiets affischer har förändrats över tid, från tidiga kontroversiella kampanjer till mer professionellt utformade material.`,
  },
  hogerpartiet: {
    name: 'Högerpartiet',
    abbreviation: null,
    historicalNames: ['Allmänna valmansförbundet'],
    foundedYear: 1904,
    color: '#1B49DD',
    active: false,
    description: 'Historiskt namn för Moderaterna (1934–1969).',
    longDescription: `Högerpartiet var namnet på dagens Moderaterna mellan 1934 och 1969. Affischerna från denna period visar ett öppet konservativt parti som betonade nationella värden och stabilitet.

Namnbytet till Moderata samlingspartiet 1969 markerade en medveten modernisering av partiets image.`,
  },
  bondeforbundet: {
    name: 'Bondeförbundet',
    abbreviation: null,
    historicalNames: [],
    foundedYear: 1913,
    color: '#008000',
    active: false,
    description: 'Historiskt namn för Centerpartiet (1913–1957).',
    longDescription: `Bondeförbundet grundades 1913 för att företräda landsbygdens och böndernas intressen. Affischerna från denna period är rika på landsbygdsmotiv och bondeikonografi.

Partiet bytte namn till Centerpartiet 1957 för att bredda sin väljarbas.`,
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const party = partiesData[slug];

  if (!party) {
    return {
      title: 'Parti ej funnet — Valaffischen',
    };
  }

  return {
    title: `${party.name} — Valaffischen`,
    description: party.description,
  };
}

export default async function PartiPage({ params }: Props) {
  const { slug } = await params;
  const party = partiesData[slug];

  if (!party) {
    notFound();
  }

  // Search for posters that might be from this party
  // This is a basic text search — in production, this would use the curation data
  const searchTerms = [party.name, ...party.historicalNames].join(' OR ');

  const response = await searchPoliticalPosters({
    query: searchTerms,
    limit: 50,
    sort: '-datePublished',
  });

  const posters: Poster[] = response.hits.map(transformKBPoster).filter((p) => p.thumbnailUrl);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <nav className="text-sm text-[var(--text-secondary)]">
            <Link href="/partier" className="hover:text-[var(--text-primary)] transition-colors">
              Partier
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--text-primary)]">{party.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="pt-8 pb-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: party.color }}
                />
                {party.abbreviation && (
                  <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                    {party.abbreviation}
                  </span>
                )}
                {!party.active && (
                  <span className="px-2 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded">
                    Historiskt
                  </span>
                )}
              </div>

              <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]">
                {party.name}
              </h1>

              <p className="mt-4 text-lg text-[var(--text-secondary)]">
                Grundat {party.foundedYear}
                {party.historicalNames.length > 0 && (
                  <span className="block mt-1 text-base italic">
                    Tidigare: {party.historicalNames.join(', ')}
                  </span>
                )}
              </p>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="p-6 bg-[var(--bg-secondary)]">
                <p className="font-[var(--font-playfair)] text-3xl font-bold text-[var(--text-primary)]">
                  {posters.length}
                </p>
                <p className="mt-1 text-sm uppercase tracking-wider text-[var(--text-secondary)]">
                  Affischer i samlingen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Long description */}
      {party.longDescription && (
        <section className="pb-16">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl">
              {party.longDescription.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[var(--text-secondary)] leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posters grid */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Affischer
            </h2>
            {posters.length > 12 && (
              <Link
                href={`/affischer?q=${encodeURIComponent(party.name)}`}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Visa alla →
              </Link>
            )}
          </div>

          {posters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {posters.slice(0, 15).map((poster) => {
                const imageUrl = resolvePosterImage(poster);
                return (
                <Link
                  key={poster.id}
                  href={`/affischer/${poster.id}`}
                  className="group card-hover border border-transparent"
                >
                  <div className="relative aspect-[3/4] bg-[var(--bg-primary)]">
                    {imageUrl && (
                    <Image
                      src={imageUrl.startsWith('/') ? imageUrl : imageUrl.replace('/200,/', '/400,/')}
                      alt={poster.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-contain"
                    />
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {poster.title}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                      {poster.year}
                    </p>
                  </div>
                </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--text-secondary)]">
                Inga affischer hittades för detta parti.
              </p>
              <Link
                href="/affischer"
                className="inline-block mt-4 text-[var(--accent)] hover:underline"
              >
                Utforska hela samlingen →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related parties */}
      {party.active && (
        <section className="py-16">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-[var(--text-primary)] mb-8">
              Andra partier
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin">
              {Object.entries(partiesData)
                .filter(([s, p]) => s !== slug && p.active)
                .slice(0, 6)
                .map(([s, p]) => (
                  <Link
                    key={s}
                    href={`/partier/${s}`}
                    className="flex-shrink-0 px-6 py-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-warm)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-medium text-[var(--text-primary)]">{p.name}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[var(--bg-dark)] text-[var(--text-inverse)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold">
            Utforska mer
          </h2>
          <p className="mt-4 text-[#A8A29E]">
            Se affischer från andra partier eller utforska tidslinjen.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/partier"
              className="px-6 py-3 border border-[var(--text-inverse)] text-[var(--text-inverse)] hover:bg-[var(--text-inverse)] hover:text-[var(--bg-dark)] transition-colors"
            >
              Alla partier
            </Link>
            <Link
              href="/tidslinje"
              className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] transition-colors"
            >
              Tidslinje
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
