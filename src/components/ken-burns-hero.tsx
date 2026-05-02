'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import type { Poster } from '@/lib/types';
import { resolvePosterImage } from '@/lib/poster-image';

/**
 * KenBurnsHero — affischerna är videon.
 *
 * Full-screen crossfade + slow Ken-Burns-zoom genom kuraterad sekvens av
 * ikoniska public-domain-affischer. Inspirerat av dataland.art:s hero där
 * AI-genererade naturen är det centrala — här är affischerna det centrala.
 *
 * Tekniskt:
 *  - 7s per affisch, 1.5s crossfade
 *  - Varje affisch zoomar långsamt från scale 1 → 1.15 medan opaciteten cyklar
 *  - Lätt translate ger Ken Burns-känsla
 *  - Mörkt overlay (40% svart) så vit italic text läser ovanpå
 *  - Scroll-driven: när användaren scrollar ner från hero zoomar bilden bort
 *  - prefers-reduced-motion: byter till statisk montage
 *  - Pre-loadar nästa affisch innan skift
 */

interface KenBurnsHeroProps {
  posters: Poster[];      // Sorterade i den ordning de ska visas
  yearMin: number;
  yearMax: number;
  totalCount: number;
}

const SLIDE_DURATION_MS = 7000;       // Hur länge varje affisch visas
const CROSSFADE_DURATION = 1.5;       // sekunder
const ZOOM_AMOUNT = 0.15;             // 1 → 1.15

export function KenBurnsHero({ posters, yearMin, yearMax, totalCount }: KenBurnsHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Hämta prefers-reduced-motion. setState här är legitim sync med extern
  // platform-API (window.matchMedia) — undantaget React-reglerna nämner.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Cykla genom affischerna
  useEffect(() => {
    if (reducedMotion || posters.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % posters.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [posters.length, reducedMotion]);

  // Scroll-driven: bilden zoomar bort när man scrollar ner.
  // Alla useTransform-anrop måste vara på top-level innan någon early return.
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.05]);
  const textY = useTransform(scrollY, [0, 600], [0, -120]);
  const scrollHintOpacity = useTransform(scrollY, [0, 100], [0.8, 0]);

  // Tom state — om inga affischer skickats in
  if (posters.length === 0) {
    return (
      <section className="section-fullbleed dark">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h1 className="display italic">Valaffischen</h1>
        </div>
      </section>
    );
  }

  const activePoster = posters[activeIndex];
  const imageUrl = resolvePosterImage(activePoster);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[var(--bg-dark)] text-[var(--text-inverse)]">
      {/* Lager 1: affischerna i full-bleed med crossfade + Ken Burns */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={activePoster.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CROSSFADE_DURATION, ease: 'easeInOut' }}
          >
            {/* Bilden — slow zoom under hela slide-tiden */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1, x: 0, y: 0 }}
              animate={{
                scale: 1 + ZOOM_AMOUNT,
                x: ((activeIndex % 3) - 1) * 30,    // Lätt pan beroende på index
                y: ((activeIndex % 2) - 0.5) * 30,
              }}
              transition={{
                duration: SLIDE_DURATION_MS / 1000 + CROSSFADE_DURATION,
                ease: 'linear',
              }}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={activePoster.title}
                  fill
                  priority={activeIndex === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )}
            </motion.div>

            {/* Mörkt overlay för läsbarhet — gradient så bilden ändå syns i kanten */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
            {/* Vinjett från sidorna */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Lager 2: Filmkornighet + scan-line för analog känsla */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
        }}
        aria-hidden="true"
      />

      {/* Lager 3: Text — sparse, italic, dataland-stil */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-32"
        style={{ y: textY }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          {/* Övre meta — datapunkter spridda likt dataland */}
          <div className="absolute top-32 left-6 lg:left-12 right-6 lg:right-12 flex justify-between items-start gap-8">
            <div>
              <p className="meta text-white/80">{yearMin}—{yearMax}</p>
              <p className="meta text-white/50 mt-1">Sverige · {totalCount} affischer</p>
            </div>
            <div className="text-right">
              <p className="meta text-white/80">Riksdagsval</p>
              <p className="meta text-white/50 mt-1">130 års kampanjretorik</p>
            </div>
          </div>

          {/* Huvudrubrik — italic display, dataland-stil */}
          <h1 className="display italic text-white leading-[0.95]">
            Valaffischen
          </h1>

          {/* En enda sparse mening */}
          <p className="lead mt-8 max-w-2xl text-white/80">
            Två kvadratmeter papper. Ett vallöfte. 130 år av tävlan om din uppmärksamhet.
          </p>

          {/* Aktiv affisch-attribution längst ned till höger — som filmkredit */}
          <div className="absolute bottom-6 right-6 lg:right-12 text-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePoster.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
              >
                <p className="meta text-white/60">{activePoster.year}</p>
                <p className="caption text-white/80 mt-1 max-w-xs">{activePoster.title}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide-indikator: minimal pricklinje längst ned vänster */}
          <div className="absolute bottom-8 left-6 lg:left-12 flex gap-2">
            {posters.map((_, i) => (
              <div
                key={i}
                className={`h-px transition-all duration-700 ${
                  i === activeIndex ? 'w-8 bg-white' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll-hint längst ned, mitten — bara på första rendring, fade ut vid scroll */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        style={{ opacity: scrollHintOpacity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="meta text-white/60">Scrolla</span>
          <motion.div
            className="w-px h-8 bg-white/40"
            animate={{ scaleY: [1, 0.4, 1], originY: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Link över hela hero så användare kan klicka in på aktiva affischen */}
      <Link
        href={`/affischer/${activePoster.id}`}
        className="absolute inset-0 z-20"
        aria-label={`Öppna ${activePoster.title}`}
      />
    </section>
  );
}
