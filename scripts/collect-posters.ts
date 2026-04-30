#!/usr/bin/env npx ts-node
/**
 * Valaffischmuseet — Poster Collection Script
 *
 * Systematically searches for Swedish election posters from multiple sources:
 * 1. Wikimedia Commons category API
 * 2. Swedish Wikipedia election pages
 * 3. Stockholmskällan
 * 4. Affischerna.se
 * 5. DigitaltMuseum
 *
 * Usage:
 *   npx ts-node scripts/collect-posters.ts --party "Socialdemokraterna" --year 1932
 *   npx ts-node scripts/collect-posters.ts --scan-all
 *   npx ts-node scripts/collect-posters.ts --verify data/poster-candidates.json
 */

import * as fs from 'fs';
import * as path from 'path';

// Types
interface PosterCandidate {
  party: string;
  year: number;
  title: string;
  slogan?: string;
  image_url: string;
  thumbnail_url?: string;
  source: 'wikimedia' | 'affischerna' | 'stockholmskallan' | 'dimu' | 'media_archive';
  source_url: string;
  rights_status: 'free' | 'fair_use' | 'restricted' | 'unknown';
  verified: boolean;
  verification_notes?: string;
}

// Election years (riksdagsval)
const ELECTION_YEARS = [
  1908, 1911, 1914, 1917, 1920, 1921, 1924, 1928, 1932, 1936, 1940,
  1944, 1948, 1952, 1956, 1958, 1960, 1964, 1968, 1970, 1973, 1976,
  1979, 1982, 1985, 1988, 1991, 1994, 1998, 2002, 2006, 2010, 2014,
  2018, 2022
];

// Parties to track
const PARTIES = {
  'Socialdemokraterna': {
    aliases: ['SAP', 'Socialdemokratiska arbetarepartiet', 'Sveriges socialdemokratiska arbetareparti'],
    wikimedia_category: 'Election_posters_of_the_Social_Democratic_Party_(Sweden)',
    founded: 1889
  },
  'Moderaterna': {
    aliases: ['Högerpartiet', 'Allmänna valmansförbundet', 'AVF', 'Högern'],
    wikimedia_category: 'Election_posters_of_the_Moderate_Party_(Sweden)',
    founded: 1904
  },
  'Centerpartiet': {
    aliases: ['Bondeförbundet', 'Centern'],
    wikimedia_category: 'Election_posters_of_the_Centre_Party_(Sweden)',
    founded: 1913
  },
  'Liberalerna': {
    aliases: ['Folkpartiet', 'FP', 'Frisinnade'],
    wikimedia_category: 'Election_posters_of_the_Liberal_Party_(Sweden)',
    founded: 1902
  },
  'Vänsterpartiet': {
    aliases: ['VPK', 'SKP', 'Kommunistpartiet', 'Vänsterpartiet Kommunisterna'],
    wikimedia_category: 'Election_posters_of_the_Left_Party_(Sweden)',
    founded: 1917
  },
  'Miljöpartiet': {
    aliases: ['MP', 'Miljöpartiet de gröna'],
    wikimedia_category: 'Election_posters_of_the_Green_Party_(Sweden)',
    founded: 1981
  },
  'Kristdemokraterna': {
    aliases: ['KD', 'KDS', 'Kristen demokratisk samling'],
    wikimedia_category: 'Election_posters_of_the_Christian_Democrats_(Sweden)',
    founded: 1964
  },
  'Sverigedemokraterna': {
    aliases: ['SD'],
    wikimedia_category: 'Election_posters_of_the_Sweden_Democrats',
    founded: 1988
  }
};

// API endpoints
const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php';
const WIKIPEDIA_API = 'https://sv.wikipedia.org/w/api.php';

/**
 * Search Wikimedia Commons for election posters
 */
