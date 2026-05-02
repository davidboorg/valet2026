'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Poster } from '@/lib/types';
import { resolvePosterImage } from '@/lib/poster-image';
import { RightsBadge } from './rights-badge';
import { ToneBadge } from './rhetoric-overlay';

interface PosterCardProps {
  poster: Poster;
  priority?: boolean;
  size?: 'default' | 'large';
  showRhetoric?: boolean;
}

export function PosterCard({ poster, priority = false, size = 'default', showRhetoric = false }: PosterCardProps) {
  const resolvedImage = resolvePosterImage(poster);
  // Lokala bilder (startar med /) behöver ingen IIIF-transformation
  // IIIF-URLs (innehåller /200,/) kan transformeras till större storlek
  const imageUrl = resolvedImage.startsWith('/')
    ? resolvedImage
    : size === 'large'
      ? resolvedImage.replace('/200,/', '/600,/')
      : resolvedImage.replace('/200,/', '/400,/');

  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link
        href={`/affischer/${poster.id}`}
        className="block"
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden rounded-sm shadow-sm group-hover:shadow-xl transition-shadow duration-500">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {resolvedImage ? (
            <Image
              src={imageUrl}
              alt={poster.title}
              fill
              sizes={size === 'large' ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-110"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--text-secondary)]">
              <svg
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Year badge - appears on hover */}
          {poster.year && (
            <motion.div
              className="absolute top-4 left-4 z-20"
              initial={false}
              animate={{ opacity: 0, y: -8 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-3 py-1 bg-[var(--accent)] text-white text-sm font-bold shadow-lg">
                {poster.year}
              </span>
            </motion.div>
          )}
          {/* Show year on group hover via CSS */}
          {poster.year && (
            <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="inline-block px-3 py-1 bg-[var(--accent)] text-white text-sm font-bold shadow-lg">
                {poster.year}
              </span>
            </div>
          )}

          {/* View button - appears on hover */}
          <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
            <span className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[var(--text-primary)] font-medium text-sm rounded-sm shadow-lg hover:bg-[var(--accent)] hover:text-white transition-colors">
              Zooma in
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </span>
          </div>

          {/* Rights badge */}
          <div className="absolute top-4 right-4 z-20">
            <RightsBadge status={poster.rightsStatus} />
          </div>

          {/* Tone badge - small indicator when rhetoric mode is active */}
          {showRhetoric && poster.tone && (
            <div className="absolute bottom-4 left-4 z-20 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <ToneBadge tone={poster.tone} />
            </div>
          )}

          {/* Focus ring for accessibility */}
          <div className="absolute inset-0 rounded-sm ring-0 group-focus-within:ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-primary)] transition-all" />
        </div>

        {/* Metadata */}
        <div className="mt-4 space-y-1">
          <h3 className="font-[family-name:var(--font-playfair)] text-base font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-300">
            {poster.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            {poster.year && (
              <span className="uppercase tracking-[0.1em]">{poster.year}</span>
            )}
            {poster.year && poster.creator && (
              <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
            )}
            {poster.creator && (
              <span className="truncate">{poster.creator}</span>
            )}
          </div>

          {/* Party badge if available */}
          {poster.party && (
            <div className="pt-1">
              <span className="inline-block text-xs px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-sm">
                {poster.party}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
