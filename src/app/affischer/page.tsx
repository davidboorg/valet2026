import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllElectionPosters } from '@/lib/posters';
import { filterPosters, PARTIES as PARTY_DEFINITIONS, THEMES as THEME_DEFINITIONS, getUniqueYears } from '@/lib/filter-utils';
import { AffischerClient } from './affischer-client';

// Force dynamic — KB API timeout vid Vercel build i USA
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Samlingen — Valaffischen',
  description: 'Bläddra bland svenska politiska valaffischer från Kungliga bibliotekets samlingar.',
};

// Party filter options using centralized definitions
const PARTIES = PARTY_DEFINITIONS.map(p => ({
  value: p.slug,
  label: p.name,
}));

// Theme filter options using centralized definitions
const THEMES = THEME_DEFINITIONS.map(t => ({
  value: t.slug,
  label: t.name,
}));

interface PageProps {
  searchParams: Promise<{
    q?: string;
    year?: string;
    parti?: string;
    tema?: string;
    page?: string;
  }>;
}

export default async function AffischerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = 24;
  const offset = (page - 1) * limit;

  // Parse filter parameters
  const yearFilter = params.year ? parseInt(params.year, 10) : undefined;
  const partyFilter = params.parti || undefined;
  const themeFilter = params.tema || undefined;
  const queryFilter = params.q && params.q !== '*' ? params.q : undefined;

  // Get all election posters from all sources
  const rawPosters = await getAllElectionPosters({ limit: 500, sort: '-year' });

  // Apply proper filtering using filter-utils
  const allElectionPosters = filterPosters(rawPosters, {
    query: queryFilter,
    party: partyFilter,
    year: yearFilter,
    theme: themeFilter,
  });

  // Generate dynamic election years from actual data
  const ELECTION_YEARS = getUniqueYears(rawPosters).map(y => ({
    value: String(y),
    label: String(y),
  }));

  // Paginate the filtered results
  const posters = allElectionPosters.slice(offset, offset + limit);
  const totalPages = Math.ceil(allElectionPosters.length / limit);

  // Build URL for filter changes
  const buildFilterUrl = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams();
    if (params.q && params.q !== '*' && updates.q !== '') newParams.set('q', updates.q ?? params.q);
    if (params.year && updates.year !== '') newParams.set('year', updates.year ?? params.year);
    if (params.parti && updates.parti !== '') newParams.set('parti', updates.parti ?? params.parti);
    if (params.tema && updates.tema !== '') newParams.set('tema', updates.tema ?? params.tema);

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    const queryString = newParams.toString();
    return `/affischer${queryString ? `?${queryString}` : ''}`;
  };

  // Active filters for display
  const activeFilters: Array<{ type: string; label: string; clearUrl: string }> = [];
  if (queryFilter) {
    activeFilters.push({ type: 'q', label: queryFilter, clearUrl: buildFilterUrl({ q: '' }) });
  }
  if (yearFilter) {
    activeFilters.push({ type: 'year', label: `Valet ${yearFilter}`, clearUrl: buildFilterUrl({ year: '' }) });
  }
  if (partyFilter) {
    const partyLabel = PARTIES.find((p) => p.value === partyFilter)?.label || partyFilter;
    activeFilters.push({ type: 'parti', label: partyLabel, clearUrl: buildFilterUrl({ parti: '' }) });
  }
  if (themeFilter) {
    const themeLabel = THEMES.find((t) => t.value === themeFilter)?.label || themeFilter;
    activeFilters.push({ type: 'tema', label: themeLabel, clearUrl: buildFilterUrl({ tema: '' }) });
  }

  // Beräkna statistik för datatag-raden
  const decades = new Set(
    allElectionPosters.map((p) => (p.year ? Math.floor(p.year / 10) * 10 : null)).filter(Boolean)
  );
  const partiesCount = new Set(allElectionPosters.filter((p) => p.party).map((p) => p.party)).size;
  const yearMin = allElectionPosters.filter((p) => p.year).length > 0
    ? Math.min(...allElectionPosters.filter((p) => p.year).map((p) => p.year!))
    : 1892;
  const yearMax = allElectionPosters.filter((p) => p.year).length > 0
    ? Math.max(...allElectionPosters.filter((p) => p.year).map((p) => p.year!))
    : 2022;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Editorial hero — full bredd, asymmetrisk */}
      <section className="pt-40 pb-20 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="meta">{yearMin}—{yearMax} · Riksdagsval</p>
              <h1 className="display mt-6 italic">
                Samlingen
              </h1>
              <p className="lead mt-8 max-w-2xl">
                {allElectionPosters.length} politiska affischer från svenska riksdagsval.
                Filtrera på valår, parti eller tema — eller bläddra fritt genom arkivet.
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 hidden lg:block">
              <p className="caption text-right">
                Materialet kommer från Kungliga biblioteket, Wikimedia Commons,
                Stockholmskällan och partiarkiven.
              </p>
            </div>
          </div>

          {/* Datatag-rad i dataland-stil */}
          <div className="data-tags mt-12">
            <span>{allElectionPosters.length} affischer</span>
            <span>{decades.size} årtionden</span>
            <span>{partiesCount} partier</span>
            <span>IIIF deep zoom</span>
            <span>Public domain · Fair use</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              {/* Search */}
              <div>
                <h3 className="meta mb-4">Sök</h3>
                <form action="/affischer" method="GET">
                  {/* Preserve current filters */}
                  {params.year && <input type="hidden" name="year" value={params.year} />}
                  {params.parti && <input type="hidden" name="parti" value={params.parti} />}
                  {params.tema && <input type="hidden" name="tema" value={params.tema} />}

                  <div className="relative">
                    <input
                      type="search"
                      name="q"
                      defaultValue={params.q === '*' ? '' : params.q}
                      placeholder="Sök..."
                      className="w-full px-3 py-2 pl-9 bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </form>
              </div>

              {/* Election year filter */}
              <div>
                <h3 className="meta mb-4">Valår</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {ELECTION_YEARS.map((year) => (
                    <Link
                      key={year.value}
                      href={buildFilterUrl({
                        year: params.year === year.value ? '' : year.value,
                      })}
                      className={`block px-3 py-2 text-sm transition-opacity ${
                        params.year === year.value
                          ? 'text-[var(--text-primary)] border-l-2 border-[var(--border-strong)] bg-[var(--bg-secondary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:opacity-70'
                      }`}
                    >
                      {year.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Party filter */}
              <div>
                <h3 className="meta mb-4">Parti</h3>
                <div className="space-y-1">
                  {PARTIES.map((party) => (
                    <Link
                      key={party.value}
                      href={buildFilterUrl({
                        parti: params.parti === party.value ? '' : party.value,
                      })}
                      className={`block px-3 py-2 text-sm transition-opacity ${
                        params.parti === party.value
                          ? 'text-[var(--text-primary)] border-l-2 border-[var(--border-strong)] bg-[var(--bg-secondary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:opacity-70'
                      }`}
                    >
                      {party.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Theme filter */}
              <div>
                <h3 className="meta mb-4">Tema</h3>
                <div className="space-y-1">
                  {THEMES.map((theme) => (
                    <Link
                      key={theme.value}
                      href={buildFilterUrl({
                        tema: params.tema === theme.value ? '' : theme.value,
                      })}
                      className={`block px-3 py-2 text-sm transition-opacity ${
                        params.tema === theme.value
                          ? 'text-[var(--text-primary)] border-l-2 border-[var(--border-strong)] bg-[var(--bg-secondary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:opacity-70'
                      }`}
                    >
                      {theme.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Clear all */}
              {activeFilters.length > 0 && (
                <Link
                  href="/affischer"
                  className="block text-center px-3 py-2 border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:opacity-70 transition-opacity"
                >
                  Rensa alla filter
                </Link>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            {/* Mobile filters */}
            <div className="lg:hidden mb-8">
              <details className="border border-[var(--border)] p-4">
                <summary className="cursor-pointer text-sm font-medium text-[var(--text-primary)] flex items-center justify-between">
                  <span>Filter</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <div className="mt-4 space-y-6">
                  {/* Mobile search */}
                  <form action="/affischer" method="GET">
                    {params.year && <input type="hidden" name="year" value={params.year} />}
                    {params.parti && <input type="hidden" name="parti" value={params.parti} />}
                    {params.tema && <input type="hidden" name="tema" value={params.tema} />}
                    <input
                      type="search"
                      name="q"
                      defaultValue={params.q === '*' ? '' : params.q}
                      placeholder="Sök..."
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] text-sm"
                    />
                  </form>

                  {/* Mobile election year */}
                  <div>
                    <p className="meta mb-2">Valår</p>
                    <div className="flex flex-wrap gap-2">
                      {ELECTION_YEARS.map((year) => (
                        <Link
                          key={year.value}
                          href={buildFilterUrl({
                            year: params.year === year.value ? '' : year.value,
                          })}
                          className={`px-3 py-1 text-sm border transition-opacity ${
                            params.year === year.value
                              ? 'border-[var(--border-strong)] text-[var(--text-primary)]'
                              : 'border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70'
                          }`}
                        >
                          {year.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile party */}
                  <div>
                    <p className="meta mb-2">Parti</p>
                    <div className="flex flex-wrap gap-2">
                      {PARTIES.map((party) => (
                        <Link
                          key={party.value}
                          href={buildFilterUrl({
                            parti: params.parti === party.value ? '' : party.value,
                          })}
                          className={`px-3 py-1 text-sm border transition-opacity ${
                            params.parti === party.value
                              ? 'border-[var(--border-strong)] text-[var(--text-primary)]'
                              : 'border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70'
                          }`}
                        >
                          {party.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile theme */}
                  <div>
                    <p className="meta mb-2">Tema</p>
                    <div className="flex flex-wrap gap-2">
                      {THEMES.map((theme) => (
                        <Link
                          key={theme.value}
                          href={buildFilterUrl({
                            tema: params.tema === theme.value ? '' : theme.value,
                          })}
                          className={`px-3 py-1 text-sm border transition-opacity ${
                            params.tema === theme.value
                              ? 'border-[var(--border-strong)] text-[var(--text-primary)]'
                              : 'border-[var(--border)] text-[var(--text-secondary)] hover:opacity-70'
                          }`}
                        >
                          {theme.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Client component with rhetoric mode support */}
            <AffischerClient
              posters={posters}
              totalPosters={allElectionPosters.length}
              currentPage={page}
              totalPages={totalPages}
              activeFilters={activeFilters}
              buildFilterUrl={buildFilterUrl}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
