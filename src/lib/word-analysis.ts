/**
 * Word analysis utilities for the ord-explorer
 *
 * Analyzes slogans and text from election posters to extract
 * word frequencies, trends over time, and party-specific vocabulary.
 */

import type { Poster } from './types';

export interface WordData {
  word: string;
  count: number;
  years: number[];
  parties: string[];
  posterIds: string[];
}

export interface WordCloudItem {
  text: string;
  value: number;
  years: number[];
  parties: string[];
}

// Swedish stop words to filter out
const STOP_WORDS = new Set([
  'och', 'i', 'att', 'det', 'en', 'ett', 'på', 'är', 'av', 'för', 'med',
  'till', 'den', 'de', 'som', 'har', 'om', 'vi', 'kan', 'inte', 'vara',
  'eller', 'ska', 'från', 'nu', 'du', 'din', 'ditt', 'dina', 'sig', 'så',
  'men', 'när', 'vad', 'hur', 'var', 'alla', 'få', 'ta', 'ge', 'göra',
  'mer', 'mot', 'bara', 'vid', 'under', 'över', 'efter', 'genom', 'utan',
  'kommer', 'blev', 'blir', 'varit', 'kunna', 'skulle', 'måste', 'också',
  'sedan', 'redan', 'honom', 'henne', 'dem', 'oss', 'mig', 'dig',
  'sin', 'sitt', 'sina', 'hans', 'hennes', 'dess', 'deras', 'vår', 'vårt', 'våra',
  'denna', 'detta', 'dessa', 'vilken', 'vilket', 'vilka', 'vem', 'vars',
  'varje', 'några', 'något', 'någon', 'ingen', 'inget', 'inga',
  'samma', 'annat', 'andra', 'annan', 'själv', 'själva',
  '—', '-', '–', '!', '?', '.', ',', ':', ';',
]);

// Minimum word length
const MIN_WORD_LENGTH = 3;

/**
 * Extract and clean words from text
 */
function extractWords(text: string): string[] {
  if (!text) return [];

  return text
    .toLowerCase()
    .replace(/[^\wåäöÅÄÖ\s-]/g, ' ')
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word =>
      word.length >= MIN_WORD_LENGTH &&
      !STOP_WORDS.has(word) &&
      !/^\d+$/.test(word)
    );
}

/**
 * Extract text content from a poster (title, slogan, transcribed text)
 */
function extractPosterText(poster: Poster): string {
  const parts: string[] = [];

  if (poster.slogan) parts.push(poster.slogan);
  if (poster.transcribedText) parts.push(poster.transcribedText);

  // Also extract meaningful words from title (but not generic ones)
  if (poster.title) {
    // Skip party names and years in title
    const cleanTitle = poster.title
      .replace(/\d{4}/g, '')
      .replace(/socialdemokraterna|moderaterna|centerpartiet|vänsterpartiet|liberalerna|kristdemokraterna|miljöpartiet|sverigedemokraterna/gi, '');
    parts.push(cleanTitle);
  }

  return parts.join(' ');
}

/**
 * Analyze word frequencies across all posters
 */
export function analyzeWords(posters: Poster[]): Map<string, WordData> {
  const wordMap = new Map<string, WordData>();

  for (const poster of posters) {
    const text = extractPosterText(poster);
    const words = extractWords(text);

    for (const word of words) {
      const existing = wordMap.get(word);

      if (existing) {
        existing.count++;
        if (poster.year && !existing.years.includes(poster.year)) {
          existing.years.push(poster.year);
        }
        if (poster.party && !existing.parties.includes(poster.party)) {
          existing.parties.push(poster.party);
        }
        if (!existing.posterIds.includes(poster.id)) {
          existing.posterIds.push(poster.id);
        }
      } else {
        wordMap.set(word, {
          word,
          count: 1,
          years: poster.year ? [poster.year] : [],
          parties: poster.party ? [poster.party] : [],
          posterIds: [poster.id],
        });
      }
    }
  }

  return wordMap;
}

/**
 * Get top words sorted by frequency
 */
