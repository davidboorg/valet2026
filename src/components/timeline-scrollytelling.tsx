'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Poster } from '@/lib/types';
import { resolvePosterImage } from '@/lib/poster-image';

/**
 * Editorial story moment for scrollytelling
 */
export interface StoryMoment {
  id: string;
  year: number;
  title: string;
  subtitle?: string;
  narrative: string;
  insight?: string;
  posterIds?: string[];  // Featured poster IDs
  theme?: 'hope' | 'conflict' | 'change' | 'modern';
}

// Curated editorial moments for the timeline
export const EDITORIAL_MOMENTS: StoryMoment[] = [
  // === TIDIGT 1900-TAL ===
  {
    id: 'start',
    year: 1890,
    title: 'Politikens affischer föds',
    subtitle: 'Nya röster söker nya uttryck',
    narrative: `I slutet av 1800-talet börjar svenska politiska rörelser använda affischer för att nå ut. Arbetarrörelsen, nykterhetsrörelsen och tidiga liberaler experimenterar med ett nytt medium — den tryckta bilden på stadens murar.`,
    insight: 'Affischerna var ofta texttunga och argumenterande, riktade till en alltmer läskunnig arbetarklass.',
    theme: 'change',
  },
  {
    id: 'rostratt',
    year: 1921,
    title: 'Alla får rösta',
    subtitle: 'Demokratins genombrott',
    narrative: `1921 hålls det första riksdagsvalet med allmän och lika rösträtt för både kvinnor och män. Partierna tävlar nu om hela folkets gunst, och affischerna blir viktigare än någonsin.`,
    insight: 'Kvinnor användes ofta som symbol för framsteg och modernitet i dessa tidiga demokratiska affischer.',
    theme: 'hope',
  },
  {
    id: 'kosack',
    year: 1928,
    title: 'Kosackval och klasskonflikt',
    subtitle: 'Högern varnar för bolsjevismen',
    narrative: `"Kosackvalet" 1928 är ett av de mest polariserade i svensk historia. Högerpartiet varnar för att socialdemokraterna ska föra in Sovjet-kommunism i Sverige. Affischerna är dramatiska och fyllda av skräckbilder.`,
    insight: 'Detta var första gången svensk politik såg storskalig negativ kampanjföring med affischer.',
    theme: 'conflict',
  },
  {
    id: 'folkhem',
    year: 1936,
    title: 'Folkhemmet tar form',
    subtitle: 'Per Albin Hanssons vision',
    narrative: `Socialdemokraterna under Per Albin Hansson lanserar folkhemsvisionen. Affischerna skiftar ton — från klasskamp till nationell gemenskap. "Sverige åt svenskarna" blir ett samlande budskap som överskrider klassgränser.`,
    insight: 'Folkhemsbegreppet var ursprungligen konservativt men omformades av socialdemokraterna till ett progressivt projekt.',
    theme: 'hope',
  },
  {
    id: 'krig',
    year: 1940,
    title: 'Krigsår och samlingsregering',
    subtitle: 'Politiken tystnar',
    narrative: `Under andra världskriget bildas en samlingsregering. De vanliga valaffischerna ersätts av försvarspropaganda och uppmaningar till sparsamhet. Den politiska affischkonsten går i dvala.`,
    insight: 'Denna period är underrepresenterad i arkiven — partierna producerade få renodlade valaffischer.',
    theme: 'conflict',
  },
  {
    id: 'efterkrig',
    year: 1948,
    title: 'Efterkrigstid och välfärdsbygge',
    subtitle: 'Ny optimism',
    narrative: `Efter kriget blomstrar affischkonsten igen. Nu handlar det om att bygga det nya Sverige — bostäder, sjukvård, pensioner. Affischerna är ljusare, mer optimistiska, med familjer och barn i fokus.`,
    insight: 'Efterkrigsaffischerna etablerade den visuella grammatik som skulle dominera i decennier — ljusa färger, glada människor, modern typografi.',
    theme: 'hope',
  },

  // === REKORDÅREN OCH OMVÄLVNING ===
  {
    id: 'tv-aldern',
    year: 1960,
    title: 'TV-åldern inleds',
    subtitle: 'En ny arena öppnas',
    narrative: `1960-talet markerar TV:ns genombrott i svenska hem. Politikerna måste nu framträda i rörlig bild, men affischen behåller sin roll på gator och torg. Bildspråket blir renare, mer grafiskt — inspirerat av internationell design.`,
    insight: 'Partierna började anlita professionella reklambyråer. Affischerna blev del av bredare kampanjkoncept.',
    theme: 'modern',
  },
  {
    id: 'miljo',
    year: 1968,
    title: 'Nya frågor, nya partier',
    subtitle: 'Miljö och jämställdhet',
    narrative: `Kring 1968 börjar nya teman dyka upp i valretoriken: miljöförstöring, jämställdhet, u-landsfrågor. Centerpartiet rider på miljöfrågan medan vänstervågen påverkar ungdomsväljarna. Affischerna speglar en tid av ifrågasättande.`,
    insight: 'Miljöpartiet bildas 1981, men miljöfrågan syntes i affischer redan ett decennium tidigare.',
    theme: 'change',
  },
  {
    id: 'systemskifte',
    year: 1976,
    title: 'Systemskifte',
    subtitle: '44 år av socialdemokrati bryts',
    narrative: `För första gången sedan 1932 förlorar Socialdemokraterna makten. Thorbjörn Fälldin leder en borgerlig trepartiregering. Affischerna speglar en ny politisk dynamik — Sverige är inte längre självklart socialdemokratiskt.`,
    insight: 'Kärnkraftsfrågan dominerade valet 1976 — ett tidigt exempel på hur sakfrågor kunde avgöra val.',
    theme: 'change',
  },

  // === 1980- OCH 90-TAL ===
  {
    id: 'bildsamhallet',
    year: 1988,
    title: 'Bildsamhället och personpolitik',
    subtitle: 'Partiledaren blir varumärket',
    narrative: `Under 1980-talet blir partiledaren allt viktigare i kampanjerna. Ingvar Carlsson, Carl Bildt — personerna framträder mer än partierna. Affischerna blir porträttbaserade, känslomässiga, nästan som filmaffischer.`,
    insight: 'Sverigedemokraterna bildas 1988 — men syns inte i valaffischer förrän decennier senare.',
    theme: 'modern',
  },
  {
    id: 'kris-91',
    year: 1991,
    title: 'Krisval och nya partier',
    subtitle: 'Fyra nya i riksdagen',
    narrative: `Valet 1991 är historiskt: fyra nya partier tar sig in i riksdagen — Ny demokrati, Kristdemokraterna, Miljöpartiet och Feministiskt initiativ missar knappt. Affischerna exploderar i mångfald. Carl Bildts Moderaterna tar makten.`,
    insight: '"Brottslingar ska sitta inne. Du ska våga vara ute." — Moderaternas klassiska trygghetskampanj definierade årtiondet.',
    theme: 'change',
  },
  {
    id: 'eu',
    year: 1994,
    title: 'EU-inträde och globalisering',
    subtitle: 'Sverige i Europa',
    narrative: `1994 års val präglas av EU-frågan. Sverige röstar ja till EU-medlemskap i november. Affischerna delar sig i ja- och nej-sida, men traditionella partiskillnader suddas ut. Socialdemokraterna vinner tillbaka makten.`,
    insight: 'EU-valet 1995 skapade nya allianser — miljöpartister och moderater kampanjade tillsammans mot EU.',
    theme: 'conflict',
  },

  // === 2000-TALET ===
  {
    id: 'arbetarparti',
    year: 2006,
    title: 'Det nya arbetarpartiet',
    subtitle: 'Moderaterna omdefinierar sig',
    narrative: `Fredrik Reinfeldt och Per Schlingmann genomför en av svensk politikhistorias mest framgångsrika omprofileringar. "Det nya arbetarpartiet" vänder Moderaternas image. Affischerna är ljusa, optimistiska, arbetslinjen dominerar.`,
    insight: 'Alliansen (M+C+FP+KD) lanserades som ett sammanhållet regeringsalternativ — första gången på 70 år som borgarna vann två val i rad.',
    theme: 'hope',
  },
  {
    id: 'sd-riksdagen',
    year: 2010,
    title: 'SD i riksdagen',
    subtitle: 'Ett nytt politiskt landskap',
    narrative: `Sverigedemokraterna tar sig för första gången in i riksdagen med 5,7% av rösterna. Det politiska landskapet förändras permanent. Affischerna från detta val visar en bransch i chock — ingen hade förberett sig på detta.`,
    insight: '"Invandringsbroms eller pensionsbroms?" — SD:s mest minnesvärda affischkampanj polariserade debatten.',
    theme: 'conflict',
  },
  {
    id: 'blockpolitikens-fall',
    year: 2018,
    title: 'Blockpolitikens fall',
    subtitle: '134 dagar utan regering',
    narrative: `Valet 2018 slutar i parlamentariskt kaos. Varken det röd-gröna blocket eller Alliansen kan bilda regering. Efter rekordlånga förhandlingar bildas en S-MP-regering med stöd av C och L. Affischerna lovar — men landet levererar?`,
    insight: 'De 134 dagarna utan regering tvingade partierna att tänka om — de gamla blocken höll inte längre.',
    theme: 'conflict',
  },
  {
    id: 'kris-och-omstart',
    year: 2022,
    title: 'Kris och omstart',
    subtitle: 'Krig i Europa, val i Sverige',
    narrative: `Med Rysslands invasion av Ukraina som fond går Sverige till val 2022. Energipriser, gängkriminalitet, NATO-ansökan — affischerna speglar en nation i oro. Högerblocket vinner med stöd av SD. Ulf Kristersson blir statsminister.`,
    insight: 'Magdalena Anderssons S hade lett hela valrörelsen — men förlorade med 0,6 procentenheters marginal.',
    theme: 'conflict',
  },

  // === FRAMTIDEN ===
  {
    id: 'idag',
    year: 2026,
    title: 'Valet 2026',
    subtitle: 'Demokratin lever',
    narrative: `I september 2026 går Sverige åter till val. Vilka berättelser kommer affischerna att berätta? Vilka löften, vilka varningar, vilka drömmar? Historien fortsätter skrivas — en affisch i taget.`,
    insight: 'Du läser detta inför valet 2026. Valaffischen dokumenterar nutiden för framtidens historiker.',
    theme: 'hope',
  },
];

