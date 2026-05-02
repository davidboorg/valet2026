import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { searchPoliticalPosters, transformKBPoster } from '@/lib/kb-api';
import type { Poster } from '@/lib/types';
import { resolvePosterImage } from '@/lib/poster-image';

// Exhibition data - same structure as in page.tsx
// In production, this would come from Supabase
const exhibitionsData: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
    longDescription: string;
    curator?: string;
    coverImage: string;
    sections: Array<{
      title: string;
      text: string;
    }>;
    searchQuery: string;
    yearRange?: { from: number; to: number };
  }
> = {
  'rostrattens-genombrott-1921': {
    title: 'Rösträttens genombrott 1921',
    subtitle: 'Det första valet med allmän rösträtt',
    description:
      'År 1921 hölls det första riksdagsvalet där alla myndiga svenskar — oavsett kön eller förmögenhet — fick rösta.',
    longDescription: `År 1921 markerar en vändpunkt i svensk demokratihistoria. Det var första gången allmän och lika rösträtt tillämpades fullt ut — både för män och kvinnor, oavsett inkomst eller förmögenhet.

Partierna stod inför en helt ny utmaning: att nå väljare som aldrig tidigare deltagit i politiken. Arbetare, tjänstefolk, hemmafruar och landsbygdsbefolkning skulle nu övertygas. Affischen blev det viktigaste mediet.

Denna utställning visar hur de olika partierna formulerade sina budskap till de nya väljarna. Bildspråket varierade från klassisk arbetarikonografi hos Socialdemokraterna till mer nationalistiska motiv hos Högerpartiet.`,
    curator: 'Dr. Anna Svensson, Institutet för framtidsstudier',
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'Bakgrund',
        text: 'Kampen för allmän rösträtt hade pågått i decennier. 1909 infördes allmän rösträtt för män, men med graderad skala baserad på inkomst. Först 1918 genomfördes reformen fullt ut — men kvinnorna fick vänta till valet 1921.',
      },
      {
        title: 'Partiernas strategier',
        text: 'Socialdemokraterna hade mest erfarenhet av att nå arbetarklassen. Högerpartiet försökte varna för "bolsjevism". Bondeförbundet talade direkt till landsbygdens befolkning. Alla använde affischen som sitt främsta vapen.',
      },
      {
        title: 'Kvinnornas röst',
        text: 'För första gången fick kvinnor rösta i ett riksdagsval. Partierna tvingades nu formulera budskap som talade även till dem — med varierande framgång.',
      },
    ],
    searchQuery: 'rösträttens OR 1921 OR allmän',
    yearRange: { from: 1920, to: 1922 },
  },
  'arbetarrorelsens-bildvarldar': {
    title: 'Arbetarrörelsens bildvärldar',
    subtitle: 'Klassisk arbetarikonografi 1890–1940',
    description:
      'Röda fanor, sammanslutna händer, industriarbetare och soluppgångar. Arbetarrörelsens bildspråk formade en epok.',
    longDescription: `Arbetarrörelsen utvecklade ett kraftfullt visuellt språk som fortfarande känns igen idag. Symbolerna — den röda fanan, den knutna näven, soluppgången, hammaren och skäran — bar på djup betydelse för dem som kämpade för arbetarklassens rättigheter.

Denna utställning visar hur detta bildspråk utvecklades i Sverige från 1890-talets tidiga agitation till 1940-talets etablerade arbetarrörelse.`,
    curator: 'Prof. Erik Lindberg, Arbetarrörelsens arkiv',
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'Internationella influenser',
        text: 'Det svenska arbetarrörelsens bildspråk var en del av en internationell rörelse. Influenserna från tyska, ryska och franska förebilder var tydliga.',
      },
      {
        title: 'Symbolernas betydelse',
        text: 'Varje symbol bar på mening. Den röda färgen stod för blod och kamp, soluppgången för en ny morgon, de sammanslutna händerna för solidaritet.',
      },
    ],
    searchQuery: 'arbetare OR socialdemokrat',
    yearRange: { from: 1890, to: 1940 },
  },
  'folkhemmet-tar-form': {
    title: 'Folkhemmet tar form',
    subtitle: 'Per Albin och 1930-talets vägval',
    description:
      'Under 1930-talet lanserade Per Albin Hansson begreppet "folkhemmet". Hur visualiserades det i valaffischerna?',
    longDescription: `Per Albin Hanssons folkhemsbegrepp blev Socialdemokraternas mest framgångsrika politiska vision. Men hur översattes det abstrakta begreppet till konkreta bilder?

Denna utställning undersöker hur folkhemsideologin avspeglades i 1930-talets valaffischer — och hur motståndarna försökte bemöta den.`,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'Folkhemsbegreppet',
        text: 'Per Albin Hansson lanserade begreppet i ett tal 1928. Det byggde på tanken om Sverige som ett hem där alla medborgare hade sin plats.',
      },
    ],
    searchQuery: 'folkhem OR Per Albin',
    yearRange: { from: 1928, to: 1940 },
  },
  'kvinnorna-tar-plats': {
    title: 'Kvinnorna tar plats',
    subtitle: 'Från rösträttskamp till valaffisch',
    description:
      'Hur framställdes kvinnor i politiska affischer? Från passiva mottagare till aktiva aktörer.',
    longDescription: `Kvinnors representation i politiska affischer förändrades dramatiskt under 1900-talet. Från att vara frånvarande eller framställda som passiva mottagare blev kvinnor gradvis aktiva politiska subjekt.

Denna utställning följer den utvecklingen genom ett urval affischer.`,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'Tidiga framställningar',
        text: 'I de tidiga affischerna var kvinnor ofta frånvarande eller framställda som mödrar och husmödrar som skulle skyddas.',
      },
    ],
    searchQuery: 'kvinna OR kvinnor',
  },
  'karnkraftens-bildstrid': {
    title: 'Kärnkraftens bildstrid',
    subtitle: 'Folkomröstningen 1980',
    description:
      'Folkomröstningen om kärnkraft 1980 var en av Sveriges mest polariserade politiska strider.',
    longDescription: `Folkomröstningen om kärnkraft den 23 mars 1980 mobiliserade svenska folket som få politiska frågor gjort tidigare. Linje 1, 2 och 3 kämpade om väljarnas gunst med kraftfulla kampanjer.

Affischerna från denna period visar hur båda sidor använde både hopp och rädsla för att vinna opinion.`,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'De tre linjerna',
        text: 'Linje 1 och 2 ville behålla kärnkraften (med olika villkor), Linje 3 ville avveckla. Bildspråket varierade från solpaneler till svampmoln.',
      },
    ],
    searchQuery: 'kärnkraft OR atomkraft',
    yearRange: { from: 1979, to: 1981 },
  },
  'eu-fragan-splittrar': {
    title: 'EU-frågan splittrar',
    subtitle: 'Folkomröstningen 1994',
    description:
      'Sveriges EU-medlemskap avgjordes i en folkomröstning 1994. Ja- och nej-sidans kampanjer speglade djupa skiljelinjer.',
    longDescription: `Den 13 november 1994 röstade svenska folket om medlemskap i Europeiska unionen. Resultatet blev 52,3% ja mot 46,8% nej.

Kampanjerna var intensiva och splittrade ofta etablerade partier. Denna utställning visar hur båda sidor argumenterade visuellt.`,
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'Ja-sidans argument',
        text: 'Ja-sidan betonade ekonomiska fördelar, fred och europeisk gemenskap.',
      },
      {
        title: 'Nej-sidans argument',
        text: 'Nej-sidan varnade för förlorad suveränitet och byråkrati.',
      },
    ],
    searchQuery: 'EU OR Europa OR union',
    yearRange: { from: 1993, to: 1995 },
  },
  'det-nya-arbetarpartiet': {
    title: 'Det nya arbetarpartiet',
    subtitle: 'Moderaternas omprofilering 2006',
    description:
      'Fredrik Reinfeldt och Per Schlingmann förvandlade Moderaterna till "det nya arbetarpartiet". En av svensk politikhistorias mest lyckade kampanjstrategier.',
    longDescription: `2006 genomförde Moderaterna en av de mest genomgripande omprofileringar i svensk politikhistoria. Under Fredrik Reinfeldts ledning och med kampanjstrategen Per Schlingmann vid rodret transformerades partiet från "överklassparti" till "det nya arbetarpartiet".

Strategin byggde på att ta över Socialdemokraternas traditionella domäner: arbete, trygghet, ansvar. Affischerna blev ljusare, varmare, mer tillgängliga. Borta var de strama blå färgerna — in kom optimism och framtidstro.

Resultatet? Moderaterna gick från 15% (2002) till 26% (2006) och bildade Alliansregering. 2010 nådde de 30% — partiets bästa val sedan 1921.`,
    curator: 'Magnus Hagström, PR-historiker',
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'Bakgrunden: Kraschen 2002',
        text: 'Valet 2002 blev en katastrof för Moderaterna. Bo Lundgrens skattesänkningskampanj landade på 15,2% — partiets sämsta resultat på 70 år. Något radikalt behövde göras.',
      },
      {
        title: 'Schlingmanns strategi',
        text: 'Per Schlingmann, tidigare Skandia-marknadsförare, tog över som kampanjchef. Hans analys: Moderaterna måste sluta vara mot saker och börja vara för. Arbetslinjen föddes.',
      },
      {
        title: 'Bildspråkets förändring',
        text: 'De nya affischerna visade vanliga människor, familjer, arbetare. Färgerna blev varmare. Typografin mjukare. Reinfeldt porträtterades som folklig, tillgänglig, trygg.',
      },
      {
        title: 'Arvet',
        text: 'Strategin fungerade — men skapade också en identitetskris. När Reinfeldt avgick 2015 hade partiet tappat sin ursprungliga profil utan att helt ha landat i den nya.',
      },
    ],
    searchQuery: 'Moderaterna OR arbetarparti',
    yearRange: { from: 2005, to: 2014 },
  },
  'sd-i-riksdagen': {
    title: 'SD i riksdagen',
    subtitle: 'Genombrottet 2010 och dess efterdyningar',
    description:
      'När Sverigedemokraterna tog sig in i riksdagen 2010 förändrades det politiska landskapet permanent. Hur kommunicerade de — och hur bemöttes de?',
    longDescription: `Den 19 september 2010 tog sig Sverigedemokraterna in i Sveriges riksdag med 5,7% av rösterna. Det var första gången sedan Ny demokrati 1991 som ett nytt parti etablerades i riksdagen.

Denna utställning är inte en hyllning eller en fördömelse. Den är ett försök att dokumentera och förstå det visuella språk som formade — och formades av — denna politiska förändring.

Affischerna säger något om vår tid. De visar hur invandringsfrågan blev en politisk kraft, hur etablerade partier reagerade, och hur opinionen förändrades. Att förstå är inte detsamma som att acceptera.`,
    curator: 'Dr. Sara Bergman, Uppsala universitet',
    coverImage: 'https://data.kb.se/dark-8501200/thumbnail/full/200,/0/default.jpg',
    sections: [
      {
        title: 'Bakgrund och ursprung',
        text: 'Sverigedemokraterna bildades 1988 ur en rörelse med rötter i extremhögern. Under 2000-talet genomfördes en successiv "avnazifiering" under Mikael Jansson och sedan Jimmie Åkesson.',
      },
      {
        title: 'Kampanjstrategin 2010',
        text: '"Invandringsbroms eller pensionsbroms?" blev kampanjens mest minnesvärda fras. Strategin byggde på att koppla invandringskostnader till välfärd — ett grepp som skulle återkomma i framtida val.',
      },
      {
        title: 'Reaktioner och motstånd',
        text: 'Etablerade partier vägrade samarbete. Demonstrationer hölls. Affischer vandaliserades. Men uppmärksamheten — positiv som negativ — hjälpte partiet att växa.',
      },
      {
        title: 'Utvecklingen 2014–2022',
        text: 'Från 12,9% (2014) till 17,5% (2018) till 20,5% (2022). Sverigedemokraterna blev Sveriges näst största parti och del av regeringsunderlaget.',
      },
    ],
    searchQuery: 'Sverigedemokraterna OR SD',
    yearRange: { from: 2010, to: 2022 },
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const exhibition = exhibitionsData[slug];

  if (!exhibition) {
    return {
      title: 'Utställning ej funnen — Valaffischen',
    };
  }

  return {
    title: `${exhibition.title} — Valaffischen`,
    description: exhibition.description,
  };
}

