import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--bg-dark)] text-[var(--text-inverse)]">
      {/* Datatags-rad med källor */}
      <div className="border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <div className="data-tags text-[rgba(255,255,255,0.4)]">
            <span>Kungliga biblioteket</span>
            <span>Wikimedia Commons</span>
            <span>Stockholmskällan</span>
            <span>DigitaltMuseum</span>
            <span>Affischerna 1967—1979</span>
            <span>Partiarkiv</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block hover:opacity-70 transition-opacity">
              <span className="text-xl font-medium tracking-tight">
                Valaffischen
              </span>
            </Link>
            <p className="mt-4 text-sm text-[rgba(255,255,255,0.5)] max-w-md leading-relaxed">
              Ett digitalt arkiv över svenska valaffischer — från Kungliga bibliotekets
              samlingar och andra källor. Demokratins visuella historia, tillgängliggjord
              för forskning och bildning.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="meta text-[rgba(255,255,255,0.4)] mb-4">
              Utforska
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/affischer"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Samlingen
                </Link>
              </li>
              <li>
                <Link
                  href="/partier"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Partier
                </Link>
              </li>
              <li>
                <Link
                  href="/tidslinje"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Tidslinje
                </Link>
              </li>
              <li>
                <Link
                  href="/om"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Om projektet
                </Link>
              </li>
            </ul>
          </div>

          {/* External + Rights */}
          <div>
            <p className="meta text-[rgba(255,255,255,0.4)] mb-4">
              Källor
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://digitalt.kb.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                >
                  KB Digitalt
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <Link
                  href="/om/rattigheter"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Rättighetsinformation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rights disclaimer - monokrom version */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.1)]">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="meta text-[rgba(255,255,255,0.4)] mb-3">
                Bildmaterial
              </p>
              <p className="text-sm text-[rgba(255,255,255,0.5)] leading-relaxed">
                Materialet är blandat licensierat. KB:s affischer 1892—1951 är Public Domain.
                Modernare material visas med källhänvisning under citaträtt (URL §23).
                Se varje affisch för specifik rättighetsstatus.
              </p>
              <Link
                href="/om/rattigheter"
                className="inline-flex items-center gap-1 mt-4 text-sm text-[rgba(255,255,255,0.7)] hover:opacity-70 transition-opacity border-b border-current pb-0.5"
              >
                Läs mer om rättigheter →
              </Link>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-[rgba(255,255,255,0.4)]">
                Ett projekt för bildning — utan kommersiellt eller partipolitiskt syfte
              </p>
              <p className="text-sm text-[rgba(255,255,255,0.4)] mt-2">
                © {new Date().getFullYear()} Valaffischen
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
