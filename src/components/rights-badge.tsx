import Link from 'next/link';

export type RightsStatus = 'free' | 'restricted' | 'fair_use' | 'unknown';

interface RightsBadgeProps {
  status: RightsStatus;
  className?: string;
  showLink?: boolean;
}

const RIGHTS_CONFIG: Record<RightsStatus, {
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  title: string;
}> = {
  free: {
    label: 'Fritt att använda',
    shortLabel: 'Fritt',
    color: '#3D7A5F',
    bgColor: '#3D7A5F1A', // 10% opacity
    title: 'Public Domain — fritt att använda utan begränsningar',
  },
  restricted: {
    label: 'Begränsad användning',
    shortLabel: 'Begränsad',
    color: '#B8860B',
    bgColor: '#B8860B1A',
    title: 'Upphovsrättsskyddat — thumbnail visas med länk till källa',
  },
  fair_use: {
    label: 'Citat/utbildning',
    shortLabel: 'Citat',
    color: '#7C6955',
    bgColor: '#7C69551A',
    title: 'Visas enligt URL §23 för kritik och utbildning',
  },
  unknown: {
    label: 'Status okänd',
    shortLabel: 'Okänd',
    color: '#6B7280',
    bgColor: '#6B72801A',
    title: 'Rättighetsstatus ej fastställd — använd försiktigt',
  },
};

export function RightsBadge({ status, className = '', showLink = false }: RightsBadgeProps) {
  const config = RIGHTS_CONFIG[status];

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-sm transition-colors ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
      title={config.title}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.color }}
        aria-hidden="true"
      />
      {config.shortLabel}
    </span>
  );

  if (showLink) {
    return (
      <Link href="/om/rattigheter" className="hover:opacity-80 transition-opacity">
        {badge}
      </Link>
    );
  }

  return badge;
}

/**
 * Expanded rights section for detail pages
 */
interface RightsInfoProps {
  status: RightsStatus;
  source?: string;
  sourceUrl?: string;
  sourceAttribution?: string;
  rightsNote?: string;
}

export function RightsInfo({
  status,
  source,
  sourceUrl,
  sourceAttribution,
  rightsNote
}: RightsInfoProps) {
  const config = RIGHTS_CONFIG[status];

  return (
    <div className="p-4 bg-[var(--bg-secondary)] border-l-2" style={{ borderColor: config.color }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs uppercase tracking-[0.15em] font-medium text-[var(--text-secondary)] mb-2">
            Rättigheter & källa
          </h3>
          <RightsBadge status={status} showLink className="mb-3" />

          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {config.title}
          </p>

          {rightsNote && (
            <p className="text-sm text-[var(--text-primary)] mb-3">
              {rightsNote}
            </p>
          )}

          {/* Fair use disclaimer */}
          {status === 'fair_use' && (
            <p className="text-xs text-[var(--text-secondary)] italic mb-3">
              Visning sker enligt URL §23 (citaträtten) för kritik, recension och
              vetenskaplig framställning. Ej för kommersiellt bruk.
            </p>
          )}

          {/* Source attribution */}
          {(sourceAttribution || source) && (
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-medium">Källa:</span>{' '}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                >
                  {sourceAttribution || source}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                sourceAttribution || source
              )}
            </p>
          )}
        </div>
      </div>

      <Link
        href="/om/rattigheter"
        className="inline-flex items-center gap-1 mt-4 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
      >
        Läs mer om rättigheter
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

/**
 * Compact rights indicator for cards/grid
 */
export function RightsIndicator({ status }: { status: RightsStatus }) {
  const config = RIGHTS_CONFIG[status];

  return (
    <div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: config.color }}
      title={config.title}
      aria-label={config.label}
    />
  );
}

/**
 * Get rights configuration (for use in other components)
 */
export function getRightsConfig(status: RightsStatus) {
  return RIGHTS_CONFIG[status];
}