async function searchWikimediaCategory(category: string): Promise<PosterCandidate[]> {
  const candidates: PosterCandidate[] = [];

  try {
    const url = new URL(WIKIMEDIA_API);
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'categorymembers');
    url.searchParams.set('cmtitle', `Category:${category}`);
    url.searchParams.set('cmlimit', '100');
    url.searchParams.set('cmtype', 'file');
    url.searchParams.set('format', 'json');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.query?.categorymembers) {
      for (const member of data.query.categorymembers) {
        // Get file info
        const infoUrl = new URL(WIKIMEDIA_API);
        infoUrl.searchParams.set('action', 'query');
        infoUrl.searchParams.set('titles', member.title);
        infoUrl.searchParams.set('prop', 'imageinfo');
        infoUrl.searchParams.set('iiprop', 'url|extmetadata');
        infoUrl.searchParams.set('format', 'json');

        const infoResponse = await fetch(infoUrl.toString());
        const infoData = await infoResponse.json();

        const pages = infoData.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0] as any;
          const imageinfo = page.imageinfo?.[0];

          if (imageinfo) {
            // Extract year from filename or description
            const yearMatch = member.title.match(/(\d{4})/);
            const year = yearMatch ? parseInt(yearMatch[1]) : 0;

            candidates.push({
              party: 'unknown', // Will be determined by category
              year,
              title: member.title.replace('File:', '').replace(/\.(jpg|jpeg|png|gif)$/i, ''),
              image_url: imageinfo.url,
              thumbnail_url: imageinfo.thumburl || imageinfo.url.replace('/commons/', '/commons/thumb/') + '/400px-' + member.title.split(':')[1],
              source: 'wikimedia',
              source_url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(member.title)}`,
              rights_status: determineRightsStatus(imageinfo.extmetadata),
              verified: false
            });
          }
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error(`Error searching Wikimedia category ${category}:`, error);
  }

  return candidates;
}

/**
 * Search Swedish Wikipedia election page for images
 */
async function searchWikipediaElection(year: number): Promise<PosterCandidate[]> {
  const candidates: PosterCandidate[] = [];

  try {
    const pageTitle = `Riksdagsvalet_i_Sverige_${year}`;
    const url = new URL(WIKIPEDIA_API);
    url.searchParams.set('action', 'parse');
    url.searchParams.set('page', pageTitle);
    url.searchParams.set('prop', 'images');
    url.searchParams.set('format', 'json');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.parse?.images) {
      for (const image of data.parse.images) {
        // Filter for poster-related images
        const lowerImage = image.toLowerCase();
        if (lowerImage.includes('affisch') || lowerImage.includes('poster') ||
            lowerImage.includes('valrörelse') || lowerImage.includes('kampanj')) {

          // Get image info from Commons
          const infoUrl = new URL(WIKIMEDIA_API);
          infoUrl.searchParams.set('action', 'query');
          infoUrl.searchParams.set('titles', `File:${image}`);
          infoUrl.searchParams.set('prop', 'imageinfo');
          infoUrl.searchParams.set('iiprop', 'url');
          infoUrl.searchParams.set('format', 'json');

          const infoResponse = await fetch(infoUrl.toString());
          const infoData = await infoResponse.json();

          const pages = infoData.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0] as any;
            const imageinfo = page.imageinfo?.[0];

            if (imageinfo) {
              candidates.push({
                party: 'unknown',
                year,
                title: image.replace(/\.(jpg|jpeg|png|gif)$/i, ''),
                image_url: imageinfo.url,
                source: 'wikimedia',
                source_url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(image)}`,
                rights_status: 'unknown',
                verified: false
              });
            }
          }
        }

        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  } catch (error) {
    console.error(`Error searching Wikipedia for ${year}:`, error);
  }

  return candidates;
}

/**
 * Verify URL is accessible
 */
async function verifyUrl(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { ok: response.ok || response.status === 302, status: response.status };
  } catch {
    return { ok: false, status: 0 };
  }
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
async function collectPosters(options: {
  party?: string;
  year?: number;
  scanAll?: boolean;
  verify?: string;
}): Promise<void> {
  const outputPath = path.join(__dirname, '..', 'data', 'poster-candidates.json');
  let candidates: PosterCandidate[] = loadCandidates(outputPath);

  if (options.verify) {
    // Verify existing candidates
    console.log('Verifying candidates...');
    for (const candidate of candidates) {
      if (!candidate.verified) {
        const result = await verifyUrl(candidate.image_url);
        if (result.ok) {
          candidate.verified = true;
          candidate.verification_notes = `URL verified ${new Date().toISOString()}`;
          console.log(`✓ ${candidate.title}`);
        } else {
          candidate.verification_notes = `URL failed: ${result.status}`;
          console.log(`✗ ${candidate.title} (${result.status})`);
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    saveCandidates(outputPath, candidates);
    return;
  }

  if (options.party) {
    // Search specific party
    const partyConfig = PARTIES[options.party as keyof typeof PARTIES];
    if (partyConfig?.wikimedia_category) {
      console.log(`Searching Wikimedia for ${options.party}...`);
      const newCandidates = await searchWikimediaCategory(partyConfig.wikimedia_category);
      for (const c of newCandidates) {
        c.party = options.party;
        if (!candidates.some(existing => existing.source_url === c.source_url)) {
          candidates.push(c);
        }
      }
    }
  }

  if (options.year) {
    // Search specific election year
    console.log(`Searching Wikipedia for ${options.year} election...`);
    const newCandidates = await searchWikipediaElection(options.year);
    for (const c of newCandidates) {
      if (!candidates.some(existing => existing.source_url === c.source_url)) {
        candidates.push(c);
      }
    }
  }

  if (options.scanAll) {
    // Full scan
    console.log('Starting full scan of all parties and years...');

    for (const [partyName, partyConfig] of Object.entries(PARTIES)) {
      if (partyConfig.wikimedia_category) {
        console.log(`\nSearching ${partyName}...`);
        const newCandidates = await searchWikimediaCategory(partyConfig.wikimedia_category);
        for (const c of newCandidates) {
          c.party = partyName;
          if (!candidates.some(existing => existing.source_url === c.source_url)) {
            candidates.push(c);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    for (const year of ELECTION_YEARS) {
      console.log(`\nSearching election ${year}...`);
      const newCandidates = await searchWikipediaElection(year);
      for (const c of newCandidates) {
        if (!candidates.some(existing => existing.source_url === c.source_url)) {
          candidates.push(c);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  saveCandidates(outputPath, candidates);

  // Print summary
  console.log('\n=== Collection Summary ===');
  console.log(`Total candidates: ${candidates.length}`);
  console.log(`Verified: ${candidates.filter(c => c.verified).length}`);
  console.log(`By source:`);
  const bySources = candidates.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [source, count] of Object.entries(bySources)) {
    console.log(`  ${source}: ${count}`);
  }
}

// CLI handling
const args = process.argv.slice(2);
const options: {
  party?: string;
  year?: number;
  scanAll?: boolean;
  verify?: string;
} = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--party' && args[i + 1]) {
    options.party = args[i + 1];
    i++;
  } else if (args[i] === '--year' && args[i + 1]) {
    options.year = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--scan-all') {
    options.scanAll = true;
  } else if (args[i] === '--verify' && args[i + 1]) {
    options.verify = args[i + 1];
  }
}

collectPosters(options).catch(console.error);
