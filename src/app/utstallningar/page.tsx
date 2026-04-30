import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Utställningar — Valaffischen',
  description: 'Temautställningar som sätter valaffischerna i sitt historiska sammanhang.',
};

// Curated exhibitions data
// In production, this would come from Supabase
const exhibitions = [
  {
    slug: 'rostrattens-genombrott-1921',
    title: 'Rösträttens genombrott 1921',
    subtitle: 'Det första valet med allmän rösträtt',
    description:
      'År 1921 hölls det första riksdagsvalet där alla myndiga svenskar — oavsett kön eller förmögenhet — fick rösta. Denna utställning visar hur partierna försökte nå de nya väljarna.',
    posterCount: 24,
    featured: true,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
  {
    slug: 'arbetarrorelsens-bildvarldar',
    title: 'Arbetarrörelsens bildvärldar',
    subtitle: 'Klassisk arbetarikonografi 1890–1940',
    description:
      'Röda fanor, sammanslutna händer, industriarbetare och soluppgångar. Arbetarrörelsens bildspråk formade en epok.',
    posterCount: 18,
    featured: true,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
  {
    slug: 'folkhemmet-tar-form',
    title: 'Folkhemmet tar form',
    subtitle: 'Per Albin och 1930-talets vägval',
    description:
      'Under 1930-talet lanserade Per Albin Hansson begreppet "folkhemmet". Hur visualiserades det i valaffischerna?',
    posterCount: 15,
    featured: false,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
  {
    slug: 'kvinnorna-tar-plats',
    title: 'Kvinnorna tar plats',
    subtitle: 'Från rösträttskamp till valaffisch',
    description:
      'Hur framställdes kvinnor i politiska affischer? Från passiva mottagare till aktiva aktörer.',
    posterCount: 12,
    featured: false,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
  {
    slug: 'karnkraftens-bildstrid',
    title: 'Kärnkraftens bildstrid',
    subtitle: 'Folkomröstningen 1980',
    description:
      'Folkomröstningen om kärnkraft 1980 var en av Sveriges mest polariserade politiska strider. Affischerna visar hur båda sidor försökte vinna opinionen.',
    posterCount: 10,
    featured: false,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
  {
    slug: 'eu-fragan-splittrar',
    title: 'EU-frågan splittrar',
    subtitle: 'Folkomröstningen 1994',
    description:
      'Sveriges EU-medlemskap avgjordes i en folkomröstning 1994. Ja- och nej-sidans kampanjer speglade djupa skiljelinjer.',
    posterCount: 8,
    featured: false,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
  {
    slug: 'det-nya-arbetarpartiet',
    title: 'Det nya arbetarpartiet',
    subtitle: 'Moderaternas omprofilering 2006',
    description:
      'Fredrik Reinfeldt och Per Schlingmann förvandlade Moderaterna till "det nya arbetarpartiet". En av svensk politikhistorias mest lyckade kampanjstrategier.',
    posterCount: 14,
    featured: false,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
  {
    slug: 'sd-i-riksdagen',
    title: 'SD i riksdagen',
    subtitle: 'Genombrottet 2010 och dess efterdyningar',
    description:
      'När Sverigedemokraterna tog sig in i riksdagen 2010 förändrades det politiska landskapet permanent. Hur kommunicerade de — och hur bemöttes de?',
    posterCount: 11,
    featured: false,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
  },
];

export default function UtstallningarPage() {
  const featuredExhibitions = exhibitions.filter((e) => e.featured);
  const otherExhibitions = exhibitions.filter((e) => !e.featured);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-3">
            Fördjupning
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]">
            Utställningar
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Kurerade temasamlingar som sätter affischerna i sitt historiska
            sammanhang. Varje utställning berättar en historia om svensk demokrati.
          </p>
        </div>
      </section>

      {/* Featured exhibitions */}
      <section className="pb-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-8">
            Aktuella utställningar
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredExhibitions.map((exhibition, index) => (
              <Link
                key={exhibition.slug}
                href={`/utstallningar/${exhibition.slug}`}
                className={`group block ${index === 0 ? 'lg:col-span-2' : ''}`}
              >
                <div
                  className={`relative overflow-hidden bg-[var(--bg-dark)] ${
                    index === 0 ? 'aspect-[21/9]' : 'aspect-[16/9]'
                  }`}
                >
                  {/* Background image with overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-dark)] via-[var(--bg-dark)]/80 to-transparent z-10" />
                  <Image
                    src={exhibition.coverImage}
                    alt=""
                    fill
                    sizes={index === 0 ? '100vw' : '50vw'}
                    className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                  />

                  {/* Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 lg:p-12">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#A8A29E] mb-2">
                      {exhibition.posterCount} affischer
                    </p>
                    <h3
                      className={`font-[var(--font-playfair)] font-bold text-[var(--text-inverse)] group-hover:text-[var(--accent)] transition-colors ${
                        index === 0 ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'
                      }`}
                    >
                      {exhibition.title}
                    </h3>
                    <p className="mt-2 text-lg text-[#A8A29E]">{exhibition.subtitle}</p>
                    {index === 0 && (
                      <p className="mt-4 text-[#A8A29E] max-w-xl line-clamp-2">
                        {exhibition.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other exhibitions */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-8">
            Alla utställningar
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherExhibitions.map((exhibition) => (
              <Link
                key={exhibition.slug}
                href={`/utstallningar/${exhibition.slug}`}
                className="group block bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
              >
                <div className="relative aspect-[16/10] bg-[var(--bg-dark)]">
                  <Image
                    src={exhibition.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-60"
                  />
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                    {exhibition.posterCount} affischer
                  </p>
                  <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {exhibition.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{exhibition.subtitle}</p>
                  <p className="mt-4 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {exhibition.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About exhibitions */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6">
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-6">
                Om utställningarna
              </p>
              <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                Kontext är allt
              </h2>
              <p className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed">
                En valaffisch utan kontext är bara en bild. Med rätt bakgrund
                blir den ett fönster in i historien — politiska strider,
                sociala rörelser, och hur människor försökte forma framtiden.
              </p>
              <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                Våra temautställningar är kurerade av historiker och
                samhällsvetare. Varje affisch sätts i sitt sammanhang med
                förklarande texter och historisk bakgrund.
              </p>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="bg-[var(--bg-secondary)] p-8">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-6">
                  Föreslå en utställning
                </p>
                <p className="text-[var(--text-primary)] leading-relaxed">
                  Har du en idé för en temasamling? Vi välkomnar förslag från
                  forskare, lärare och intresserade.
                </p>
                <Link
                  href="/om#kontakt"
                  className="inline-block mt-6 text-[var(--accent)] hover:underline"
                >
                  Kontakta oss →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--bg-dark)] text-[var(--text-inverse)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold">
            Utforska hela samlingen
          </h2>
          <p className="mt-4 text-[#A8A29E]">
            Bläddra fritt bland alla affischer eller följ tidslinjen.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/affischer"
              className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] transition-colors"
            >
              Samlingen
            </Link>
            <Link
              href="/tidslinje"
              className="px-6 py-3 border border-[var(--text-inverse)] text-[var(--text-inverse)] hover:bg-[var(--text-inverse)] hover:text-[var(--bg-dark)] transition-colors"
            >
              Tidslinje
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
