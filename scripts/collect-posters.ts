#!/usr/bin/env npx tsx
/**
 * Valaffischmuseet — Poster Collection Script
 *
 * Systematically searches for Swedish election posters from multiple sources:
 * 1. Wikimedia Commons category API
 * 2. Swedish Wikipedia election pages
 *
 * Usage:
 *   npx tsx scripts/collect-posters.ts --party "Socialdemokraterna" --year 1932
 *   npx tsx scripts/collect-posters.ts --scan-all
 *   npx tsx scripts/collect-posters.ts --scan-all --modern    # 1988-2022 endast
 *   npx tsx scripts/collect-posters.ts --verify
 *   npx tsx scripts/collect-posters.ts --import-to-db         # importera till Supabase
 *   npx tsx scripts/collect-posters.ts --dry-run --import-to-db
 *
 * Miljövariabler:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CLI Args ---
const args = process.argv.slice(2);
const scanAll = args.includes('--scan-all');
const modernOnly = args.includes('--modern');
const verifyMode = args.includes('--verify');
const importToDb = args.includes('--import-to-db');
const dryRun = args.includes('--dry-run');
const partyArg = args.includes('--party') ? args[args.indexOf('--party') + 1] : null;
const yearArg = args.includes('--year') ? parseInt(args[args.indexOf('--year') + 1], 10) : null;

// --- Config ---
const USER_AGENT = 'ValaffischmuseetBot/1.0 (kontakt: david@surpriseventures.io; https://valaffischer.se)';
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'data', 'poster-candidates.json');

// Types
interface PosterCandidate {
  id?: string;
  party: string;
  year: number;
  title: string;
  slogan?: string;
  image_url: string;
  thumbnail_url?: string;
  source: 'wikimedia' | 'affischerna' | 'stockholmskallan' | 'dimu' | 'media_archive' | 'kb';
  source_url: string;
  rights_status: 'free' | 'fair_use' | 'restricted' | 'unknown';
  verified: boolean;
  verification_notes?: string;
  wikimedia_pageid?: number;
}

// Election years (riksdagsval)
const ELECTION_YEARS = [
  1908, 1911, 1914, 1917, 1920, 1921, 1924, 1928, 1932, 1936, 1940,
  1944, 1948, 1952, 1956, 1958, 1960, 1964, 1968, 1970, 1973, 1976,
  1979, 1982, 1985, 1988, 1991, 1994, 1998, 2002, 2006, 2010, 2014,
  2018, 2022
];

// Modern elections (prioriterat av användaren)
const MODERN_YEARS = [1988, 1991, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022];

// Ytterligare Wikimedia Commons-kategorier för svenska valaffischer
const ADDITIONAL_CATEGORIES = [
  'Swedish_election_posters',
  'Election_posters_in_Sweden',
  'Political_posters_of_Sweden',
  'Swedish_political_posters',
  'Valaffischer',
  'Swedish_election_campaign_material',
  'Political_campaign_material_of_Sweden',
  'Election_campaigns_in_Sweden',
];

// Söktermer för Wikimedia Search API
const SEARCH_QUERIES = [
  'Swedish election poster',
  'svenska valaffisch',
  'riksdagsval affisch',
  'valrörelse Sverige',
  'Swedish political poster',
  'socialdemokraterna affisch',
  'moderaterna affisch',
  'centerpartiet affisch',
  'högerpartiet affisch',
  'bondeförbundet affisch',
];

// Parties to track
const PARTIES: Record<string, { aliases: string[]; wikimedia_category: string; founded: number; keywords: string[] }> = {
  'Socialdemokraterna': {
    aliases: ['SAP', 'Socialdemokratiska arbetarepartiet', 'Sveriges socialdemokratiska arbetareparti', 'S', 'Sossarna'],
    wikimedia_category: 'Election_posters_of_the_Social_Democratic_Party_(Sweden)',
    founded: 1889,
    keywords: ['socialdemokrat', 'sap', 'arbetareparti', 'branting', 'palme', 'löfven', 'andersson', 'persson', 'carlsson']
  },
  'Moderaterna': {
    aliases: ['Högerpartiet', 'Allmänna valmansförbundet', 'AVF', 'Högern', 'M'],
    wikimedia_category: 'Election_posters_of_the_Moderate_Party_(Sweden)',
    founded: 1904,
    keywords: ['moderat', 'höger', 'bildt', 'reinfeldt', 'kristersson', 'borg']
  },
  'Centerpartiet': {
    aliases: ['Bondeförbundet', 'Centern', 'C'],
    wikimedia_category: 'Election_posters_of_the_Centre_Party_(Sweden)',
    founded: 1913,
    keywords: ['center', 'bonde', 'fälldin', 'lööf', 'johansson', 'olsson']
  },
  'Liberalerna': {
    aliases: ['Folkpartiet', 'FP', 'Frisinnade', 'L', 'Folkpartiet liberalerna'],
    wikimedia_category: 'Election_posters_of_the_Liberal_Party_(Sweden)',
    founded: 1902,
    keywords: ['liberal', 'folkparti', 'frisinn', 'sabuni', 'björklund', 'pehrson']
  },
  'Vänsterpartiet': {
    aliases: ['VPK', 'SKP', 'Kommunistpartiet', 'Vänsterpartiet Kommunisterna', 'V'],
    wikimedia_category: 'Election_posters_of_the_Left_Party_(Sweden)',
    founded: 1917,
    keywords: ['vänster', 'kommunist', 'vpk', 'skp', 'ohly', 'sjöstedt', 'dadgostar']
  },
  'Miljöpartiet': {
    aliases: ['MP', 'Miljöpartiet de gröna', 'Gröna'],
    wikimedia_category: 'Election_posters_of_the_Green_Party_(Sweden)',
    founded: 1981,
    keywords: ['miljö', 'grön', 'romson', 'fridolin', 'bolund', 'stenevi']
  },
  'Kristdemokraterna': {
    aliases: ['KD', 'KDS', 'Kristen demokratisk samling'],
    wikimedia_category: 'Election_posters_of_the_Christian_Democrats_(Sweden)',
    founded: 1964,
    keywords: ['kristdemokrat', 'kd', 'kds', 'hägglund', 'busch']
  },
  'Sverigedemokraterna': {
    aliases: ['SD'],
    wikimedia_category: 'Election_posters_of_the_Sweden_Democrats',
    founded: 1988,
    keywords: ['sverigedemokrat', 'sd', 'åkesson']
  }
};

// API endpoints
const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php';
const WIKIPEDIA_API = 'https://sv.wikipedia.org/w/api.php';

// --- Supabase setup (lazy init) ---
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Saknar NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY');
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// --- Helpers ---
async function fetchWithUserAgent(url: string | URL, options: RequestInit = {}): Promise<Response> {
  return fetch(url.toString(), {
    ...options,
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      ...options.headers,
    },
  });
}

function detectPartyFromText(text: string): string {
  const lowerText = text.toLowerCase();
  for (const [party, config] of Object.entries(PARTIES)) {
    // Check keywords
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword)) return party;
    }
    // Check aliases
    for (const alias of config.aliases) {
      if (lowerText.includes(alias.toLowerCase())) return party;
    }
  }
  return 'unknown';
}

function extractYearFromText(text: string): number {
  // Look for 4-digit years in election year range
  const matches = text.match(/\b(19\d{2}|20[0-2]\d)\b/g);
  if (matches) {
    for (const match of matches) {
      const year = parseInt(match, 10);
      // Check if it's a plausible election year (within 2 years of actual)
      if (ELECTION_YEARS.some(y => Math.abs(y - year) <= 2)) {
        // Return the closest actual election year
        return ELECTION_YEARS.reduce((prev, curr) =>
          Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
        );
      }
    }
    // Return first found year even if not election year
    return parseInt(matches[0], 10);
  }
  return 0;
}

/**
 * Check if text indicates this is a Swedish election poster
 */