export function getTopWords(wordMap: Map<string, WordData>, limit = 100): WordData[] {
  return Array.from(wordMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get words for a specific decade
 */
export function getWordsByDecade(wordMap: Map<string, WordData>, decade: number): WordData[] {
  const decadeStart = decade;
  const decadeEnd = decade + 9;

  return Array.from(wordMap.values())
    .filter(word => word.years.some(year => year >= decadeStart && year <= decadeEnd))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get words for a specific party
 */
export function getWordsByParty(wordMap: Map<string, WordData>, party: string): WordData[] {
  return Array.from(wordMap.values())
    .filter(word => word.parties.includes(party))
    .sort((a, b) => b.count - a.count);
}

/**
 * Convert to word cloud format
 */
export function toWordCloudItems(words: WordData[], maxItems = 80): WordCloudItem[] {
  return words.slice(0, maxItems).map(word => ({
    text: word.word,
    value: word.count,
    years: word.years.sort((a, b) => a - b),
    parties: word.parties,
  }));
}

/**
 * Get word trends over time (how word usage changes by decade)
 */
export function getWordTrends(wordMap: Map<string, WordData>): Map<string, Map<number, number>> {
  const trends = new Map<string, Map<number, number>>();

  for (const [word, data] of wordMap) {
    if (data.count < 2) continue; // Only track words that appear multiple times

    const decadeCounts = new Map<number, number>();
    for (const year of data.years) {
      const decade = Math.floor(year / 10) * 10;
      decadeCounts.set(decade, (decadeCounts.get(decade) || 0) + 1);
    }

    if (decadeCounts.size > 1) {
      trends.set(word, decadeCounts);
    }
  }

  return trends;
}

/**
 * Sample slogans for demonstration when real data is limited
 */
export const SAMPLE_SLOGANS: Array<{ year: number; party: string; slogan: string }> = [
  // Historical
  { year: 1921, party: 'Socialdemokraterna', slogan: 'Rösta med arbetarklassen' },
  { year: 1921, party: 'Högerpartiet', slogan: 'För lag och ordning' },
  { year: 1928, party: 'Socialdemokraterna', slogan: 'Kamp mot kapitalet' },
  { year: 1932, party: 'Socialdemokraterna', slogan: 'Folkhemmet bygger vi tillsammans' },
  { year: 1936, party: 'Bondeförbundet', slogan: 'Värna svensk jord' },
  { year: 1940, party: 'Socialdemokraterna', slogan: 'Enighet ger styrka' },
  { year: 1944, party: 'Folkpartiet', slogan: 'Frihet och framsteg' },
  { year: 1948, party: 'Socialdemokraterna', slogan: 'Trygghet för alla' },

  // Modern
  { year: 2006, party: 'Moderaterna', slogan: 'Sveriges nya arbetarparti' },
  { year: 2010, party: 'Moderaterna', slogan: 'Bara ett arbetarparti kan fixa jobben' },
  { year: 2010, party: 'Sverigedemokraterna', slogan: 'Invandringsbroms eller pensionsbroms' },
  { year: 2014, party: 'Socialdemokraterna', slogan: 'Fler jobb till alla' },
  { year: 2014, party: 'Sverigedemokraterna', slogan: 'Förändring på riktigt' },
  { year: 2018, party: 'Moderaterna', slogan: 'Nu tar vi tag i Sverige' },
  { year: 2022, party: 'Moderaterna', slogan: 'Nu får vi ordning på Sverige' },
  { year: 2022, party: 'Sverigedemokraterna', slogan: 'Sverige ska bli bra igen' },
];

/**
 * Combine poster data with sample slogans for richer analysis
 */
export function enrichWithSamples(posters: Poster[]): Poster[] {
  const enriched = [...posters];

  // Add sample slogans as pseudo-posters for analysis
  for (const sample of SAMPLE_SLOGANS) {
    // Check if we already have this slogan from a real poster
    const exists = enriched.some(p =>
      p.slogan?.toLowerCase() === sample.slogan.toLowerCase() ||
      p.title?.toLowerCase().includes(sample.slogan.toLowerCase())
    );

    if (!exists) {
      enriched.push({
        id: `sample-${sample.year}-${sample.party.toLowerCase().replace(/\s/g, '-')}`,
        title: sample.slogan,
        slogan: sample.slogan,
        year: sample.year,
        party: sample.party,
        source: 'external',
        thumbnailUrl: '',
        rightsStatus: 'unknown',
      });
    }
  }

  return enriched;
}
