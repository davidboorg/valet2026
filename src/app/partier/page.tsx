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
      {/* Hero Header */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-4 font-medium">
            Utforska efter
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6">
            Partier
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Upptäck valaffischer från svenska politiska partier — från arbetarrörelsens
            tidiga agitation till dagens etablerade partisystem.
          </p>

          {/* Party logo preview row */}
          <div className="mt-12 flex flex-wrap gap-4">
            {activeParties.slice(0, 8).map((party) => (
              <div
                key={party.slug}
                className="w-12 h-12 rounded-full overflow-hidden shadow-lg transform hover:scale-110 transition-transform duration-300"
              >
                <Image
                  src={party.logo}
                  alt={party.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active parties grid */}
      <section className="pb-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              Riksdagspartier
            </h2>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeParties.map((party) => (
              <Link
                key={party.slug}
                href={`/partier/${party.slug}`}
                className="group relative"
              >
                <div className="relative bg-[var(--bg-secondary)] p-8 transition-all duration-300 group-hover:bg-[var(--bg-dark)] group-hover:shadow-2xl group-hover:-translate-y-2 overflow-hidden">
                  {/* Color accent bar */}
                  <div
                    className="absolute top-0 left-0 w-full h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{ backgroundColor: party.color }}
                  />

                  {/* Logo */}
                  <div className="w-20 h-20 mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={party.logo}
                      alt={`${party.name} logotyp`}
                      width={80}
                      height={80}
                      className="w-full h-full drop-shadow-lg"
                    />
                  </div>

                  {/* Party name */}
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--text-primary)] group-hover:text-white text-center transition-colors duration-300">
                    {party.name}
                  </h3>

                  {/* Abbreviation badge */}
                  {party.abbreviation && (
                    <div
                      className="mx-auto mt-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: party.color }}
                    >
                      {party.abbreviation}
                    </div>
                  )}

                  {/* Founded year */}
                  <p className="mt-4 text-sm text-[var(--text-secondary)] group-hover:text-gray-400 text-center transition-colors duration-300">
                    Grundat {party.foundedYear}
                  </p>

                  {/* Historical names */}
                  {party.historicalNames.length > 0 && (
                    <p className="mt-3 text-xs text-[var(--text-secondary)] group-hover:text-gray-500 italic text-center transition-colors duration-300">
                      Tidigare: {party.historicalNames.slice(0, 2).join(', ')}
                    </p>
                  )}

                  {/* Hover arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Historical parties */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              Historiska partier
            </h2>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <p className="text-[var(--text-secondary)] mb-10 max-w-2xl text-lg">
            Dessa partier existerar inte längre under samma namn, men deras affischer
            är viktiga tidsdokument från demokratins framväxt.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {historicalParties.map((party) => (
              <Link
                key={party.slug}
                href={`/partier/${party.slug}`}
                className="group"
              >
                <div className="flex items-center gap-6 p-6 bg-[var(--bg-primary)] hover:bg-[var(--bg-warm)] transition-all duration-300 border border-[var(--border)] group-hover:border-[var(--accent)]">
                  {/* Logo */}
                  <div className="w-16 h-16 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <Image
                      src={party.logo}
                      alt={`${party.name} logotyp`}
                      width={64}
                      height={64}
                      className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                        {party.name}
                      </h3>
                      <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                        {party.foundedYear}–
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                      {party.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Context section with visual flair */}
      <section className="py-24 relative overflow-hidden">
        {/* Large decorative text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold text-[var(--bg-secondary)] select-none pointer-events-none whitespace-nowrap">
          1921
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-6 font-medium">
                Historisk kontext
              </p>
              <blockquote className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl italic text-[var(--text-primary)] leading-relaxed">
                &ldquo;Det svenska partisystemet formades under kampen för demokrati.
                Affischerna visar hur partierna presenterade sig för väljare
                som ofta för första gången fick göra sin röst hörd.&rdquo;
              </blockquote>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="p-8 bg-[var(--bg-dark)] text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-4 font-medium">
                  Visste du att...
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  1921 var första valet med allmän rösträtt. Partierna behövde
                  nu nå helt nya väljargrupper — arbetare, bönder, kvinnor —
                  och affischen blev det viktigaste mediet.
                </p>
                <Link
                  href="/tidslinje?year=1921"
                  className="inline-flex items-center gap-2 mt-6 text-[var(--accent)] hover:text-white transition-colors"
                >
                  Se affischer från 1921
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
