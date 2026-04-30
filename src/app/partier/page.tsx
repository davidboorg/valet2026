import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Partier — Valaffischen',
  description: 'Utforska valaffischer från svenska politiska partier genom historien.',
};

// Swedish political parties data with logo paths
const parties = [
  {
    name: 'Socialdemokraterna',
    abbreviation: 'S',
    slug: 'socialdemokraterna',
    historicalNames: ['Sveriges socialdemokratiska arbetareparti', 'SAP'],
    foundedYear: 1889,
    color: '#E8112D',
    logo: '/partier/socialdemokraterna.svg',
    active: true,
    description: 'Sveriges äldsta och största politiska parti, grundat 1889 av August Palm och Hjalmar Branting. Dominerade svensk politik under stora delar av 1900-talet.',
  },
  {
    name: 'Moderaterna',
    abbreviation: 'M',
    slug: 'moderaterna',
    historicalNames: ['Högerpartiet', 'Allmänna valmansförbundet'],
    foundedYear: 1904,
    color: '#52BDEC',
    logo: '/partier/moderaterna.svg',
    active: true,
    description: 'Konservativt parti som genomgått flera namnbyten. Kallades Högerpartiet fram till 1969, då man antog namnet Moderata samlingspartiet.',
  },
  {
    name: 'Centerpartiet',
    abbreviation: 'C',
    slug: 'centerpartiet',
    historicalNames: ['Bondeförbundet'],
    foundedYear: 1913,
    color: '#009933',
    logo: '/partier/centerpartiet.svg',
    active: true,
    description: 'Grundades som Bondeförbundet 1913 för att representera landsbygdens intressen. Bytte namn till Centerpartiet 1957.',
  },
  {
    name: 'Vänsterpartiet',
    abbreviation: 'V',
    slug: 'vansterpartiet',
    historicalNames: ['Vänsterpartiet kommunisterna', 'VPK', 'Sveriges kommunistiska parti', 'SKP'],
    foundedYear: 1917,
    color: '#DA291C',
    logo: '/partier/vansterpartiet.svg',
    active: true,
    description: 'Bildades 1917 som utbrytning ur Socialdemokraterna. Har genomgått flera namn- och ideologiska förändringar.',
  },
  {
    name: 'Liberalerna',
    abbreviation: 'L',
    slug: 'liberalerna',
    historicalNames: ['Folkpartiet', 'Folkpartiet liberalerna', 'FP'],
    foundedYear: 1934,
    color: '#006AB3',
    logo: '/partier/liberalerna.svg',
    active: true,
    description: 'Liberalt parti som hette Folkpartiet fram till 2015. Har sina rötter i 1800-talets liberala rörelse.',
  },
  {
    name: 'Kristdemokraterna',
    abbreviation: 'KD',
    slug: 'kristdemokraterna',
    historicalNames: ['Kristen demokratisk samling', 'KDS'],
    foundedYear: 1964,
    color: '#000077',
    logo: '/partier/kristdemokraterna.svg',
    active: true,
    description: 'Kristdemokratiskt parti grundat 1964. Kom in i riksdagen 1991 efter att ha passerat spärren.',
  },
  {
    name: 'Miljöpartiet',
    abbreviation: 'MP',
    slug: 'miljopartiet',
    historicalNames: ['Miljöpartiet de gröna'],
    foundedYear: 1981,
    color: '#83CF39',
    logo: '/partier/miljopartiet.svg',
    active: true,
    description: 'Grönt parti grundat 1981. Kom in i riksdagen första gången 1988.',
  },
  {
    name: 'Sverigedemokraterna',
    abbreviation: 'SD',
    slug: 'sverigedemokraterna',
    historicalNames: [],
    foundedYear: 1988,
    color: '#005BAA',
    logo: '/partier/sverigedemokraterna.svg',
    active: true,
    description: 'Nationalkonservativt parti grundat 1988. Kom in i riksdagen 2010.',
  },
  {
    name: 'Högerpartiet',
    abbreviation: null,
    slug: 'hogerpartiet',
    historicalNames: ['Allmänna valmansförbundet'],
    foundedYear: 1904,
    color: '#1B49DD',
    logo: '/partier/hogerpartiet.svg',
    active: false,
    description: 'Historiskt namn för Moderaterna, använt 1934–1969. Många valaffischer bär detta namn.',
  },
  {
    name: 'Bondeförbundet',
    abbreviation: null,
    slug: 'bondeforbundet',
    historicalNames: [],
    foundedYear: 1913,
    color: '#008000',
    logo: '/partier/bondeforbundet.svg',
    active: false,
    description: 'Historiskt namn för Centerpartiet, använt 1913–1957. Representerade landsbygdens och böndernas intressen.',
  },
];

