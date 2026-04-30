import Link from 'next/link';
import Image from 'next/image';
import { getAllElectionPosters } from '@/lib/posters';
import { MotionPlakat, MotionArkiv, MotionDatapunkter } from '@/components/motion-assets';

export const revalidate = 3600;

export default async function HomePage() {
  const allPosters = await getAllElectionPosters({ limit: 200, sort: '-year' });

  const featured = allPosters.filter((p) => p.thumbnailUrl || p.imageUrl).slice(0, 8);
  const decades = new Set(
    allPosters.map((p) => (p.year ? Math.floor(p.year / 10) * 10 : null)).filter(Boolean)
  );
  const partiesCount = new Set(allPosters.filter((p) => p.party).map((p) => p.party)).size;
  const yearMin = Math.min(...allPosters.filter((p) => p.year).map((p) => p.year!));
  const yearMax = Math.max(...allPosters.filter((p) => p.year).map((p) => p.year!));

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* ============================================================
          01. EDITORIAL HERO — full skärmhöjd, tystnad, plakat-ikonen
          ============================================================ */}
      <section className="relative min-h-[100vh] flex flex-col justify-end pt-32 pb-16 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <p className="meta">{yearMin}—{yearMax} · Sverige</p>
            <h1 className="display mt-8 italic">
              Valaffischen
            </h1>
            <p className="lead mt-10 max-w-2xl">
              Ett digitalt museum för svenska valaffischer. {allPosters.length} dokument
              över hur partierna har tävlat om din uppmärksamhet i mer än 130 år —
              från Allmänna valmansförbundet till Sverigedemokraterna.
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <MotionPlakat className="text-[var(--text-primary)]" />
          </div>
        </div>

        {/* Datatag-rad i botten — dataland-stil */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full mt-16">
          <div className="data-tags">
            <span>{allPosters.length} affischer</span>
            <span>{decades.size} årtionden</span>
            <span>{partiesCount} partier</span>
            <span>IIIF deep zoom</span>
            <span>AI-analyserad text</span>
            <span>Public domain · Fair use</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          02. FEATURED — affischerna talar, UI tystar
          ============================================================ */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
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

          {/* Asymmetric grid: första posten dubbelstor */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((poster, i) => (
              <Link
                key={poster.id}
                href={`/affischer/${poster.id}`}
                className={`group block ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <div className="relative bg-[var(--bg-secondary)] aspect-[3/4] overflow-hidden">
                  {(poster.thumbnailUrl || poster.imageUrl) && (
                    <Image
                      src={(poster.thumbnailUrl || poster.imageUrl) as string}
                      alt={poster.title}
                      fill
                      sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                      className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
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
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          03. ARKIVET — full bredd, mörk, sheet-stack-motion
          ============================================================ */}
      <section className="section-fullbleed dark py-32 border-y border-[var(--border-strong)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <MotionArkiv className="text-[var(--text-inverse)]" />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="meta">Arkivet</p>
            <h2 className="h1 mt-6 italic">Sex källor. En tidslinje.</h2>
            <p className="lead mt-8 max-w-xl text-[rgba(255,255,255,0.7)]">
              Materialet kommer från Kungliga biblioteket, Wikimedia Commons,
              Stockholmskällan, DigitaltMuseum, partiarkiven och Affischerna 1967—1979.
              Varje affisch bär sin källa öppet.
            </p>

            <div className="data-tags mt-12 text-[rgba(255,255,255,0.5)]">
              <span>Kungliga biblioteket</span>
              <span>Wikimedia Commons</span>
              <span>Stockholmskällan</span>
              <span>DigitaltMuseum</span>
              <span>Affischerna 1967—1979</span>
              <span>SD · M · MP officiella arkiv</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          04. AI-ANALYS — datapunkter-motion + två CTA
          ============================================================ */}
      <section className="py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
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
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <MotionDatapunkter className="text-[var(--text-primary)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          05. FINAL CTA — minimalistisk, dataland-bottom
          ============================================================ */}
      <section className="section-fullbleed dark py-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <p className="meta">Stig in</p>
          <h2 className="display mt-8 italic max-w-4xl">
            Två kvadratmeter papper. Ett vallöfte. 130 år.
          </h2>
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
        </div>
      </section>
    </div>
  );
}
