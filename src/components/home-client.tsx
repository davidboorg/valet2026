'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Poster } from '@/lib/types';
import { resolvePosterImage, shouldSkipOptimization } from '@/lib/poster-image';
import { LaunchModule } from './launch-module';
import { MetadataTicker, MetadataStrip } from './metadata-ticker';
import { FadeInSection } from './home-scroll-effects';

interface HomeClientProps {
  allPosters: Poster[];
  heroPosters: Poster[];
  featured: Poster[];
  decades: number;
  partiesCount: number;
  yearMin: number;
  yearMax: number;
}

export function HomeClient({
  allPosters,
  heroPosters,
  featured,
  decades,
  partiesCount,
  yearMin,
  yearMax,
}: HomeClientProps) {
  const metadataItems = [
    { value: `${yearMin}–${yearMax}`, label: 'Tidsperiod' },
    { value: allPosters.length, label: 'Affischer' },
    { value: decades, label: 'Årtionden' },
    { value: partiesCount, label: 'Partier' },
  ];

  const sourceStrip = [
    'Kungliga biblioteket',
    'Wikimedia Commons',
    'Stockholmskällan',
    'Partiarkiven',
  ];

  // Pick one hero poster for the institutional landing
  const heroPoster = heroPosters[0];

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* ============================================================
          01. INSTITUTIONELL HERO
          Minimalistisk, monumental. Affischen som huvudobjekt.
          ============================================================ */}
      <section className="min-h-[100svh] flex flex-col">
        {/* Top section: Title and launch info */}
        <div className="pt-32 pb-16 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Valaffischen
            </motion.h1>

            <motion.p
              className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Ett digitalt museum över svensk politisk retorik.
              <br className="hidden md:block" />
              {allPosters.length} affischer. {decades} årtionden. {partiesCount} partier.
            </motion.p>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <LaunchModule variant="hero" />
            </motion.div>
          </div>
        </div>

        {/* Hero poster display */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 pb-16">
          {heroPoster && (
            <motion.div
              className="relative w-full max-w-xl aspect-[3/4]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <Link href={`/affischer/${heroPoster.id}`} className="group block">
                <div className="relative w-full h-full bg-[var(--bg-secondary)] shadow-2xl">
                  {resolvePosterImage(heroPoster) && (
                    <Image
                      src={resolvePosterImage(heroPoster)}
                      alt={heroPoster.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                      priority
                      unoptimized={shouldSkipOptimization(resolvePosterImage(heroPoster))}
                    />
                  )}
                </div>
                <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                  {heroPoster.title}, {heroPoster.year}
                </p>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================================
          02. METADATA TICKER — monumentala siffror
          ============================================================ */}
      <section className="py-24 border-y border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <MetadataTicker items={metadataItems} />
        </div>
      </section>

      {/* ============================================================
          03. SAMLINGEN — kuratorisk introduktion
          ============================================================ */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeInSection>
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="meta tracking-[0.2em]">Samlingen</p>
                <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-light italic leading-tight">
                  Se hur Sveriges partier har försökt övertyga väljare i över hundra år.
                </h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-end">
                <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                  Innan radio. Före TV. Långt före sociala medier. Affischen var
                  det enda mediet som fanns mellan partiet och väljaren. Här finns
                  {' '}{allPosters.length} dokument som visar hur det såg ut.
                </p>
                <Link
                  href="/affischer"
                  className="mt-10 inline-flex items-center text-base border-b border-current pb-1 hover:opacity-70 transition-opacity self-start"
                >
                  Bläddra i samlingen →
                </Link>
              </div>
            </div>
          </FadeInSection>

          {/* Featured posters grid */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featured.slice(0, 4).map((poster, i) => (
              <FadeInSection key={poster.id} delay={i * 0.08}>
                <Link href={`/affischer/${poster.id}`} className="group block">
                  <div className="relative bg-[var(--bg-secondary)] aspect-[3/4] overflow-hidden">
                    {resolvePosterImage(poster) && (
                      <Image
                        src={resolvePosterImage(poster)}
                        alt={poster.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        unoptimized={shouldSkipOptimization(resolvePosterImage(poster))}
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs tracking-[0.15em] uppercase text-[var(--text-secondary)]">
                      {poster.year}
                    </p>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          04. TIDSLINJEN — svart sektion
          ============================================================ */}
      <section className="section-fullbleed dark py-32 lg:py-40 border-y border-[var(--border-strong)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <FadeInSection>
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="meta tracking-[0.2em]">Tidslinjen</p>
                <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-light italic leading-tight">
                  {yearMax - yearMin + 1} år av svensk valretorik.
                </h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-end">
                <p className="text-lg leading-relaxed text-[rgba(255,255,255,0.7)]">
                  Från Allmänna valmansförbundets första anslag till Sverigedemokraternas
                  senaste kampanj. Utforska hur bildspråk, typografi och budskap
                  har förändrats genom {decades} årtionden.
                </p>
                <Link
                  href="/tidslinje"
                  className="mt-10 inline-flex items-center text-base border-b border-current pb-1 hover:opacity-70 transition-opacity self-start"
                >
                  Följ tidslinjen →
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============================================================
          05. ANALYS — AI-läst arkiv
          ============================================================ */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeInSection>
            <div className="max-w-3xl">
              <p className="meta tracking-[0.2em]">Analys</p>
              <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-light italic leading-tight">
                Vilka ord har format svensk politik?
              </h2>
              <p className="mt-10 text-lg leading-relaxed text-[var(--text-secondary)]">
                Vi låter AI läsa varje affisch — transkribera text, identifiera
                retoriska grepp, kategorisera tonläge. Resultatet: {decades} årtionden
                av kampanjretorik som utforskningsbar data.
              </p>
            </div>

            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <Link
                href="/ord"
                className="group block p-8 border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
              >
                <p className="text-xs tracking-[0.15em] uppercase text-[var(--text-secondary)]">
                  Språket
                </p>
                <h3 className="mt-4 text-xl font-light">
                  Ord och slagord genom {yearMax - yearMin + 1} år
                </h3>
                <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Utforska hur ordval och budskap har förändrats över tid.
                  Från &ldquo;Rösta med Bondeförbundet&rdquo; till &ldquo;Trygghet i förändring&rdquo;.
                </p>
                <span className="mt-6 inline-block text-sm border-b border-current pb-0.5 group-hover:opacity-70 transition-opacity">
                  Öppna →
                </span>
              </Link>

              <Link
                href="/tonlage"
                className="group block p-8 border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
              >
                <p className="text-xs tracking-[0.15em] uppercase text-[var(--text-secondary)]">
                  Tonlägen
                </p>
                <h3 className="mt-4 text-xl font-light">
                  Retoriska grepp och känslolägen
                </h3>
                <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Hur har partierna valt att tala — hotfullt, hoppfullt,
                  rationellt, emotionellt? En kartläggning av retorikens register.
                </p>
                <span className="mt-6 inline-block text-sm border-b border-current pb-0.5 group-hover:opacity-70 transition-opacity">
                  Öppna →
                </span>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============================================================
          06. KÄLLORNA — svart sektion
          ============================================================ */}
      <section className="section-fullbleed dark py-24 border-y border-[var(--border-strong)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <FadeInSection>
            <div className="text-center">
              <p className="meta tracking-[0.2em]">Källorna</p>
              <p className="mt-6 text-lg text-[rgba(255,255,255,0.7)]">
                Materialet kommer från öppna arkiv och partiernas egna samlingar.
                Varje affisch bär sin källa öppet.
              </p>
              <MetadataStrip items={sourceStrip} className="mt-10 opacity-60" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============================================================
          07. LAUNCH MODULE — pre-launch signup
          ============================================================ */}
      <LaunchModule variant="section" />

      {/* ============================================================
          08. FINAL CTA — enkel, monumental
          ============================================================ */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeInSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-tight">
                Två kvadratmeter papper.
                <br />
                Ett vallöfte.
                <br />
                {yearMax - yearMin + 1} år.
              </h2>

              <div className="mt-16 flex flex-wrap justify-center gap-8">
                <Link
                  href="/affischer"
                  className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  Bläddra i samlingen
                </Link>
                <Link
                  href="/tidslinje"
                  className="px-8 py-4 border border-[var(--border-strong)] text-sm hover:opacity-70 transition-opacity"
                >
                  Följ tidslinjen
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
