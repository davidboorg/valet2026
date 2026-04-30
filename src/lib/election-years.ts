/**
 * Swedish Election Years
 *
 * Riksdag elections in Sweden:
 * - 1866-1970: Bicameral parliament (Andra kammaren elections)
 * - 1970-1994: Unicameral, 3-year terms
 * - 1994-present: Unicameral, 4-year terms
 *
 * Note: 1921 was the first election with universal suffrage (women could vote)
 */

// All Swedish general election years
export const SWEDISH_ELECTION_YEARS: number[] = [
  // Early elections (Andra kammaren) - selection of key years
  1893, 1896, 1899, 1902, 1905, 1908, 1911, 1914, 1917,

  // Universal suffrage era (1920s-1960s)
  1920, 1921, 1924, 1928, 1932, 1936, 1940, 1944, 1948,
  1952, 1956, 1958, 1960, 1964, 1968,

  // Unicameral parliament, 3-year terms (1970-1994)
  1970, 1973, 1976, 1979, 1982, 1985, 1988, 1991,

  // 4-year terms (1994-present)
  1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026
];

// Election years as a Set for O(1) lookup
export const ELECTION_YEARS_SET = new Set(SWEDISH_ELECTION_YEARS);

/**
 * Check if a year is an election year
 */
export function isElectionYear(year: number | undefined | null): boolean {
  if (!year) return false;
  return ELECTION_YEARS_SET.has(year);
}

/**
 * Get the nearest election year to a given year
 */
export function getNearestElectionYear(year: number): number {
  let nearest = SWEDISH_ELECTION_YEARS[0];
  let minDiff = Math.abs(year - nearest);

  for (const electionYear of SWEDISH_ELECTION_YEARS) {
    const diff = Math.abs(year - electionYear);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = electionYear;
    }
  }

  return nearest;
}

/**
 * Get election years within a range
 */
export function getElectionYearsInRange(start: number, end: number): number[] {
  return SWEDISH_ELECTION_YEARS.filter(year => year >= start && year <= end);
}

/**
 * Historical context for election years
 */
export const ELECTION_CONTEXT: Record<number, { title: string; description: string }> = {
  1921: {
    title: 'Första valet med allmän rösträtt',
    description: 'För första gången får alla myndiga svenskar rösta, oavsett kön eller förmögenhet.',
  },
  1928: {
    title: 'Kosackvalet',
    description: 'Högern varnade för kommunism med den berömda "kosackaffischen".',
  },
  1932: {
    title: 'Per Albin tar makten',
    description: 'Socialdemokraterna vinner och Per Albin Hansson blir statsminister. Folkhemmet tar form.',
  },
  1936: {
    title: 'Krisuppgörelsen',
    description: 'Socialdemokraterna och Bondeförbundet samarbetar. Valet hålls i skuggan av nazismens framväxt.',
  },
  1940: {
    title: 'Krigsval',
    description: 'Val under andra världskriget. Samlingsregering styr Sverige.',
  },
  1944: {
    title: 'Efterkrigsplanering',
    description: 'Valet handlar om Sveriges framtid efter kriget.',
  },
  1948: {
    title: 'Kalla krigets början',
    description: 'Tjeckoslovakiens kommunistkupp påverkar svensk debatt.',
  },
  1994: {
    title: 'EU-valet',
    description: 'Sverige röstar om EU-medlemskap samma år som riksdagsvalet.',
  },
  2022: {
    title: 'Blockskifte',
    description: 'Högerblocket tar makten efter åtta år av S-ledd regering.',
  },
  2026: {
    title: 'Kommande val',
    description: 'Nästa riksdagsval hålls den 13 september 2026.',
  },
};

/**
 * Get election years covered by KB's collection (1892-1951)
 */
export const KB_COLLECTION_ELECTION_YEARS = SWEDISH_ELECTION_YEARS.filter(
  year => year >= 1892 && year <= 1951
);