export default async function UtstallningPage({ params }: Props) {
  const { slug } = await params;
  const exhibition = exhibitionsData[slug];

  if (!exhibition) {
    notFound();
  }

  // Search for posters matching this exhibition's criteria
  const response = await searchPoliticalPosters({
    query: exhibition.searchQuery,
    fromYear: exhibition.yearRange?.from,
    toYear: exhibition.yearRange?.to,
    limit: 30,
    sort: 'datePublished',
  });

  const posters: Poster[] = response.hits.map(transformKBPoster).filter((p) => p.thumbnailUrl);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <nav className="text-sm text-[var(--text-secondary)]">
            <Link
              href="/utstallningar"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Utställningar
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--text-primary)]">{exhibition.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-[var(--bg-dark)] text-[var(--text-inverse)]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-dark)] via-[var(--bg-dark)]/90 to-[var(--bg-dark)]/70 z-10" />
          <Image
            src={exhibition.coverImage}
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.15em] text-[#A8A29E] mb-4">
              Utställning • {posters.length} affischer
            </p>
            <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold">
              {exhibition.title}
            </h1>
            <p className="mt-4 text-xl text-[#A8A29E]">{exhibition.subtitle}</p>
            <p className="mt-8 text-lg text-[#D4D0CA] leading-relaxed">{exhibition.description}</p>
            {exhibition.curator && (
              <p className="mt-6 text-sm text-[#A8A29E]">Kuraterad av {exhibition.curator}</p>
            )}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            {exhibition.longDescription.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Sections with posters */}
      {exhibition.sections.map((section, sectionIndex) => {
        const sectionPosters = posters.slice(
          sectionIndex * Math.ceil(posters.length / exhibition.sections.length),
          (sectionIndex + 1) * Math.ceil(posters.length / exhibition.sections.length)
        );

        return (
          <section
            key={sectionIndex}
            className={`py-16 ${sectionIndex % 2 === 0 ? 'bg-[var(--bg-secondary)]' : ''}`}
          >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <div className="grid lg:grid-cols-12 gap-12 mb-12">
                <div className="lg:col-span-5">
                  <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                    {section.title}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </div>

              {/* Posters for this section */}
              {sectionPosters.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {sectionPosters.slice(0, 5).map((poster) => {
                    const imageUrl = resolvePosterImage(poster);
                    return (
                    <Link
                      key={poster.id}
                      href={`/affischer/${poster.id}`}
                      className="group card-hover border border-transparent"
                    >
                      <div
                        className={`relative aspect-[3/4] ${
                          sectionIndex % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'
                        }`}
                      >
                        {imageUrl && (
                        <Image
                          src={imageUrl.startsWith('/') ? imageUrl : imageUrl.replace('/200,/', '/400,/')}
                          alt={poster.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-contain"
                        />
                        )}
                      </div>
                      <div className="mt-3">
                        <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                          {poster.title}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                          {poster.year}
                        </p>
                      </div>
                    </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* All posters in exhibition */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-8">
            Alla affischer i utställningen
          </h2>

          {posters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {posters.map((poster) => {
                const imageUrl = resolvePosterImage(poster);
                return (
                <Link
                  key={poster.id}
                  href={`/affischer/${poster.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-[var(--bg-primary)]">
                    {imageUrl && (
                    <Image
                      src={imageUrl.startsWith('/') ? imageUrl : imageUrl.replace('/200,/', '/300,/')}
                      alt={poster.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-contain"
                    />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-1 group-hover:text-[var(--text-primary)] transition-colors">
                    {poster.title}
                  </p>
                </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--text-secondary)]">
              Inga affischer hittades för denna utställning.
            </p>
          )}
        </div>
      </section>

      {/* Related exhibitions */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-[var(--text-primary)] mb-8">
            Fler utställningar
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin">
            {Object.entries(exhibitionsData)
              .filter(([s]) => s !== slug)
              .slice(0, 4)
              .map(([s, e]) => (
                <Link
                  key={s}
                  href={`/utstallningar/${s}`}
                  className="flex-shrink-0 w-72 group"
                >
                  <div className="relative aspect-[16/10] bg-[var(--bg-dark)]">
                    <Image
                      src={e.coverImage}
                      alt=""
                      fill
                      sizes="288px"
                      className="object-cover opacity-60"
                    />
                  </div>
                  <h3 className="mt-3 font-[var(--font-playfair)] text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {e.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{e.subtitle}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--bg-dark)] text-[var(--text-inverse)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold">
            Fortsätt utforska
          </h2>
          <p className="mt-4 text-[#A8A29E]">
            Upptäck fler affischer i samlingen eller utforska andra utställningar.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/utstallningar"
              className="px-6 py-3 border border-[var(--text-inverse)] text-[var(--text-inverse)] hover:bg-[var(--text-inverse)] hover:text-[var(--bg-dark)] transition-colors"
            >
              Alla utställningar
            </Link>
            <Link
              href="/affischer"
              className="px-6 py-3 bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] transition-colors"
            >
              Hela samlingen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