function isSwedishElectionPoster(text: string): boolean {
  const lowerText = text.toLowerCase();

  // Must contain election-related terms
  const electionTerms = [
    'valaffisch', 'valrörelse', 'riksdagsval', 'election poster',
    'valkampanj', 'valmanifest', 'kampanjaffisch', 'val ',
    'rösta', 'vote', 'andrakammarval', 'folkomröstning',
    'election campaign', 'swedish election', 'swedish_election',
    'election_posters', 'political_posters', 'valplakat'
  ];

  const hasElectionTerm = electionTerms.some(term => lowerText.includes(term));

  // Or contains Swedish party names with poster/affisch context
  const partyTerms = [
    'socialdemokrat', 'moderat', 'höger', 'center', 'bonde',
    'liberal', 'folkparti', 'vänster', 'kommunist', 'miljöparti',
    'kristdemokrat', 'sverigedemokrat', 'pirat'
  ];

  const posterTerms = ['affisch', 'poster', 'plakat', 'kampanj'];

  const hasPartyWithPoster = partyTerms.some(party => lowerText.includes(party)) &&
                              posterTerms.some(poster => lowerText.includes(poster));

  // Sweden-related context
  const swedenTerms = ['sweden', 'swedish', 'sverige', 'svensk'];
  const hasSwedishContext = swedenTerms.some(term => lowerText.includes(term));

  // Exclude clearly non-Swedish content
  const excludeTerms = [
    'finland', 'finnish', 'denmark', 'danish', 'norway', 'norwegian',
    'germany', 'german', 'netherlands', 'dutch', 'belgium', 'sfp ',
    'finnish', 'suomi', 'ikl', 'pvda', 'cdu', 'spd'
  ];

  const isExcluded = excludeTerms.some(term => lowerText.includes(term));

  if (isExcluded) return false;

  return hasElectionTerm || hasPartyWithPoster || (hasSwedishContext && posterTerms.some(t => lowerText.includes(t)));
}

