'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

/**
 * Hero med pinned effekt — MotionPlakat stannar kvar lite längre när man scrollar
 */
interface HeroScrollProps {
  children: ReactNode;
  motionAsset: ReactNode;
  dataTags: ReactNode;
}

export function HeroScroll({ children, motionAsset, dataTags }: HeroScrollProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex flex-col justify-end pt-32 pb-16 border-b border-[var(--border)]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">{children}</div>

        <motion.div
          className="lg:col-span-4 lg:col-start-9"
          style={{ opacity, scale, y }}
        >
          {motionAsset}
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full mt-16">
        {dataTags}
      </div>
    </section>
  );
}

/**
 * Staggered datatags — varje tag fadear in en efter en vid scroll
 */
interface StaggeredDataTagsProps {
  tags: string[];
  className?: string;
}

export function StaggeredDataTags({ tags, className = '' }: StaggeredDataTagsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className={`data-tags ${className}`}>
      {tags.map((tag, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}

/**
 * Fade-in sektion — element fadear in när de scrollas in i vy
 */
interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInSection({ children, className = '', delay = 0 }: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Typewriter-effekt för Final CTA
 */
interface TypewriterTextProps {
  text: string;
  className?: string;
}

export function TypewriterText({ text, className = '' }: TypewriterTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const words = text.split(' ');

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}

/**
 * Motion asset med scroll-kopplad intensitet
 */
interface ScrollLinkedMotionProps {
  children: ReactNode;
  className?: string;
}

export function ScrollLinkedMotion({ children, className = '' }: ScrollLinkedMotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Opacity peakar i mitten av viewport
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);

  return (
    <motion.div ref={ref} className={className} style={{ opacity, scale }}>
      {children}
    </motion.div>
  );
}
