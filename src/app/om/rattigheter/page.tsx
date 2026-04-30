import type { Metadata } from 'next';
import Link from 'next/link';
import { RightsBadge } from '@/components/rights-badge';

export const metadata: Metadata = {
  title: 'Rättigheter — Valaffischen',
  description: 'Information om upphovsrätt och användningsvillkor för valaffischerna i museets samling.',
};

export default function RattigheterPage() {
  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-[var(--reading-width)] mx-auto px-6 lg:px-12">
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                  Hem
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/om" className="hover:text-[var(--text-primary)] transition-colors">
                  Om
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--text-primary)]">Rättigheter</li>
            </ol>
          </nav>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Rättigheter och användning
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
            Valaffischen samlar material från olika källor med olika upphovsrättslig
            status. Här förklarar vi hur vi hanterar rättigheter och vad du får göra
            med materialet.
          </p>
        </div>
      </section>

      {/* Rights statuses */}
      <section className="py-16">
        <div className="max-w-[var(--reading-width)] mx-auto px-6 lg:px-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--text-primary)] mb-8">
            De fyra rättighetsnivåerna
          </h2>

          <div className="space-y-8">
            {/* Free */}
            <div className="p-6 bg-[var(--bg-secondary)] border-l-4 border-[#3D7A5F]">
              <div className="flex items-start gap-4">
                <RightsBadge status="free" className="mt-0.5" />
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">
                    Fritt att använda (Public Domain)
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Materialet är fritt från upphovsrättsliga begränsningar. Du kan
                    kopiera, modifiera och använda det för alla ändamål — även
                    kommersiella — utan tillstånd.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong>Gäller:</strong> KB:s material 1892–1951 (upphovsrätten har löpt ut).
                    Märkt med Public Domain Mark 1.0.
                  </p>
                </div>
              </div>
            </div>

            {/* Restricted */}
            <div className="p-6 bg-[var(--bg-secondary)] border-l-4 border-[#B8860B]">
              <div className="flex items-start gap-4">
                <RightsBadge status="restricted" className="mt-0.5" />
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">
                    Begränsad användning (upphovsrättsskyddat)
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Materialet är upphovsrättsskyddat. Vi visar en förhandsgranskning
                    (thumbnail) med länk till primärkällan. För att använda materialet
                    i egna sammanhang behöver du kontakta rättighetshavaren.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong>Gäller:</strong> Affischer från partiernas arkiv, mediaorganisationer
                    och andra samtida källor.
                  </p>
                </div>
              </div>
            </div>

            {/* Fair use */}
            <div className="p-6 bg-[var(--bg-secondary)] border-l-4 border-[#7C6955]">
              <div className="flex items-start gap-4">
                <RightsBadge status="fair_use" className="mt-0.5" />
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">
                    Citat/utbildning (URL §23)
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Materialet visas enligt den svenska citaträtten (URL §23) för kritik,
                    recension och vetenskaplig framställning. Användningen är begränsad
                    till det som är motiverat av ändamålet.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    <strong>Gäller:</strong> Material som visas i utbildnings- och
                    forskningssyfte med tydlig källhänvisning.
                  </p>
                  <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] text-sm">
                    <p className="text-[var(--text-secondary)]">
                      <strong>URL §23:</strong> &quot;Var och en får citera ur offentliggjorda
                      verk i enlighet med god sed och i den omfattning som motiveras
                      av ändamålet.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Unknown */}
            <div className="p-6 bg-[var(--bg-secondary)] border-l-4 border-[#6B7280]">
              <div className="flex items-start gap-4">
                <RightsBadge status="unknown" className="mt-0.5" />
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">
                    Status okänd
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Rättighetsstatus har inte kunnat fastställas. Vi behandlar materialet
                    restriktivt och visar det primärt i forsknings- och dokumentationssyfte.
                    Kontakta oss om du har information om rättighetshavaren.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong>Gäller:</strong> Äldre material där formgivare eller rättighetshavare
                    inte kunnat identifieras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-[var(--reading-width)] mx-auto px-6 lg:px-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--text-primary)] mb-8">
            Våra källor
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <h3 className="font-bold text-[var(--text-primary)] mb-2">
                Kungliga biblioteket (KB)
              </h3>
              <p className="text-[var(--text-secondary)] mb-3">
                Primärkälla för historiskt material 1892–1951. Affischerna är
                digitaliserade och tillgängliggjorda via IIIF-protokollet som möjliggör
                deep zoom.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Rättighetsstatus: <strong>Fritt</strong> (Public Domain Mark 1.0)
              </p>
              <a
                href="https://digitalt.kb.se"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-[var(--accent)] hover:underline"
              >
                KB Digitalt
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <h3 className="font-bold text-[var(--text-primary)] mb-2">
                Partiarkiv och officiella webbplatser
              </h3>
              <p className="text-[var(--text-secondary)] mb-3">
                Samtida material (post-1951) hämtas från partiernas egna arkiv
                och webbplatser. Vi visar förhandsgranskning med länk till källan.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Rättighetsstatus: <strong>Begränsad</strong> eller <strong>Citat</strong>
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <h3 className="font-bold text-[var(--text-primary)] mb-2">
                Wikimedia Commons
              </h3>
              <p className="text-[var(--text-secondary)] mb-3">
                Fotografier av valaffischer som laddats upp av användare.
                Varje bild har sin egen licensinformation.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Rättighetsstatus: <strong>Varierar</strong> — kontrollera individuell licensinfo
              </p>
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)]">
              <h3 className="font-bold text-[var(--text-primary)] mb-2">
                Mediaarkiv (DA, Arbetet, m.fl.)
              </h3>
              <p className="text-[var(--text-secondary)] mb-3">
                Nyhetsbilder som dokumenterar valaffischer i sin kontext.
                Används enligt citaträtten (URL §23) för kritik och utbildning.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Rättighetsstatus: <strong>Citat/utbildning</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage guidelines */}
      <section className="py-16">
        <div className="max-w-[var(--reading-width)] mx-auto px-6 lg:px-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--text-primary)] mb-8">
            Användningsriktlinjer
          </h2>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-[var(--text-secondary)]">
              <div className="p-6 bg-[var(--bg-secondary)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3 text-lg">
                  Forskning och utbildning
                </h3>
                <p>
                  Allt material får användas för forskning och utbildning med korrekt
                  källhänvisning. Vi uppmuntrar användning i undervisning, akademiska
                  publikationer och kulturellt bevarande.
                </p>
              </div>

              <div className="p-6 bg-[var(--bg-secondary)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3 text-lg">
                  Kommersiell användning
                </h3>
                <p>
                  Endast material märkt <RightsBadge status="free" className="mx-1" /> får
                  användas kommersiellt utan ytterligare tillstånd. För övrigt material,
                  kontakta respektive rättighetshavare.
                </p>
              </div>

              <div className="p-6 bg-[var(--bg-secondary)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3 text-lg">
                  Attribution
                </h3>
                <p>
                  Vi rekommenderar alltid korrekt källhänvisning, även för Public Domain-material.
                  Format: &quot;[Titel], [År]. Källa: [Ursprungskälla] via Valaffischen.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-[var(--bg-dark)] text-white">
        <div className="max-w-[var(--reading-width)] mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-4">
            Frågor om rättigheter?
          </h2>
          <p className="text-gray-400 mb-6">
            Kontakta oss om du har frågor om en specifik affischs rättighetsstatus
            eller om du är rättighetshavare och vill diskutera användningen.
          </p>
          <Link
            href="/om#kontakt"
            className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Kontakta oss
          </Link>
        </div>
      </section>
    </div>
  );
}
