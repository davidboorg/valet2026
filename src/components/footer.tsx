import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--bg-dark)] text-[var(--text-inverse)]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold">
                Valaffischen
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#9B9590] max-w-md leading-relaxed">
              Ett digitalt arkiv över svenska valaffischer — från Kungliga bibliotekets
              samlingar och andra källor. Demokratins visuella historia, tillgängliggjord
              för forskning och bildning.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.15em] text-[#9B9590] uppercase mb-4">
              Utforska
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/affischer"
                  className="text-[#9B9590] hover:text-[var(--text-inverse)] transition-colors"
                >
                  Samlingen
                </Link>
              </li>
              <li>
                <Link
                  href="/partier"
                  className="text-[#9B9590] hover:text-[var(--text-inverse)] transition-colors"
                >
                  Partier
                </Link>
              </li>
              <li>
                <Link
                  href="/tidslinje"
                  className="text-[#9B9590] hover:text-[var(--text-inverse)] transition-colors"
                >
                  Tidslinje
                </Link>
              </li>
              <li>
                <Link
                  href="/om"
                  className="text-[#9B9590] hover:text-[var(--text-inverse)] transition-colors"
                >
                  Om projektet
                </Link>
              </li>
            </ul>
          </div>

          {/* External + Rights */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.15em] text-[#9B9590] uppercase mb-4">
              Källor & rättigheter
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://digitalt.kb.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9B9590] hover:text-[var(--text-inverse)] transition-colors inline-flex items-center gap-1"
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
                  className="text-[#9B9590] hover:text-[var(--text-inverse)] transition-colors"
                >
                  Rättighetsinformation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rights disclaimer - nuanced version */}
        <div className="mt-16 pt-8 border-t border-[#2E2D2A]">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-medium tracking-[0.15em] text-[#9B9590] uppercase mb-2">
                Bildmaterial
              </h4>
              <div className="space-y-2 text-xs text-[#6B6560]">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3D7A5F]" />
                  <span>KB 1892–1951: Public Domain Mark 1.0</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8860B]" />
                  <span>Övrigt material: Upphovsrättsskyddat, visas med källhänvisning</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7C6955]" />
                  <span>Citat: URL §23 för kritik och utbildning</span>
                </p>
              </div>
              <Link
                href="/om/rattigheter"
                className="inline-flex items-center gap-1 mt-3 text-xs text-[var(--accent)] hover:text-[#D4755A] transition-colors"
              >
                Läs mer om rättigheter
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-[#6B6560]">
                Ett projekt för bildning — utan kommersiellt eller partipolitiskt syfte
              </p>
              <p className="text-xs text-[#6B6560] mt-2">
                © {new Date().getFullYear()} Valaffischen
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
