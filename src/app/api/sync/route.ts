import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { searchPoliticalPosters, transformKBPoster } from '@/lib/kb-api';

// Create Supabase client for the sync route (internal API, permissive typing)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSupabaseClient(): SupabaseClient<any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase not configured');
  }

  return createClient(url, key);
}

// Party detection patterns based on historical party names and common terms
const PARTY_PATTERNS: Record<string, RegExp[]> = {
  'S': [
    /socialdemokrat/i,
    /\bsap\b/i,
    /arbetarepartiet/i,
    /\bs\.?\s*d\.?\s*a\.?\s*p/i,
  ],
  'H': [
    /högerpartiet/i,
    /\bhögern\b/i,
    /allmänna valmansförbundet/i,
    /avf\b/i,
  ],
  'M': [
    /moderaterna/i,
    /\bmoderater/i,
  ],
  'BF': [
    /bondeförbundet/i,
    /\bbonde/i,
    /lantmanna/i,
    /jordbruk/i,
  ],
  'C': [
    /centerpartiet/i,
    /\bcentern\b/i,
  ],
  'FP': [
    /folkpartiet/i,
    /\bfrisinnade/i,
    /liberal/i,
  ],
  'L': [
    /liberalerna/i,
  ],
  'K': [
    /kommunist/i,
    /\bskp\b/i,
    /vänsterpartiet kommunisterna/i,
    /\bvpk\b/i,
  ],
  'V': [
    /vänsterpartiet(?!\s+kommunist)/i,
  ],
};

// Detect party from title and other metadata
function detectParty(title: string, _creator?: string): string | null {
  const textToSearch = title.toLowerCase();

  for (const [party, patterns] of Object.entries(PARTY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(textToSearch)) {
        return party;
      }
    }
  }

  return null;
}

// Map abbreviated party to slug
function partyToSlug(party: string): string {
  const mapping: Record<string, string> = {
    'S': 'socialdemokraterna',
    'H': 'hogerpartiet',
    'M': 'moderaterna',
    'BF': 'bondeforbundet',
    'C': 'centerpartiet',
    'FP': 'liberalerna',
    'L': 'liberalerna',
    'K': 'vansterpartiet',
    'V': 'vansterpartiet',
  };
  return mapping[party] || party.toLowerCase();
}

