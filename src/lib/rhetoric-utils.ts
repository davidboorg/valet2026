import type { Poster } from './types';

/**
 * Demo data enrichment - adds sample rhetoric data to posters for demonstration.
 * This is a shared utility that can be used on both server and client.
 */
export function enrichWithSampleRhetoric(posters: Poster[]): Poster[] {
  // Sample rhetoric assignments based on year and party
  const sampleRhetoric: Array<{
    yearRange: [number, number];
    party?: string;
    tone: Poster['tone'];
    devices: string[];
    themes: string[];
  }> = [
    { yearRange: [1890, 1920], tone: 'upprorisk', devices: ['patos', 'upprepning'], themes: ['rösträtt', 'klass'] },
    { yearRange: [1920, 1935], tone: 'hoppfull', devices: ['metafor', 'anafor'], themes: ['arbete', 'rättvisa'] },
    { yearRange: [1935, 1950], tone: 'saklig', devices: ['etos', 'logos'], themes: ['trygghet', 'folkhem'] },
    { yearRange: [1950, 1970], tone: 'lugn', devices: ['etos', 'logos'], themes: ['välfärd', 'stabilitet'] },
    { yearRange: [1970, 1990], tone: 'hoppfull', devices: ['metafor', 'patos'], themes: ['miljö', 'jämställdhet'] },
    { yearRange: [1990, 2010], tone: 'saklig', devices: ['logos', 'etos'], themes: ['ekonomi', 'EU'] },
    { yearRange: [2006, 2015], party: 'Moderaterna', tone: 'hoppfull', devices: ['metafor', 'antites'], themes: ['arbete', 'skatter'] },
    { yearRange: [2010, 2025], party: 'Sverigedemokraterna', tone: 'hotande', devices: ['antites', 'patos', 'retorisk_fraga'], themes: ['migration', 'trygghet'] },
    { yearRange: [2014, 2025], party: 'Socialdemokraterna', tone: 'hoppfull', devices: ['upprepning', 'etos'], themes: ['jobb', 'välfärd'] },
    { yearRange: [2010, 2025], party: 'Centerpartiet', tone: 'hoppfull', devices: ['metafor', 'patos'], themes: ['landsbygd', 'företagande'] },
    { yearRange: [2010, 2025], party: 'Vänsterpartiet', tone: 'upprorisk', devices: ['patos', 'antites'], themes: ['rättvisa', 'välfärd'] },
    { yearRange: [2010, 2025], party: 'Miljöpartiet', tone: 'hoppfull', devices: ['metafor', 'patos'], themes: ['klimat', 'framtid'] },
    { yearRange: [2010, 2025], party: 'Liberalerna', tone: 'saklig', devices: ['logos', 'etos'], themes: ['utbildning', 'frihet'] },
    { yearRange: [2010, 2025], party: 'Kristdemokraterna', tone: 'nostalgisk', devices: ['etos', 'patos'], themes: ['familj', 'värden'] },
  ];

  return posters.map(poster => {
    // Skip if already has rhetoric data
    if (poster.tone || (poster.rhetoricalDevices && poster.rhetoricalDevices.length > 0)) {
      return poster;
    }

    // Find matching sample rhetoric
    const match = sampleRhetoric.find(sample => {
      const yearMatch = poster.year &&
        poster.year >= sample.yearRange[0] &&
        poster.year <= sample.yearRange[1];
      const partyMatch = !sample.party || poster.party === sample.party;
      return yearMatch && partyMatch;
    });

    if (match) {
      return {
        ...poster,
        tone: match.tone,
        rhetoricalDevices: match.devices,
        themes: poster.themes || match.themes,
      };
    }

    // Default fallback based on era
    if (poster.year) {
      if (poster.year < 1940) {
        return { ...poster, tone: 'upprorisk' as const, rhetoricalDevices: ['patos'] };
      } else if (poster.year < 1980) {
        return { ...poster, tone: 'saklig' as const, rhetoricalDevices: ['logos'] };
      } else {
        return { ...poster, tone: 'hoppfull' as const, rhetoricalDevices: ['etos'] };
      }
    }

    return poster;
  });
}
