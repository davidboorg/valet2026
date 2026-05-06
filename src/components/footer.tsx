import Link from 'next/link';
import { LaunchModule } from './launch-module';

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
            <span>Partiarkiven</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand + Newsletter */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block hover:opacity-70 transition-opacity">
              <span className="text-xl font-medium tracking-tight">
                Valaffischen
              </span>
            </Link>
            <p className="mt-4 text-sm text-[rgba(255,255,255,0.5)] max-w-sm leading-relaxed">
              Ett digitalt museum över svensk politisk retorik.
              Öppnar inför riksdagsvalet 2026.
            </p>

            {/* Newsletter signup */}
            <div className="mt-8">
              <LaunchModule variant="footer" />
            </div>
          </div>

          {/* Navigation - Utforska */}
          <div className="md:col-span-2 md:col-start-7">
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
                  Om
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation - Analys */}
          <div className="md:col-span-2">
            <p className="meta text-[rgba(255,255,255,0.4)] mb-4">
              Analys
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/ord"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Språket
                </Link>
              </li>
              <li>
                <Link
                  href="/tonlage"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Tonlägen
                </Link>
              </li>
            </ul>
          </div>

          {/* External + Rights */}
          <div className="md:col-span-2">
            <p className="meta text-[rgba(255,255,255,0.4)] mb-4">
              Resurser
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
                  Rättigheter
                </Link>
              </li>
              <li>
                <a
                  href="mailto:david@surpriseventures.io"
                  className="text-[rgba(255,255,255,0.6)] hover:opacity-70 transition-opacity"
                >
                  Tipsa om affischer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Rights disclaimer */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-xs text-[rgba(255,255,255,0.4)] leading-relaxed max-w-xl">
              Bildmaterial från öppna arkiv. KB-affischer 1892–1951 är public domain.
              Modernare material visas under citaträtt (URL §23).
              {' '}<Link href="/om/rattigheter" className="border-b border-current hover:opacity-70 transition-opacity">
                Läs mer →
              </Link>
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.4)]">
              © {new Date().getFullYear()} Valaffischen · För bildning, inte reklam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