function generateCandidateId(candidate: PosterCandidate): string {
  // Generate a deterministic UUID v5-style from source_url
  // Using a namespace UUID and the source_url as the name
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // URL namespace UUID
  const name = candidate.source_url || candidate.image_url || candidate.title;

  // Create a hash and format as UUID
  const hash = crypto.createHash('sha1').update(namespace + name).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '5' + hash.substring(13, 16), // Version 5
    ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + hash.substring(18, 20),
    hash.substring(20, 32),
  ].join('-');
}

/**
 * Search Wikimedia Commons for election posters
 */
async function searchWikimediaCategory(category: string, partyHint?: string): Promise<PosterCandidate[]> {
  const candidates: PosterCandidate[] = [];
  let cmcontinue: string | undefined;

  console.log(`   📂 Söker kategori: ${category}`);

  try {
    do {
      const url = new URL(WIKIMEDIA_API);
      url.searchParams.set('action', 'query');
      url.searchParams.set('list', 'categorymembers');
      url.searchParams.set('cmtitle', `Category:${category}`);
      url.searchParams.set('cmlimit', '100');
      url.searchParams.set('cmtype', 'file');
      url.searchParams.set('format', 'json');
      if (cmcontinue) {
        url.searchParams.set('cmcontinue', cmcontinue);
      }

      const response = await fetchWithUserAgent(url);
      if (!response.ok) {
        console.log(`   ⚠️  HTTP ${response.status} från Wikimedia`);
        break;
      }

      const data = await response.json();
      cmcontinue = data.continue?.cmcontinue;

      if (data.query?.categorymembers) {
        // Batch fetch image info for all members
        const titles = data.query.categorymembers.map((m: any) => m.title).join('|');

        const infoUrl = new URL(WIKIMEDIA_API);
        infoUrl.searchParams.set('action', 'query');
        infoUrl.searchParams.set('titles', titles);
        infoUrl.searchParams.set('prop', 'imageinfo');
        infoUrl.searchParams.set('iiprop', 'url|extmetadata|size|mime');
        infoUrl.searchParams.set('iiurlwidth', '800');
        infoUrl.searchParams.set('format', 'json');

        const infoResponse = await fetchWithUserAgent(infoUrl);
        if (!infoResponse.ok) continue;

        const infoData = await infoResponse.json();
        const pages = infoData.query?.pages;

        if (pages) {
          for (const page of Object.values(pages) as any[]) {
            const imageinfo = page.imageinfo?.[0];
            if (!imageinfo) continue;

            // Skip non-image files
            if (!imageinfo.mime?.startsWith('image/')) continue;

            // Extract info
            const title = page.title?.replace('File:', '').replace(/\.(jpg|jpeg|png|gif|svg)$/i, '') || '';
            const description = imageinfo.extmetadata?.ImageDescription?.value || '';
            const categories = imageinfo.extmetadata?.Categories?.value || '';
            const combinedText = `${title} ${description} ${categories}`;

            // Filter: must be a Swedish election poster (unless in a trusted category)
            const trustedCategories = ['Election_posters_in_Sweden', 'Political_posters_of_Sweden'];
            const isTrustedCategory = trustedCategories.includes(category);
            if (!isTrustedCategory && !isSwedishElectionPoster(combinedText)) continue;

            const year = extractYearFromText(combinedText);
            const party = partyHint || detectPartyFromText(combinedText);

            // Generate thumbnail URL if not provided
            const fileName = page.title?.split(':')[1];
            const thumbUrl = imageinfo.thumburl ||
              (fileName ? `https://upload.wikimedia.org/wikipedia/commons/thumb/${imageinfo.url.split('/commons/')[1]}/400px-${fileName}` : null);

            candidates.push({
              party,
              year,
              title,
              image_url: imageinfo.url,
              thumbnail_url: thumbUrl || imageinfo.url,
              source: 'wikimedia',
              source_url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
              rights_status: determineRightsStatus(imageinfo.extmetadata),
              verified: false,
              wikimedia_pageid: page.pageid
            });
          }
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

    } while (cmcontinue);

  } catch (error) {
    console.error(`   ❌ Fel vid sökning i kategori ${category}:`, error);
  }

  console.log(`   ✅ Hittade ${candidates.length} riksdagsval-affischer`);
  return candidates;
}

/**
 * Search Wikimedia Commons using search API
 */
async function searchWikimediaSearch(query: string): Promise<PosterCandidate[]> {
  const candidates: PosterCandidate[] = [];

  console.log(`   🔍 Söker: "${query}"`);

  try {
    const url = new URL(WIKIMEDIA_API);
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'search');
    url.searchParams.set('srsearch', `${query} filetype:bitmap`);
    url.searchParams.set('srnamespace', '6'); // File namespace
    url.searchParams.set('srlimit', '50');
    url.searchParams.set('format', 'json');

    const response = await fetchWithUserAgent(url);
    if (!response.ok) {
      console.log(`   ⚠️  HTTP ${response.status}`);
      return candidates;
    }

    const data = await response.json();
    const searchResults = data.query?.search || [];

    if (searchResults.length === 0) {
      console.log(`   ℹ️  Inga resultat`);
      return candidates;
    }

    // Batch fetch image info
    const titles = searchResults.map((r: any) => r.title).join('|');

    const infoUrl = new URL(WIKIMEDIA_API);
    infoUrl.searchParams.set('action', 'query');
    infoUrl.searchParams.set('titles', titles);
    infoUrl.searchParams.set('prop', 'imageinfo');
    infoUrl.searchParams.set('iiprop', 'url|extmetadata|size|mime');
    infoUrl.searchParams.set('iiurlwidth', '800');
    infoUrl.searchParams.set('format', 'json');

    const infoResponse = await fetchWithUserAgent(infoUrl);
    if (!infoResponse.ok) return candidates;

    const infoData = await infoResponse.json();
    const pages = infoData.query?.pages;

    if (pages) {
      for (const page of Object.values(pages) as any[]) {
        const imageinfo = page.imageinfo?.[0];
        if (!imageinfo) continue;

        // Skip non-image files and TIFFs (often too large)
        if (!imageinfo.mime?.startsWith('image/')) continue;
        if (imageinfo.mime === 'image/tiff') continue;

        const title = page.title?.replace('File:', '').replace(/\.(jpg|jpeg|png|gif|svg)$/i, '') || '';
        const description = imageinfo.extmetadata?.ImageDescription?.value || '';
        const categories = imageinfo.extmetadata?.Categories?.value || '';
        const combinedText = `${title} ${description} ${categories}`;

        // Filter: must be a Swedish election poster
        if (!isSwedishElectionPoster(combinedText)) continue;

        const year = extractYearFromText(combinedText);
        const party = detectPartyFromText(combinedText);

        const fileName = page.title?.split(':')[1];
        const thumbUrl = imageinfo.thumburl ||
          (fileName && imageinfo.url ? `https://upload.wikimedia.org/wikipedia/commons/thumb/${imageinfo.url.split('/commons/')[1]}/400px-${fileName}` : null);

        candidates.push({
          party,
          year,
          title,
          image_url: imageinfo.url,
          thumbnail_url: thumbUrl || imageinfo.url,
          source: 'wikimedia',
          source_url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
          rights_status: determineRightsStatus(imageinfo.extmetadata),
          verified: false,
          wikimedia_pageid: page.pageid
        });
      }
    }
  } catch (error) {
    console.error(`   ❌ Sökfel:`, error);
  }

  console.log(`   ✅ Hittade ${candidates.length} riksdagsval-affischer`);
  return candidates;
}

/**
 * Search Swedish Wikipedia election page for images
 */
async function searchWikipediaElection(year: number): Promise<PosterCandidate[]> {
  const candidates: PosterCandidate[] = [];

  console.log(`   📅 Söker riksdagsval ${year}...`);

  try {
    const pageTitle = `Riksdagsvalet_i_Sverige_${year}`;
    const url = new URL(WIKIPEDIA_API);
    url.searchParams.set('action', 'parse');
    url.searchParams.set('page', pageTitle);
    url.searchParams.set('prop', 'images');
    url.searchParams.set('format', 'json');

    const response = await fetchWithUserAgent(url);
    if (!response.ok) {
      console.log(`   ⚠️  Sidan för ${year} hittades inte`);
      return candidates;
    }

    const data = await response.json();

    if (data.parse?.images) {
      // Filter for poster-related images
      const posterImages = data.parse.images.filter((image: string) => {
        const lower = image.toLowerCase();
        return lower.includes('affisch') || lower.includes('poster') ||
               lower.includes('valrörelse') || lower.includes('kampanj') ||
               lower.includes('valmanifest') || lower.includes('propaganda');
      });

      if (posterImages.length === 0) {
        console.log(`   ℹ️  Inga affischbilder på Wikipedia-sidan för ${year}`);
        return candidates;
      }

      // Batch fetch image info
      const titles = posterImages.map((img: string) => `File:${img}`).join('|');

      const infoUrl = new URL(WIKIMEDIA_API);
      infoUrl.searchParams.set('action', 'query');
      infoUrl.searchParams.set('titles', titles);
      infoUrl.searchParams.set('prop', 'imageinfo');
      infoUrl.searchParams.set('iiprop', 'url|extmetadata|size|mime');
      infoUrl.searchParams.set('iiurlwidth', '800');
      infoUrl.searchParams.set('format', 'json');

      const infoResponse = await fetchWithUserAgent(infoUrl);
      if (!infoResponse.ok) return candidates;

      const infoData = await infoResponse.json();
      const pages = infoData.query?.pages;

      if (pages) {
        for (const page of Object.values(pages) as any[]) {
          const imageinfo = page.imageinfo?.[0];
          if (!imageinfo) continue;
          if (!imageinfo.mime?.startsWith('image/')) continue;

          const title = page.title?.replace('File:', '').replace(/\.(jpg|jpeg|png|gif|svg)$/i, '') || '';
          const party = detectPartyFromText(title);

          candidates.push({
            party,
            year,
            title,
            image_url: imageinfo.url,
            thumbnail_url: imageinfo.thumburl || imageinfo.url,
            source: 'wikimedia',
            source_url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
            rights_status: determineRightsStatus(imageinfo.extmetadata),
            verified: false,
            wikimedia_pageid: page.pageid
          });
        }
      }
    }
  } catch (error) {
    console.error(`   ❌ Fel vid sökning för ${year}:`, error);
  }

  console.log(`   ✅ Hittade ${candidates.length} bilder för ${year}`);
  return candidates;
}

/**
 * Verify URL is accessible
 */
async function verifyUrl(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const response = await fetchWithUserAgent(url, { method: 'HEAD' });
    return { ok: response.ok || response.status === 302, status: response.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

/**
 * Import candidates to Supabase database
 */
async function importCandidatesToDb(candidates: PosterCandidate[]): Promise<{ imported: number; skipped: number; failed: number }> {
  const stats = { imported: 0, skipped: 0, failed: 0 };
  const sb = getSupabase();

  // Filter to verified candidates only
  const verifiedCandidates = candidates.filter(c => c.verified && c.year > 0);
  console.log(`\n📦 Importerar ${verifiedCandidates.length} verifierade kandidater till Supabase...`);

  for (const candidate of verifiedCandidates) {
    const id = generateCandidateId(candidate);

    // Check if already exists
    const { data: existing } = await sb
      .from('posters')
      .select('id')
      .eq('id', id)
      .single();

    if (existing) {
      stats.skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`   🧪 DRY-RUN: Skulle skapa ${id}`);
      stats.imported++;
      continue;
    }

    // Insert poster
    const { error: posterError } = await sb
      .from('posters')
      .insert({
        id,
        title: candidate.title,
        year: candidate.year,
        source: candidate.source,
        source_url: candidate.source_url,
        image_url: candidate.image_url,
        thumbnail_url: candidate.thumbnail_url,
        rights_status: candidate.rights_status || 'unknown',
        upload_status: 'pending',
      });

    if (posterError) {
      console.log(`   ❌ Fel vid import av ${id}: ${posterError.message}`);
      stats.failed++;
      continue;
    }

    // Insert curation data if party is known
    if (candidate.party && candidate.party !== 'unknown') {
      await sb
        .from('poster_curation')
        .upsert({
          poster_id: id,
          party: candidate.party,
          election_year: candidate.year,
        });
    }

    console.log(`   ✅ Importerade: ${id}`);
    stats.imported++;

    // Rate limit
    await new Promise(r => setTimeout(r, 50));
  }

  return stats;
}

/**
 * Determine rights status from Wikimedia metadata
 */
function determineRightsStatus(metadata: any): 'free' | 'fair_use' | 'restricted' | 'unknown' {
  if (!metadata) return 'unknown';

  const license = metadata.LicenseShortName?.value?.toLowerCase() || '';
  const dateCreated = metadata.DateTimeOriginal?.value || '';

  // Public domain
  if (license.includes('pd') || license.includes('public domain')) {
    return 'free';
  }

  // Creative Commons
  if (license.includes('cc') || license.includes('creative commons')) {
    return 'free';
  }

  // Check age (>70 years = PD in Sweden)
  const yearMatch = dateCreated.match(/(\d{4})/);
  if (yearMatch && parseInt(yearMatch[1]) < 1955) {
    return 'free';
  }

  // Fair use candidates
  if (license.includes('fair use') || license.includes('non-free')) {
    return 'fair_use';
  }

  return 'unknown';
}

/**
 * Load existing candidates
 */
function loadCandidates(filepath: string): PosterCandidate[] {
  if (fs.existsSync(filepath)) {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  }
  return [];
}

/**
 * Save candidates
 */
function saveCandidates(filepath: string, candidates: PosterCandidate[]): void {
  fs.writeFileSync(filepath, JSON.stringify(candidates, null, 2));
  console.log(`Saved ${candidates.length} candidates to ${filepath}`);
}

/**
 * Main collection function
 */
async function collectPosters(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   📚 Valaffischmuseet — Poster Collection');
  console.log('═══════════════════════════════════════════════════════════');
  if (dryRun) console.log('   Mode: DRY-RUN');
  if (scanAll) console.log('   Mode: SCAN-ALL');
  if (modernOnly) console.log('   Filter: Moderna val (1988-2022)');
  if (partyArg) console.log(`   Filter: Parti = ${partyArg}`);
  if (yearArg) console.log(`   Filter: År = ${yearArg}`);
  if (verifyMode) console.log('   Mode: VERIFY');
  if (importToDb) console.log('   Mode: IMPORT-TO-DB');
  console.log('');

  let candidates: PosterCandidate[] = loadCandidates(OUTPUT_PATH);
  console.log(`📁 Laddade ${candidates.length} befintliga kandidater\n`);

  // --- VERIFY MODE ---
  if (verifyMode) {
    console.log('🔍 Verifierar URL:er...\n');
    let verified = 0, failed = 0;
    const unverified = candidates.filter(c => !c.verified);

    for (let i = 0; i < unverified.length; i++) {
      const candidate = unverified[i];
      process.stdout.write(`   [${i + 1}/${unverified.length}] ${candidate.title.substring(0, 40)}... `);

      const result = await verifyUrl(candidate.image_url);
      if (result.ok) {
        candidate.verified = true;
        candidate.verification_notes = `URL verified ${new Date().toISOString()}`;
        console.log('✅');
        verified++;
      } else {
        candidate.verification_notes = `URL failed: ${result.status}`;
        console.log(`❌ (${result.status})`);
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    saveCandidates(OUTPUT_PATH, candidates);
    console.log(`\n✅ Verifierade: ${verified}`);
    console.log(`❌ Misslyckades: ${failed}`);
    return;
  }

  // --- IMPORT TO DB MODE ---
  if (importToDb) {
    const stats = await importCandidatesToDb(candidates);
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   📊 IMPORT SAMMANFATTNING');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   ✅ Importerade: ${stats.imported}`);
    console.log(`   ⏭️  Överhoppade: ${stats.skipped}`);
    console.log(`   ❌ Misslyckades: ${stats.failed}`);
    return;
  }

  // --- COLLECTION MODE ---
  const yearsToSearch = modernOnly ? MODERN_YEARS :
                        yearArg ? [yearArg] :
                        ELECTION_YEARS;

  // Search party-specific categories
  if (partyArg) {
    const partyConfig = PARTIES[partyArg];
    if (partyConfig?.wikimedia_category) {
      console.log(`\n🔎 Söker ${partyArg}...`);
      const newCandidates = await searchWikimediaCategory(partyConfig.wikimedia_category, partyArg);
      for (const c of newCandidates) {
        c.party = partyArg;
        if (!candidates.some(existing => existing.source_url === c.source_url)) {
          candidates.push(c);
        }
      }
    }
  } else if (scanAll) {
    // Search all party categories
    for (const [partyName, partyConfig] of Object.entries(PARTIES)) {
      console.log(`\n🔎 Söker ${partyName}...`);
      const newCandidates = await searchWikimediaCategory(partyConfig.wikimedia_category, partyName);
      for (const c of newCandidates) {
        c.party = partyName;
        if (!candidates.some(existing => existing.source_url === c.source_url)) {
          candidates.push(c);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Search additional general categories
    console.log('\n🔎 Söker generella kategorier...');
    for (const category of ADDITIONAL_CATEGORIES) {
      const newCandidates = await searchWikimediaCategory(category);
      for (const c of newCandidates) {
        if (!candidates.some(existing => existing.source_url === c.source_url)) {
          candidates.push(c);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Search using Wikimedia search API
    console.log('\n🔎 Söker med Wikimedia Search API...');
    for (const query of SEARCH_QUERIES) {
      const newCandidates = await searchWikimediaSearch(query);
      for (const c of newCandidates) {
        if (!candidates.some(existing => existing.source_url === c.source_url)) {
          candidates.push(c);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
    }
  }

  // Search Wikipedia election pages
  if (scanAll || yearArg) {
    console.log('\n🔎 Söker Wikipedia-valsidor...');
    for (const year of yearsToSearch) {
      const newCandidates = await searchWikipediaElection(year);
      for (const c of newCandidates) {
        if (!candidates.some(existing => existing.source_url === c.source_url)) {
          candidates.push(c);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Save results
  saveCandidates(OUTPUT_PATH, candidates);

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   📊 SAMMANFATTNING');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Totalt kandidater: ${candidates.length}`);
  console.log(`   Verifierade: ${candidates.filter(c => c.verified).length}`);

  // By party
  console.log('\n   Per parti:');
  const byParty = candidates.reduce((acc, c) => {
    const party = c.party || 'unknown';
    acc[party] = (acc[party] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [party, count] of Object.entries(byParty).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${party}: ${count}`);
  }

  // By year range
  console.log('\n   Per årtionde:');
  const byDecade = candidates.reduce((acc, c) => {
    if (!c.year) {
      acc['Okänt'] = (acc['Okänt'] || 0) + 1;
    } else {
      const decade = Math.floor(c.year / 10) * 10;
      acc[`${decade}-talet`] = (acc[`${decade}-talet`] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  for (const [decade, count] of Object.entries(byDecade).sort()) {
    console.log(`     ${decade}: ${count}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   💡 Nästa steg:');
  console.log('      npx tsx scripts/collect-posters.ts --verify');
  console.log('      npx tsx scripts/collect-posters.ts --import-to-db');
  console.log('═══════════════════════════════════════════════════════════');
}

// --- Run ---
collectPosters().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