export async function POST(request: Request) {
  // Check for auth (simple key-based for now)
  const authHeader = request.headers.get('Authorization');
  const expectedKey = process.env.SYNC_API_KEY || 'dev-sync-key';

  if (authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch {
    return NextResponse.json(
      { error: 'Supabase is not configured' },
      { status: 500 }
    );
  }

  try {
    // Start sync log
    const { data: syncLog, error: syncLogError } = await supabase
      .from('sync_log')
      .insert({
        sync_type: 'full',
        status: 'running',
      })
      .select()
      .single();

    if (syncLogError) {
      console.error('Failed to create sync log:', syncLogError);
    }

    const syncId = syncLog?.id;

    // Fetch all political posters from KB
    console.log('Fetching posters from KB API...');
    const response = await searchPoliticalPosters({ limit: 200 });
    const kbPosters = response.hits;
    console.log(`Found ${kbPosters.length} posters`);

    let created = 0;
    let updated = 0;
    let failed = 0;
    const results: Array<{ id: string; title: string; party: string | null; status: string }> = [];

    for (const kbPoster of kbPosters) {
      try {
        const poster = transformKBPoster(kbPoster);

        // Skip posters without required data
        if (!poster.id || !poster.title || !poster.iiifImageBaseUrl) {
          console.log(`Skipping poster without required data: ${poster.id}`);
          failed++;
          continue;
        }

        // Detect party from title
        const detectedParty = detectParty(poster.title, poster.creator);

        // Upsert into posters table
        const { data: existingPoster } = await supabase
          .from('posters')
          .select('id')
          .eq('kb_digitalt_id', poster.id)
          .single();

        let posterId: string;

        if (existingPoster) {
          // Update existing
          const { error: updateError } = await supabase
            .from('posters')
            .update({
              title: poster.title,
              creator: poster.creator,
              year: poster.year,
              iiif_image_base_url: poster.iiifImageBaseUrl,
              rights_status: poster.rightsStatus === 'unknown' ? 'restricted' : poster.rightsStatus,
              kb_digitalt_url: poster.kbDigitaltUrl || `https://digitalt.kb.se/${poster.id}`,
              synced_at: new Date().toISOString(),
            })
            .eq('kb_digitalt_id', poster.id);

          if (updateError) {
            console.error(`Failed to update poster ${poster.id}:`, updateError);
            failed++;
            continue;
          }

          posterId = existingPoster.id;
          updated++;
        } else {
          // Insert new
          const { data: newPoster, error: insertError } = await supabase
            .from('posters')
            .insert({
              kb_digitalt_id: poster.id,
              regina_id: poster.reginaId,
              libris_id: poster.librisId,
              title: poster.title,
              creator: poster.creator,
              year: poster.year,
              iiif_manifest_url: `https://data.kb.se/${poster.id}/manifest`,
              iiif_image_base_url: poster.iiifImageBaseUrl,
              rights_status: poster.rightsStatus === 'unknown' ? 'restricted' : poster.rightsStatus,
              kb_digitalt_url: poster.kbDigitaltUrl || `https://digitalt.kb.se/${poster.id}`,
              raw_metadata: kbPoster as unknown as Record<string, unknown>,
            })
            .select()
            .single();

          if (insertError || !newPoster) {
            console.error(`Failed to insert poster ${poster.id}:`, insertError);
            failed++;
            continue;
          }

          posterId = newPoster.id;
          created++;
        }

        // Upsert curation data with detected party
        if (detectedParty) {
          const { data: existingCuration } = await supabase
            .from('poster_curation')
            .select('id')
            .eq('poster_id', posterId)
            .single();

          if (existingCuration) {
            // Only update if no party was set
            await supabase
              .from('poster_curation')
              .update({
                attributed_party: partyToSlug(detectedParty),
                election_year: poster.year,
                updated_at: new Date().toISOString(),
              })
              .eq('poster_id', posterId)
              .is('attributed_party', null);
          } else {
            await supabase
              .from('poster_curation')
              .insert({
                poster_id: posterId,
                attributed_party: partyToSlug(detectedParty),
                party: detectedParty,
                election_year: poster.year,
                curation_status: 'draft',
              });
          }
        }

        results.push({
          id: poster.id,
          title: poster.title,
          party: detectedParty,
          status: existingPoster ? 'updated' : 'created',
        });

      } catch (err) {
        console.error(`Error processing poster:`, err);
        failed++;
      }
    }

    // Update sync log
    if (syncId) {
      await supabase
        .from('sync_log')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          items_processed: kbPosters.length,
          items_created: created,
          items_updated: updated,
          items_failed: failed,
        })
        .eq('id', syncId);
    }

    // Count posters by party
    const partyStats: Record<string, number> = {};
    for (const r of results) {
      if (r.party) {
        partyStats[r.party] = (partyStats[r.party] || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: kbPosters.length,
        created,
        updated,
        failed,
        withParty: results.filter(r => r.party).length,
        withoutParty: results.filter(r => !r.party).length,
      },
      partyStats,
      results: results.slice(0, 20), // Return first 20 for preview
    });

  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET() {
  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch {
    return NextResponse.json({ configured: false });
  }

  // Get latest sync and counts
  const [syncResult, postersResult, curationsResult] = await Promise.all([
    supabase
      .from('sync_log')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('posters')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('poster_curation')
      .select('attributed_party')
      .not('attributed_party', 'is', null),
  ]);

  // Count by party
  const partyCounts: Record<string, number> = {};
  if (curationsResult.data) {
    for (const c of curationsResult.data) {
      if (c.attributed_party) {
        partyCounts[c.attributed_party] = (partyCounts[c.attributed_party] || 0) + 1;
      }
    }
  }

  return NextResponse.json({
    configured: true,
    lastSync: syncResult.data,
    posterCount: postersResult.count || 0,
    taggedCount: curationsResult.data?.length || 0,
    partyCounts,
  });
}
