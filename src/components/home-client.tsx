'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MotionArkiv, MotionDatapunkter } from '@/components/motion-assets';
import { KenBurnsHero } from '@/components/ken-burns-hero';
import {
  StaggeredDataTags,
  FadeInSection,
  TypewriterText,
  ScrollLinkedMotion,
} from '@/components/home-scroll-effects';
import type { Poster } from '@/lib/types';
import { resolvePosterImage, shouldSkipOptimization } from '@/lib/poster-image';

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
  const heroDataTags = [
    `${allPosters.length} affischer`,
    `${decades} årtionden`,
    `${partiesCount} partier`,
    'IIIF deep zoom',
    'AI-analyserad text',
    'Public domain · Fair use',
  ];

  const arkivDataTags = [
    'Kungliga biblioteket',
    'Wikimedia Commons',
    'Stockholmskällan',
    'DigitaltMuseum',
    'Affischerna 1967—1979',
    'SD · M · MP officiella arkiv',
  ];

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* ============================================================
          01. KEN BURNS HERO — affischerna ÄR videon.
          Full-screen crossfade + slow zoom genom kuraterad sekvens av
          ikoniska public-domain-affischer. Dataland-stil där materialet
          självt är det centrala, inte UI:t.
          ============================================================ */}
      <KenBurnsHero
        posters={heroPosters}
        yearMin={yearMin}
        yearMax={yearMax}
        totalCount={allPosters.length}
      />

      {/* ============================================================
          01b. INTRO under hero — kontextualisera vad man precis sett
          ============================================================ */}
      <section className="py-32 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeInSection>
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <p className="meta">{yearMin}—{yearMax} · Sverige</p>
              </div>
              <div className="lg:col-span-7">
                <p className="editorial-quote">
                  Innan radio. Före TV. Långt före sociala medier. Affischen var
                  det enda mediet som fanns mellan partiet och väljaren.
                </p>
                <p className="lead mt-10">
                  {allPosters.length} dokument över hur svenska partier har tävlat om
                  din uppmärksamhet i mer än 130 år. Från Allmänna valmansförbundet
                  och Sveriges socialdemokratiska arbetareparti till Sverigedemokraterna
                  och Miljöpartiet de gröna.
                </p>
              </div>
            </div>

            <StaggeredDataTags tags={heroDataTags} className="mt-16" />
          </FadeInSection>
        </div>
      </section>

      {/* ============================================================
          02. FEATURED — affischerna talar, UI tystar
          ============================================================ */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <FadeInSection>
            <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
              <div className="lg:col-span-7">
                <p className="meta">Ur samlingen</p>
                <h2 className="h1 mt-6 italic">Affischer som formade Sverige.</h2>
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                <Link
                  href="/affischer"
                  className="inline-flex items-center text-lg border-b border-current pb-1 hover:opacity-70 transition-opacity"
                >
                  Hela samlingen →
                </Link>
              </div>
            </div>
          </FadeInSection>

          {/* Asymmetric grid: första posten dubbelstor */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((poster, i) => (
              <FadeInSection key={poster.id} delay={i * 0.05}>
                <Link
                  href={`/affischer/${poster.id}`}
                  className={`group block ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <div className="relative bg-[var(--bg-secondary)] aspect-[3/4] overflow-hidden">
                    {resolvePosterImage(poster) && (
                      <Image
                        src={resolvePosterImage(poster)}
                        alt={poster.title}
                        fill
                        sizes={
                          i === 0
                            ? '(max-width: 768px) 100vw, 50vw'
                            : '(max-width: 768px) 50vw, 25vw'
                        }
                        className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        unoptimized={shouldSkipOptimization(resolvePosterImage(poster))}
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="meta">{poster.year}</p>
                    <h3 className="mt-2 text-base text-[var(--text-primary)] line-clamp-2 group-hover:underline underline-offset-4">
                      {poster.title}
                    </h3>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          03. ARKIVET — full bredd, mörk, staggered datatags
          ============================================================ */}
      <section className="section-fullbleed dark py-32 border-y border-[var(--border-strong)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 items-center">
          <ScrollLinkedMotion className="lg:col-span-5">
            <MotionArkiv className="text-[var(--text-inverse)]" />
          </ScrollLinkedMotion>

          <FadeInSection className="lg:col-span-6 lg:col-start-7">
            <p className="meta">Arkivet</p>
            <h2 className="h1 mt-6 italic">Sex källor. En tidslinje.</h2>
            <p className="lead mt-8 max-w-xl text-[rgba(255,255,255,0.7)]">
              Materialet kommer från Kungliga biblioteket, Wikimedia Commons,
              Stockholmskällan, DigitaltMuseum, partiarkiven och Affischerna 1967—1979.
              Varje affisch bär sin källa öppet.
            </p>

            <StaggeredDataTags
              tags={arkivDataTags}
              className="mt-12 text-[rgba(255,255,255,0.5)]"
            />
          </FadeInSection>
        </div>
      </section>

      {/* ============================================================
          04. AI-ANALYS — scroll-linked MotionDatapunkter
          ============================================================ */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <FadeInSection className="lg:col-span-7">
              <p className="meta">Maskinläst arkiv</p>
              <h2 className="h1 mt-6 italic">
                Vilka ord har format svensk politik?
              </h2>
              <p className="lead mt-8 max-w-xl">
                Vi låter Claude läsa varje affisch — transkribera text, identifiera
                retoriska grepp, kategorisera tonläge. Resultatet: två upplevelser där
                130 år av kampanjretorik kan utforskas som data.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-6">
                <Link
                  href="/ord"
                  className="inline-flex items-center text-lg border-b border-current pb-1 hover:opacity-70 transition-opacity"
                >
                  Ord-explorer →
                </Link>
                <Link
                  href="/tonlage"
                  className="inline-flex items-center text-lg border-b border-current pb-1 hover:opacity-70 transition-opacity"
                >
                  Tonlägespektrum →
                </Link>
              </div>
            </FadeInSection>

            <ScrollLinkedMotion className="lg:col-span-4 lg:col-start-9">
              <MotionDatapunkter className="text-[var(--text-primary)]" />
            </ScrollLinkedMotion>
          </div>
        </div>
      </section>

      {/* ============================================================
          05. FINAL CTA — typewriter-effekt
          ============================================================ */}
      <section className="section-fullbleed dark py-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <FadeInSection>
            <p className="meta">Stig in</p>
          </FadeInSection>
          <TypewriterText
            text="Två kvadratmeter papper. Ett vallöfte. 130 år."
            className="display mt-8 italic max-w-4xl"
          />
          <FadeInSection delay={0.5}>
            <div className="mt-16 flex flex-wrap gap-12">
              <Link
                href="/affischer"
                className="inline-flex items-center text-xl border-b border-current pb-1 hover:opacity-70 transition-opacity"
              >
                Bläddra i samlingen →
              </Link>
              <Link
                href="/tidslinje"
                className="inline-flex items-center text-xl border-b border-current pb-1 hover:opacity-70 transition-opacity"
              >
                Följ tidslinjen →
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