export default function PartierPage() {
  const activeParties = parties.filter((p) => p.active);
  const historicalParties = parties.filter((p) => !p.active);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Editorial hero */}
      <section className="pt-40 pb-20 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="meta">Utforska efter</p>
              <h1 className="display mt-6 italic">Partier</h1>
              <p className="lead mt-8 max-w-2xl">
                Valaffischer från svenska politiska partier — från arbetarrörelsens
                tidiga agitation till dagens etablerade partisystem.
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 hidden lg:flex flex-wrap gap-3 justify-end">
              {activeParties.slice(0, 8).map((party) => (
                <div
                  key={party.slug}
                  className="w-10 h-10 overflow-hidden border border-[var(--border)]"
                >
                  <Image
                    src={party.logo}
                    alt={party.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Datatag-rad */}
          <div className="data-tags mt-12">
            <span>{activeParties.length} riksdagspartier</span>
            <span>{historicalParties.length} historiska</span>
            <span>1889–idag</span>
          </div>
        </div>
      </section>

      {/* Active parties grid */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="meta">Nuvarande</p>
          <h2 className="h1 mt-4 italic">Riksdagspartier</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {activeParties.map((party) => (
              <Link
                key={party.slug}
                href={`/partier/${party.slug}`}
                className="group block"
              >
                <div className="bg-[var(--bg-secondary)] p-6 border border-[var(--border)] hover:border-[var(--border-strong)] transition-opacity hover:opacity-80">
                  {/* Logo */}
                  <div className="w-16 h-16 mb-4 mx-auto">
                    <Image
                      src={party.logo}
                      alt={`${party.name} logotyp`}
                      width={64}
                      height={64}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Party name */}
                  <h3 className="h3 text-center">{party.name}</h3>

                  {/* Abbreviation */}
                  {party.abbreviation && (
                    <p className="meta text-center mt-2">{party.abbreviation}</p>
                  )}

                  {/* Founded year */}
                  <p className="caption text-center mt-3">
                    Grundat {party.foundedYear}
                  </p>

                  {/* Historical names */}
                  {party.historicalNames.length > 0 && (
                    <p className="caption italic text-center mt-2">
                      Tidigare: {party.historicalNames.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Historical parties */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="meta">Arkiv</p>
          <h2 className="h1 mt-4 italic">Historiska partier</h2>
          <p className="lead mt-6 max-w-2xl">
            Dessa partier existerar inte längre under samma namn, men deras affischer
            är viktiga tidsdokument från demokratins framväxt.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {historicalParties.map((party) => (
              <Link
                key={party.slug}
                href={`/partier/${party.slug}`}
                className="group block"
              >
                <div className="flex items-center gap-6 p-6 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-opacity hover:opacity-80">
                  {/* Logo */}
                  <div className="w-14 h-14 flex-shrink-0">
                    <Image
                      src={party.logo}
                      alt={`${party.name} logotyp`}
                      width={56}
                      height={56}
                      className="w-full h-full grayscale"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="h3 truncate">{party.name}</h3>
                      <span className="meta whitespace-nowrap">
                        {party.foundedYear}–
                      </span>
                    </div>
                    <p className="caption line-clamp-2">
                      {party.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Context section — mörk CTA */}
      <section className="section-fullbleed dark py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="meta">Historisk kontext</p>
              <blockquote className="editorial-quote mt-6 text-[var(--text-inverse)]">
                &ldquo;Det svenska partisystemet formades under kampen för demokrati.
                Affischerna visar hur partierna presenterade sig för väljare
                som ofta för första gången fick göra sin röst hörd.&rdquo;
              </blockquote>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="p-8 border border-[rgba(255,255,255,0.2)]">
                <p className="meta">Visste du att...</p>
                <p className="body-text mt-4 text-[rgba(255,255,255,0.7)]">
                  1921 var första valet med allmän rösträtt. Partierna behövde
                  nu nå helt nya väljargrupper — arbetare, bönder, kvinnor —
                  och affischen blev det viktigaste mediet.
                </p>
                <Link
                  href="/tidslinje?year=1921"
                  className="inline-flex items-center gap-2 mt-6 text-sm border-b border-current pb-0.5 hover:opacity-70 transition-opacity"
                >
                  Se affischer från 1921 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
