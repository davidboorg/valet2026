import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPosterById, getRelatedPosters } from '@/lib/posters';
import { resolvePosterImage, shouldSkipOptimization } from '@/lib/poster-image';
import { PosterViewer } from '@/components/poster-viewer';
import { RightsBadge } from '@/components/rights-badge';
import { MotionPlakat } from '@/components/motion-assets';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const poster = await getPosterById(id);

  if (!poster) {
    return {
      title: 'Affisch ej funnen',
    };
  }

  const imageUrl = resolvePosterImage(poster);

  return {
    title: `${poster.title}${poster.year ? ` (${poster.year})` : ''}`,
    description: `${poster.title}${poster.year ? ` (${poster.year})` : ''} — Politisk valaffisch från svenska riksdagsval.`,
    openGraph: {
      title: poster.title,
      description: `Politisk valaffisch${poster.year ? ` från ${poster.year}` : ''}`,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function PosterPage({ params }: PageProps) {
  const { id } = await params;

  const poster = await getPosterById(id);

  if (!poster) {
    notFound();
  }

  // Get related posters for the "more like this" section
  const relatedPosters = await getRelatedPosters(poster, 6);
  const imageUrl = resolvePosterImage(poster);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4">
        <nav aria-label="Brödsmulor">
          <ol className="flex items-center gap-2 caption">
            <li>
              <Link href="/" className="hover:opacity-70 transition-opacity">
                Hem
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/affischer" className="hover:opacity-70 transition-opacity">
                Samlingen
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--text-primary)] truncate max-w-[200px]">
              {poster.year || 'Affisch'}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main content - 60/40 split per spec */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Poster Viewer - 60% (3/5) - Dark background per spec */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--bg-dark)] overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-[70vh]">
              {poster.iiifImageBaseUrl ? (
                <PosterViewer
                  imageServiceId={poster.iiifImageBaseUrl}
                  title={poster.title}
                  className="w-full h-full"
                />
              ) : imageUrl ? (
                <div className="w-full h-full relative">
                  <Image
                    src={imageUrl}
                    alt={poster.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"
                    unoptimized={shouldSkipOptimization(imageUrl)}
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-inverse)]">
                  <MotionPlakat className="w-32 h-32 opacity-30" />
                  <p className="mt-6 meta text-[var(--text-inverse)]/50">Ingen bild tillgänglig</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Panel - 40% (2/5) */}
          <div className="lg:col-span-2">
            <div className="sticky top-32">
              {/* Title */}
              <h1 className="h2 italic">
                {poster.title}
              </h1>

              {/* Metadata */}
              <dl className="mt-8 space-y-6">
                {poster.year && (
                  <div>
                    <dt className="meta">År</dt>
                    <dd className="mt-1 body-text">
                      <Link href={`/affischer?year=${poster.year}`} className="hover:underline">
                        {poster.year}
                      </Link>
                    </dd>
                  </div>
                )}

                {poster.party && (
                  <div>
                    <dt className="meta">Parti</dt>
                    <dd className="mt-1 body-text">
                      <Link href={`/affischer?parti=${poster.party.toLowerCase()}`} className="hover:underline">
                        {poster.party}
                      </Link>
                    </dd>
                  </div>
                )}

                {poster.slogan && (
                  <div>
                    <dt className="meta">Slogan</dt>
                    <dd className="mt-1 body-text italic">
                      &ldquo;{poster.slogan}&rdquo;
                    </dd>
                  </div>
                )}

                {poster.creator && (
                  <div>
                    <dt className="meta">Upphovsman</dt>
                    <dd className="mt-1 body-text">
                      {poster.creator}
                    </dd>
                  </div>
                )}

                {poster.themes && poster.themes.length > 0 && (
                  <div>
                    <dt className="meta">Teman</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {poster.themes.map((theme) => (
                        <span
                          key={theme}
                          className="px-2 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                        >
                          {theme}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                {poster.collection && (
                  <div>
                    <dt className="meta">Samling</dt>
                    <dd className="mt-1 body-text">
                      {poster.collection}
                    </dd>
                  </div>
                )}

                {poster.genreForm && poster.genreForm.length > 0 && (
                  <div>
                    <dt className="meta">Kategori</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {poster.genreForm.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                        >
                          {genre}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="meta">Rättigheter</dt>
                  <dd className="mt-2">
                    <RightsBadge status={poster.rightsStatus} />
                  </dd>
                </div>

                {poster.reginaId && (
                  <div>
                    <dt className="meta">Regina-ID</dt>
                    <dd className="mt-1 font-mono text-sm text-[var(--text-secondary)]">
                      {poster.reginaId}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Actions */}
              {(poster.sourceUrl || poster.kbDigitaltUrl) && (
                <div className="mt-10">
                  <a
                    href={poster.sourceUrl || poster.kbDigitaltUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 border border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
                  >
                    Visa original
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

              {/* Attribution */}
              <div className="mt-10 pt-6 border-t border-[var(--border)]">
                <p className="caption">
                  <span className="text-[var(--text-primary)]">Källa:</span>{' '}
                  {poster.sourceAttribution || getSourceName(poster.source)}
                </p>
                {poster.rightsNote && (
                  <p className="caption mt-1">
                    <span className="text-[var(--text-primary)]">Rättighetsinformation:</span>{' '}
                    {poster.rightsNote}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related posters */}
        {relatedPosters.length > 0 && (
          <section className="mt-16 pt-16 border-t border-[var(--border)]">
            <h2 className="h3 mb-8">Liknande affischer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedPosters.map((related) => {
                const relatedImage = resolvePosterImage(related);
                return (
                  <Link
                    key={related.id}
                    href={`/affischer/${related.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden">
                      {relatedImage && (
                        <Image
                          src={relatedImage}
                          alt={related.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-contain group-hover:scale-105 transition-transform"
                          unoptimized={shouldSkipOptimization(relatedImage)}
                        />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 group-hover:text-[var(--text-primary)] transition-colors">
                      {related.title}
                    </p>
                    {related.year && (
                      <p className="text-xs text-[var(--text-secondary)]">{related.year}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Get human-readable source name
 */
function getSourceName(source: string): string {
  const sourceNames: Record<string, string> = {
    kb: 'Kungliga biblioteket',
    wikimedia: 'Wikimedia Commons',
    arab: 'Arbetarrörelsens arkiv',
    affischerna: 'Affischerna.se',
    sd_party: 'Sverigedemokraterna',
    moderaterna_party: 'Moderaterna',
    media_archive: 'Mediaarkiv',
    external: 'Extern källa',
  };
  return sourceNames[source] || source;
}
