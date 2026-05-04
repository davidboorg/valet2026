'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Poster } from '@/lib/types';
import { resolvePosterImage, shouldSkipOptimization } from '@/lib/poster-image';

interface AnimatedHeroProps {
  posters: Poster[];
}

export function AnimatedHero({ posters }: AnimatedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPoster, setCurrentPoster] = useState(0);
  const [isZooming, setIsZooming] = useState(true);

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Cycle through posters
  useEffect(() => {
    if (posters.length <= 1) return;

    const interval = setInterval(() => {
      setIsZooming(false);
      setTimeout(() => {
        setCurrentPoster((prev) => (prev + 1) % Math.min(posters.length, 5));
        setIsZooming(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [posters.length]);

  const poster = posters[currentPoster];
  if (!poster) return null;

  // Get high-res image URL
  const resolvedImage = resolvePosterImage(poster);
  const imageUrl = resolvedImage.startsWith('/')
    ? resolvedImage
    : resolvedImage.replace('/200,/', '/1200,/');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[var(--bg-dark)]"
    >
      {/* Animated poster background with zoom effect */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: isZooming ? [1, 1.15] : 1,
            opacity: 1
          }}
          transition={{
            scale: { duration: 8, ease: "easeOut" },
            opacity: { duration: 1 }
          }}
          key={currentPoster}
        >
          <Image
            src={imageUrl}
            alt={poster.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            unoptimized={shouldSkipOptimization(imageUrl)}
          />
        </motion.div>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-dark)] via-[var(--bg-dark)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-transparent to-[var(--bg-dark)]/30" />

        {/* Scan line effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center"
        style={{ y: textY, opacity }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Text content */}
            <div className="lg:col-span-7">
              {/* Year badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-6"
              >
                <span className="inline-block px-4 py-2 bg-[var(--accent)] text-[var(--text-inverse)] text-sm font-medium tracking-wider uppercase">
                  1892 — 1951
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="font-[var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-normal text-[var(--text-inverse)] leading-[0.95]"
              >
                <span className="italic">Svenska</span>
                <br />
                <span className="font-bold">valaffischer</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-6 font-[var(--font-playfair)] text-2xl md:text-3xl text-[#A8A29E] italic"
              >
                ett digitalt museum
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 text-lg text-[#A8A29E] max-w-lg leading-relaxed"
              >
                Utforska 130 år av politisk kommunikation. Zooma in på detaljer
                som berättar historien om svensk demokrati.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link
                  href="/affischer"
                  className="group inline-flex items-center px-8 py-4 bg-[var(--accent)] text-[var(--text-inverse)] text-lg font-medium hover:bg-[var(--accent-hover)] transition-all duration-300"
                >
                  <span>Utforska samlingen</span>
                  <motion.svg
                    className="ml-3 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </Link>
                <Link
                  href="/tidslinje"
                  className="inline-flex items-center px-8 py-4 border border-[#A8A29E]/30 text-[#A8A29E] text-lg hover:border-[var(--text-inverse)] hover:text-[var(--text-inverse)] transition-all duration-300"
                >
                  Tidslinje
                </Link>
              </motion.div>
            </div>

            {/* Poster preview card */}
            <motion.div
              className="lg:col-span-4 lg:col-start-9 hidden lg:block"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Link
                href={`/affischer/${poster.id}`}
                className="group block"
              >
                <motion.div
                  className="relative bg-[var(--bg-primary)] p-4 shadow-2xl"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={resolvedImage.startsWith('/') ? resolvedImage : resolvedImage.replace('/200,/', '/600,/')}
                      alt={poster.title}
                      fill
                      sizes="400px"
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                      Från samlingen
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                      {poster.year}
                    </p>
                  </div>

                  {/* Hover reveal */}
                  <motion.div
                    className="absolute inset-0 bg-[var(--accent)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    <span className="text-[var(--text-inverse)] font-medium">
                      Zooma in →
                    </span>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-[#A8A29E]"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scrolla</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Poster indicator dots */}
      {posters.length > 1 && (
        <div className="absolute bottom-8 right-8 z-10 flex gap-2">
          {posters.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsZooming(false);
                setTimeout(() => {
                  setCurrentPoster(index);
                  setIsZooming(true);
                }, 300);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPoster
                  ? 'bg-[var(--accent)] w-6'
                  : 'bg-[#A8A29E]/40 hover:bg-[#A8A29E]'
              }`}
              aria-label={`Visa affisch ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
