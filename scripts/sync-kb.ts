#!/usr/bin/env npx ts-node

/**
 * Sync script for importing KB posters to Supabase
 *
 * Usage:
 *   npx ts-node scripts/sync-kb.ts
 *
 * Or with environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npx ts-node scripts/sync-kb.ts
 */

import { createClient } from '@supabase/supabase-js';

const KB_SEARCH_API = 'https://data.kb.se/search';
const POLITIK_COLLECTION_ID = 'https://libris.kb.se/9slpxtq171tppxn0#it';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('  SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Party detection patterns
const PARTY_PATTERNS: Record<string, RegExp[]> = {
  'socialdemokraterna': [
    /socialdemokrat/i,
    /\bsap\b/i,
    /arbetarepartiet/i,
    /\bs\.?\s*d\.?\s*a\.?\s*p/i,
  ],
  'hogerpartiet': [
    /högerpartiet/i,
    /\bhögern\b/i,
    /allmänna valmansförbundet/i,
    /\bavf\b/i,
  ],
  'bondeforbundet': [
    /bondeförbundet/i,
    /\bbonde/i,
    /lantmanna/i,
  ],
  'liberalerna': [
    /folkpartiet/i,
    /\bfrisinnade/i,
    /liberal/i,
  ],
  'vansterpartiet': [
    /kommunist/i,
    /\bskp\b/i,
    /vänsterpartiet/i,
    /\bvpk\b/i,
  ],
};

function detectParty(title: string): string | null {
  const text = title.toLowerCase();
  for (const [party, patterns] of Object.entries(PARTY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return party;
      }
    }
  }
  return null;
}

function extractDarkId(url: string): string {
  const match = url.match(/dark-\d+/);
  return match ? match[0] : url;
}

interface KBPoster {
  '@id': string;
  title: string;
  datePublished?: string;
  thumbnail?: string;
  imageServiceId?: string;
  accessAllowed: boolean;
  identifiedBy?: Array<{ value: string; typeNote?: string }>;
  isPartOf?: { meta?: { controlNumber: string } };
  contribution?: Array<{ agent?: Array<{ displayName?: string; name?: string }> }>;
  usageAndAccessPolicy?: Array<{ value: string }>;
}

async function fetchKBPosters(): Promise<KBPoster[]> {
  const params = new URLSearchParams({
    q: '*',
    genreForm: 'Affischer',
    'isPartOf.@id': POLITIK_COLLECTION_ID,
    limit: '200',
    _sort: 'datePublished',
  });

  const response = await fetch(`${KB_SEARCH_API}?${params}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`KB API error: ${response.status}`);
  }

  const data = await response.json();
  return data.hits || [];
}

async function main() {
  console.log('🔄 Starting KB → Supabase sync...\n');

  // Fetch from KB
  console.log('📥 Fetching posters from KB API...');
  const kbPosters = await fetchKBPosters();
  console.log(`   Found ${kbPosters.length} posters\n`);

  let created = 0;
  let updated = 0;
  let failed = 0;
  const partyStats: Record<string, number> = {};

  for (const kbPoster of kbPosters) {
    const darkId = extractDarkId(kbPoster['@id']);
    const title = kbPoster.title || darkId;
    const year = kbPoster.datePublished
      ? parseInt(kbPoster.datePublished.split('-')[0], 10)
      : null;
    const creator = kbPoster.contribution?.[0]?.agent?.[0]?.displayName ||
      kbPoster.contribution?.[0]?.agent?.[0]?.name;
    const rightsStatus = kbPoster.usageAndAccessPolicy?.some(p => p.value === 'Free')
      ? 'free'
      : 'restricted';
    const reginaId = kbPoster.identifiedBy?.find(id => id.typeNote === 'Regina-ID')?.value;
    const librisId = kbPoster.isPartOf?.meta?.controlNumber;

    // Detect party
    const party = detectParty(title);
    if (party) {
      partyStats[party] = (partyStats[party] || 0) + 1;
    }

    try {
      // Check if exists
      const { data: existing } = await supabase
        .from('posters')
        .select('id')
        .eq('kb_digitalt_id', darkId)
        .single();

      let posterId: string;

      if (existing) {
        // Update
        const { error } = await supabase
          .from('posters')
          .update({
            title,
            creator,
            year,
            iiif_image_base_url: kbPoster.imageServiceId || '',
            rights_status: rightsStatus,
            synced_at: new Date().toISOString(),
          })
          .eq('kb_digitalt_id', darkId);

        if (error) throw error;
        posterId = existing.id;
        updated++;
        process.stdout.write('.');
      } else {
        // Insert
        const { data: newPoster, error } = await supabase
          .from('posters')
          .insert({
            kb_digitalt_id: darkId,
            regina_id: reginaId,
            libris_id: librisId,
            title,
            creator,
            year,
            iiif_manifest_url: `https://data.kb.se/${darkId}/manifest`,
            iiif_image_base_url: kbPoster.imageServiceId || '',
            rights_status: rightsStatus,
            kb_digitalt_url: `https://digitalt.kb.se/${darkId}`,
            raw_metadata: kbPoster as unknown as Record<string, unknown>,
          })
          .select()
          .single();

        if (error || !newPoster) throw error;
        posterId = newPoster.id;
        created++;
        process.stdout.write('+');
      }

      // Upsert curation with party
      if (party) {
        const { data: existingCuration } = await supabase
          .from('poster_curation')
          .select('id, attributed_party')
          .eq('poster_id', posterId)
          .single();

        if (!existingCuration) {
          await supabase.from('poster_curation').insert({
            poster_id: posterId,
            attributed_party: party,
            election_year: year,
            curation_status: 'draft',
          });
        } else if (!existingCuration.attributed_party) {
          await supabase
            .from('poster_curation')
            .update({ attributed_party: party, election_year: year })
            .eq('poster_id', posterId);
        }
      }

    } catch (err) {
      failed++;
      process.stdout.write('✗');
      console.error(`\nError processing ${darkId}:`, err);
    }
  }

  console.log('\n');
  console.log('✅ Sync complete!\n');
  console.log('📊 Summary:');
  console.log(`   Total processed: ${kbPosters.length}`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Failed: ${failed}`);
  console.log('\n🏛️ Party detection:');
  for (const [party, count] of Object.entries(partyStats).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${party}: ${count}`);
  }
  console.log(`   (undetected): ${kbPosters.length - Object.values(partyStats).reduce((a, b) => a + b, 0)}`);
}

main().catch(console.error);
