import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { searchPoliticalPosters, transformKBPoster } from '@/lib/kb-api';
import { PosterViewer } from '@/components/poster-viewer';
import { RightsBadge } from '@/components/rights-badge';
import { MotionPlakat } from '@/components/motion-assets';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const response = await searchPoliticalPosters({ limit: 200 });
  const kbPoster = response.hits.find((p) => p['@id'].includes(id));

  if (!kbPoster) {
    return {
      title: 'Affisch ej funnen',
    };
  }

  const poster = transformKBPoster(kbPoster);

  return {
    title: `${poster.title}${poster.year ? ` (${poster.year})` : ''}`,
    description: `${poster.title}${poster.year ? ` (${poster.year})` : ''} — Politisk valaffisch från Kungliga bibliotekets samlingar.`,
    openGraph: {
      title: poster.title,
      description: `Politisk valaffisch${poster.year ? ` från ${poster.year}` : ''}`,
      images: poster.thumbnailUrl ? [{ url: poster.thumbnailUrl }] : [],
    },
  };
}

export default async function PosterPage({ params }: PageProps) {
  const { id } = await params;

  const response = await searchPoliticalPosters({ limit: 200 });
  const kbPoster = response.hits.find((p) => p['@id'].includes(id));

  if (!kbPoster) {
    notFound();
  }

  const poster = transformKBPoster(kbPoster);

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
                      {poster.year}
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
              <div className="mt-10">
                <a
                  href={poster.kbDigitaltUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-3 border border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
                >
                  Visa på KB Digitalt
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

              {/* Attribution */}
              <div className="mt-10 pt-6 border-t border-[var(--border)]">
                <p className="caption">
                  <span className="text-[var(--text-primary)]">Källa:</span> Kungliga biblioteket / KB Digitalt
                </p>
                <p className="caption mt-1">
                  <span className="text-[var(--text-primary)]">Rättighetsstatus:</span> Se ovan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