// Theme colors
const THEME_COLORS: Record<StoryMoment['theme'] & string, { bg: string; accent: string }> = {
  hope: { bg: '#F0F8F4', accent: '#3D7A5F' },
  conflict: { bg: '#FEF3E8', accent: '#B8860B' },
  change: { bg: '#F0F4F8', accent: '#52BDEC' },
  modern: { bg: '#F8F6F4', accent: '#7C6955' },
};

interface TimelineScrollytellingProps {
  posters: Poster[];
  moments?: StoryMoment[];
}

export function TimelineScrollytelling({
  posters,
  moments = EDITORIAL_MOMENTS
}: TimelineScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMoment, setActiveMoment] = useState<string | null>(null);

  // Get featured posters for a moment
  const getFeaturedPosters = useCallback((moment: StoryMoment): Poster[] => {
    // If specific poster IDs are provided, use those
    if (moment.posterIds && moment.posterIds.length > 0) {
      return moment.posterIds
        .map(id => posters.find(p => p.id === id))
        .filter((p): p is Poster => p !== undefined);
    }

    // Otherwise, get posters from around that year
    const yearRange = 3;
    return posters
      .filter(p => p.year && Math.abs(p.year - moment.year) <= yearRange)
      .slice(0, 4);
  }, [posters]);

  return (
    <div ref={containerRef} className="relative">
      {/* Progress indicator */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-3">
          {moments.map(moment => (
            <button
              key={moment.id}
              onClick={() => {
                const element = document.getElementById(`moment-${moment.id}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                activeMoment === moment.id
                  ? 'bg-[var(--accent)] scale-150'
                  : 'bg-[var(--border)] hover:bg-[var(--text-secondary)]'
              }`}
              aria-label={`Gå till ${moment.title}`}
            />
          ))}
        </div>
      </div>

      {/* Story moments */}
      <div className="space-y-32 lg:space-y-48 py-16">
        {moments.map((moment, index) => (
          <StorySection
            key={moment.id}
            moment={moment}
            featuredPosters={getFeaturedPosters(moment)}
            isEven={index % 2 === 0}
            onInView={() => setActiveMoment(moment.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface StorySectionProps {
  moment: StoryMoment;
  featuredPosters: Poster[];
  isEven: boolean;
  onInView: () => void;
}

function StorySection({ moment, featuredPosters, isEven, onInView }: StorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const themeColors = THEME_COLORS[moment.theme || 'change'];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            onInView();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [onInView]);

  return (
    <section
      ref={sectionRef}
      id={`moment-${moment.id}`}
      className={`relative max-w-6xl mx-auto px-6 lg:px-12 ${
        isEven ? 'lg:ml-auto lg:mr-24' : 'lg:mr-auto lg:ml-24'
      }`}
    >
      <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${
        isEven ? '' : 'lg:grid-flow-dense'
      }`}>
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={isEven ? '' : 'lg:col-start-2'}
        >
          {/* Year badge */}
          <div
            className="inline-block px-4 py-2 text-sm font-bold mb-4"
            style={{ backgroundColor: themeColors.accent, color: 'white' }}
          >
            {moment.year}
          </div>

          {/* Title */}
          <h2 className="font-[var(--font-playfair)] text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2">
            {moment.title}
          </h2>

          {/* Subtitle */}
          {moment.subtitle && (
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              {moment.subtitle}
            </p>
          )}

          {/* Narrative */}
          <p className="text-[var(--text-primary)] leading-relaxed mb-6">
            {moment.narrative}
          </p>

          {/* Insight callout */}
          {moment.insight && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pl-4 border-l-2"
              style={{ borderColor: themeColors.accent }}
            >
              <p className="text-sm text-[var(--text-secondary)] italic">
                {moment.insight}
              </p>
            </motion.div>
          )}

          {/* Link to explore this year */}
          <Link
            href={`/affischer?year=${moment.year}`}
            className="inline-flex items-center gap-2 mt-6 text-sm font-medium hover:underline"
            style={{ color: themeColors.accent }}
          >
            Se affischer från {moment.year}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Featured posters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-8 lg:mt-0 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
        >
          {featuredPosters.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {featuredPosters.slice(0, 4).map((poster, idx) => {
                const imageUrl = resolvePosterImage(poster);
                return (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  className="relative aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden group"
                >
                  <Link href={`/affischer/${poster.id}`}>
                    {imageUrl && (
                    <Image
                      src={imageUrl.startsWith('/') ? imageUrl : imageUrl.replace('/200,/', '/400,/')}
                      alt={poster.title}
                      fill
                      sizes="(max-width: 768px) 40vw, 200px"
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
                );
              })}
            </div>
          ) : (
            <div
              className="aspect-square flex items-center justify-center rounded-sm"
              style={{ backgroundColor: themeColors.bg }}
            >
              <p className="text-[var(--text-secondary)] text-sm">
                Inga affischer från {moment.year} i samlingen
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Compact year marker for inline timeline
 */
interface YearMarkerProps {
  year: number;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function YearMarker({ year, label, isActive, onClick }: YearMarkerProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center group ${
        isActive ? 'scale-110' : ''
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full transition-all ${
          isActive
            ? 'bg-[var(--accent)] scale-125'
            : 'bg-[var(--border)] group-hover:bg-[var(--text-secondary)]'
        }`}
      />
      <span
        className={`mt-1 text-xs font-medium ${
          isActive
            ? 'text-[var(--accent)]'
            : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
        }`}
      >
        {year}
      </span>
      <span className="text-xs text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
