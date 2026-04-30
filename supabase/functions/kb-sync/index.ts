// Supabase Edge Function: KB Sync
// Synchronizes poster data from KB's API to Supabase
//
// Usage:
// - POST /kb-sync - Full sync of all posters
// - POST /kb-sync?mode=incremental - Sync only recent changes
// - POST /kb-sync?id=dark-12345 - Sync single poster by ID
//
// Deploy with:
// supabase functions deploy kb-sync

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const KB_SEARCH_API = 'https://data.kb.se/search';
const POLITIK_COLLECTION_ID = 'https://libris.kb.se/9slpxtq171tppxn0#it';

interface KBPoster {
  '@id': string;
  '@type': string;
  title: string;
  datePublished?: string;
  thumbnail?: string;
  imageServiceId?: string;
  accessAllowed: boolean;
  identifiedBy?: Array<{
    '@type': string;
    value: string;
    typeNote?: string | null;
  }>;
  isPartOf?: {
    '@id': string;
    '@type': string;
    title: string;
    meta?: { controlNumber: string };
  };
  contribution?: Array<{
    '@type': string;
    agent?: Array<{
      displayName?: string;
      name?: string;
    }>;
  }>;
  usageAndAccessPolicy?: Array<{
    '@id': string;
    value: string;
  }>;
}

interface SyncResult {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

// Extract dark-ID from KB URL
function extractDarkId(url: string): string | null {
  const match = url.match(/dark-\d+/);
  return match ? match[0] : null;
}

// Transform KB poster to our schema
function transformPoster(kbPoster: KBPoster) {
  const darkId = extractDarkId(kbPoster['@id']) || kbPoster['@id'];

  // Extract Regina ID
  const reginaId = kbPoster.identifiedBy?.find(
    (id) => id.typeNote === 'Regina-ID'
  )?.value;

  // Extract Libris ID
  const librisId = kbPoster.isPartOf?.meta?.controlNumber;

  // Extract year from datePublished
  const year = kbPoster.datePublished
    ? parseInt(kbPoster.datePublished.split('-')[0], 10)
    : null;

  // Extract creator
  const creator = kbPoster.contribution?.[0]?.agent?.[0]?.displayName ||
    kbPoster.contribution?.[0]?.agent?.[0]?.name || null;

  // Determine rights status
  const rightsStatus = kbPoster.usageAndAccessPolicy?.some(
    (policy) => policy.value === 'Free'
  )
    ? 'free'
    : 'restricted';

  return {
    kb_digitalt_id: darkId,
    regina_id: reginaId || null,
    libris_id: librisId || null,
    title: kbPoster.title,
    creator,
    year,
    iiif_manifest_url: `https://data.kb.se/${darkId}/manifest.json`,
    iiif_image_base_url: kbPoster.imageServiceId || `https://data.kb.se/${darkId}/rep01`,
    rights_status: rightsStatus,
    kb_digitalt_url: `https://www.kb.se/hitta-och-bestall/digitalt-bibliotek/${darkId}.html`,
    raw_metadata: kbPoster,
    synced_at: new Date().toISOString(),
  };
}

// Fetch posters from KB API
async function fetchFromKB(options: {
  limit?: number;
  offset?: number;
  sort?: string;
}): Promise<{ hits: KBPoster[]; total: number }> {
  const { limit = 50, offset = 0, sort = '-datePublished' } = options;

  const params = new URLSearchParams({
    q: '*',
    genreForm: 'Affischer',
    'isPartOf.@id': POLITIK_COLLECTION_ID,
    limit: String(limit),
    offset: String(offset),
    _sort: sort,
  });

  const response = await fetch(`${KB_SEARCH_API}?${params}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`KB API error: ${response.status}`);
  }

  const data = await response.json();
  return { hits: data.hits, total: data.total };
}

// Fetch single poster by dark-ID
async function fetchSinglePoster(darkId: string): Promise<KBPoster | null> {
  try {
    const response = await fetch(`https://data.kb.se/${darkId}.jsonld`, {
      headers: { Accept: 'application/ld+json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// Main sync function
async function syncPosters(
  supabase: ReturnType<typeof createClient>,
  mode: 'full' | 'incremental' | 'single',
  singleId?: string
): Promise<SyncResult> {
  const result: SyncResult = {
    processed: 0,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // Create sync log entry
  const { data: syncLog, error: logError } = await supabase
    .from('sync_log')
    .insert({
      sync_type: mode,
      status: 'running',
    })
    .select()
    .single();

  if (logError) {
    console.error('Failed to create sync log:', logError);
  }

  try {
    if (mode === 'single' && singleId) {
      // Sync single poster
      const poster = await fetchSinglePoster(singleId);
      if (poster) {
        const transformed = transformPoster(poster);
        const { error } = await supabase
          .from('posters')
          .upsert(transformed, { onConflict: 'kb_digitalt_id' });

        if (error) {
          result.failed++;
          result.errors.push(`${singleId}: ${error.message}`);
        } else {
          result.processed++;
          result.created++;
        }
      }
    } else {
      // Batch sync
      const batchSize = 50;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const { hits, total } = await fetchFromKB({
          limit: batchSize,
          offset,
          sort: mode === 'incremental' ? '-_modified' : '-datePublished',
        });

        for (const poster of hits) {
          try {
            const transformed = transformPoster(poster);
            const { error } = await supabase
              .from('posters')
              .upsert(transformed, { onConflict: 'kb_digitalt_id' });

            if (error) {
              result.failed++;
              result.errors.push(`${transformed.kb_digitalt_id}: ${error.message}`);
            } else {
              result.processed++;
              // Check if insert or update
              const { data: existing } = await supabase
                .from('posters')
                .select('id')
                .eq('kb_digitalt_id', transformed.kb_digitalt_id)
                .single();

              if (existing) {
                result.updated++;
              } else {
                result.created++;
              }
            }
          } catch (err) {
            result.failed++;
            result.errors.push(`Processing error: ${err}`);
          }
        }

        offset += batchSize;
        hasMore = offset < total;

        // For incremental, only sync first batch
        if (mode === 'incremental') {
          hasMore = false;
        }
      }
    }

    // Update sync log
    if (syncLog) {
      await supabase
        .from('sync_log')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          items_processed: result.processed,
          items_created: result.created,
          items_updated: result.updated,
          items_failed: result.failed,
          error_message: result.errors.length > 0 ? result.errors.join('; ') : null,
        })
        .eq('id', syncLog.id);
    }
  } catch (err) {
    // Log failure
    if (syncLog) {
      await supabase
        .from('sync_log')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: String(err),
        })
        .eq('id', syncLog.id);
    }
    throw err;
  }

  return result;
}

// Edge function handler
Deno.serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify authorization
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Parse parameters
  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') || 'full';
  const singleId = url.searchParams.get('id');

  let syncMode: 'full' | 'incremental' | 'single';
  if (singleId) {
    syncMode = 'single';
  } else if (mode === 'incremental') {
    syncMode = 'incremental';
  } else {
    syncMode = 'full';
  }

  try {
    console.log(`Starting ${syncMode} sync...`);
    const result = await syncPosters(supabase, syncMode, singleId || undefined);

    return new Response(JSON.stringify({
      success: true,
      mode: syncMode,
      ...result,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Sync failed:', err);
    return new Response(JSON.stringify({
      success: false,
      error: String(err),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
