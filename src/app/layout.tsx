import type { Metadata } from 'next';
import { IBM_Plex_Sans, EB_Garamond, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MobileBottomNav } from '@/components/mobile-nav';

/**
 * Typografi:
 * - EB Garamond — editorial serif för rubriker. Italic-formerna är arbetshästen
 *   (se logotypen). Klassisk, tidlös, museal — utan att kännas bröllops-Playfair.
 * - IBM Plex Sans — neutral grotesk för brödtext, metadata, UI. Hög läsbarhet
 *   utan tech-startup-känsla.
 * - IBM Plex Mono — för citat/källhänvisningar/tekniska metadata på affisch-sidor.
 *
 * Fallback-variablerna heter fortfarande --font-playfair / --font-inter så att
 * existerande klassnamn i sidor inte behöver byggas om i samma migration —
 * vi pekar dem bara på de nya familjerna.
 */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'Valaffischen — Demokratins visuella historia',
    template: '%s — Valaffischen',
  },
  description:
    'Ett digitalt museum för svenska valaffischer. 130 år av politisk kommunikation från Kungliga bibliotekets samlingar.',
  keywords: [
    'valaffischer',
    'svenska val',
    'politisk historia',
    'Kungliga biblioteket',
    'kulturarv',
    'digitalt museum',
    'demokrati',
    'rösträtt',
  ],
  authors: [{ name: 'Valaffischen' }],
  creator: 'Valaffischen',
  publisher: 'Valaffischen',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Valaffischen',
    title: 'Valaffischen — Demokratins visuella historia',
    description:
      'Ett digitalt museum för svenska valaffischer. 130 år av politisk kommunikation.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valaffischen',
    description: 'Demokratins visuella historia',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${ibmPlexSans.variable} ${ebGaramond.variable} ${ibmPlexMono.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--bg-dark)] focus:text-[var(--text-inverse)]"
        >
          Hoppa till huvudinnehåll
        </a>
        <Header />
        <main id="main-content" className="flex-1 pb-16 sm:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
