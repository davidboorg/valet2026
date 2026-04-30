import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs component
 *
 * Displays hierarchical navigation path.
 * The last item is displayed as current page (no link).
 *
 * Usage:
 * <Breadcrumbs items={[
 *   { label: 'Partier', href: '/partier' },
 *   { label: 'Socialdemokraterna' }
 * ]} />
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Brödsmulor" className={className}>
      <ol className="flex items-center flex-wrap gap-1 text-sm text-[var(--text-secondary)]">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="hover:text-[var(--text-primary)] transition-colors"
            aria-label="Hem"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              <span className="mx-2 text-[var(--text-secondary)]" aria-hidden="true">
                /
              </span>

              {/* Link or current page */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-[var(--text-primary)]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Helper to generate breadcrumb items from a path
 */
export function generateBreadcrumbs(
  path: string,
  currentTitle?: string
): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  // Known path mappings
  const pathLabels: Record<string, string> = {
    affischer: 'Samlingen',
    tidslinje: 'Tidslinje',
    partier: 'Partier',
    utstallningar: 'Utställningar',
    om: 'Om',
  };

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Use custom title for last item if provided
    if (isLast && currentTitle) {
      items.push({ label: currentTitle });
    } else {
      const label = pathLabels[segment] || segment;
      items.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    }
  });

  return items;
}

/**
 * Simple inline breadcrumb trail
 * For use in page headers where full component is too heavy
 */
export function SimpleBreadcrumb({
  parent,
  parentHref,
  current,
}: {
  parent: string;
  parentHref: string;
  current: string;
}) {
  return (
    <nav className="text-sm text-[var(--text-secondary)]" aria-label="Brödsmulor">
      <Link href={parentHref} className="hover:text-[var(--text-primary)] transition-colors">
        {parent}
      </Link>
      <span className="mx-2">/</span>
      <span className="text-[var(--text-primary)]">{current}</span>
    </nav>
  );
}
