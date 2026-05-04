#!/usr/bin/env npx tsx

/**
 * AI-powered poster analysis using Claude Vision
 *
 * Analyzes Swedish election posters to detect:
 * - Political party (from text, symbols, colors)
 * - Transcribed text / slogan
 * - Themes and rhetorical devices
 * - Visual motifs
 * - Tone
 *
 * Usage:
 *   npx tsx scripts/analyze-posters.ts
 *   npx tsx scripts/analyze-posters.ts --limit 10
 *   npx tsx scripts/analyze-posters.ts --modern           # 1988-2022 endast
 *   npx tsx scripts/analyze-posters.ts --year 2022
 *   npx tsx scripts/analyze-posters.ts --force            # omanalysera
 *   npx tsx scripts/analyze-posters.ts --party SD
 *   npx tsx scripts/analyze-posters.ts --uploaded-only    # endast uppladdade
 *
 * Miljövariabler:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// --- CLI Args ---
const args = process.argv.slice(2);
const limitArg = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : 1000;
const force = args.includes('--force');
const modernOnly = args.includes('--modern');
const uploadedOnly = args.includes('--uploaded-only');
const yearFilter = args.includes('--year') ? parseInt(args[args.indexOf('--year') + 1], 10) : null;
const partyFilter = args.includes('--party') ? args[args.indexOf('--party') + 1]?.toLowerCase() : null;

// Modern election years
const MODERN_YEARS = [1988, 1991, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022];

// Environment setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Saknar Supabase-credentials:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!anthropicKey) {
  console.error('❌ Saknar ANTHROPIC_API_KEY');
  console.error('   Skaffa en på: https://console.anthropic.com/settings/keys');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

// Analysis metadata for reproducibility
const ANALYSIS_MODEL = 'claude-sonnet-4-20250514';
const ANALYSIS_PROMPT_VERSION = '1.0.0';
// Simple hash of prompt content for exact reproducibility tracking
const getPromptHash = (prompt: string): string => {
  let hash = 0;
  for (let i = 0; i < Math.min(prompt.length, 500); i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Swedish political parties with historical context
const PARTY_CONTEXT = `
Svenska politiska partier (historiska och moderna namn):

SOCIALDEMOKRATERNA (S)
- Tidigare: Sveriges socialdemokratiska arbetareparti (SAP)
- Symboler: Röd ros, röd färg
- Ledare: Branting, Erlander, Palme, Carlsson, Persson, Sahlin, Löfven, Andersson
- Grundat: 1889

MODERATERNA (M)
- Tidigare: Allmänna valmansförbundet, Högerpartiet
- Symboler: Blå färg, M-logga
- Ledare: Bildt, Reinfeldt, Kristersson
- Grundat: 1904

CENTERPARTIET (C)
- Tidigare: Bondeförbundet, Lantmannapartiet
- Symboler: Grön fyrklöver
- Ledare: Fälldin, Johansson, Lööf
- Grundat: 1913

LIBERALERNA (L)
- Tidigare: Folkpartiet (FP), Folkpartiet liberalerna, Frisinnade
- Symboler: Blå-gul, L-logga
- Ledare: Björklund, Sabuni, Pehrson
- Grundat: 1902

VÄNSTERPARTIET (V)
- Tidigare: SKP, VPK, Vänsterpartiet kommunisterna
- Symboler: Röd färg, v-logga
- Ledare: Schyman, Ohly, Sjöstedt, Dadgostar
- Grundat: 1917

MILJÖPARTIET (MP)
- Miljöpartiet de gröna
- Symboler: Grön maskros, grön färg
- Ledare: Romson, Fridolin, Bolund, Stenevi
- Grundat: 1981

KRISTDEMOKRATERNA (KD)
- Tidigare: Kristen demokratisk samling (KDS)
- Symboler: Blå/lila, kristen symbolik
- Ledare: Hägglund, Busch
- Grundat: 1964

SVERIGEDEMOKRATERNA (SD)
- Symboler: Blågul anemone, gul/blå
- Ledare: Åkesson
- Grundat: 1988
`;

// Analysis prompt
const ANALYSIS_PROMPT = `Du är expert på svenska politiska valaffischer från 1900-talet till idag.

Analysera denna valaffisch och svara i JSON-format:

{
  "party_detected": "slug för parti (socialdemokraterna|moderaterna|centerpartiet|liberalerna|vansterpartiet|miljopartiet|kristdemokraterna|sverigedemokraterna|annat|okant)",
  "party_confidence": "high|medium|low",
  "party_evidence": "Kort förklaring varför du identifierade partiet",

  "slogan": "Huvudsloganen på affischen, t.ex. 'Nu bygger vi ett tryggare Sverige'",
  "transcribed_text": "All läsbar text på affischen, radbrytning med \\n",
  "transcription_confidence": "high|medium|low",

  "estimated_year": null eller uppskattat årtal baserat på stil/innehåll,

  "themes": ["tema1", "tema2"],
  "rhetorical_devices": ["enhet från: framtidsloftet|hotbilden|vi_och_dom|nostalgin|trygghetsloftet|folkligt_tilltal|auktoritativt|fragan|uppmaningen|faktapastaaendet|kaensloargumentet|humor_satir|modernitet"],
  "visual_motifs": ["motiv från: flagga_foster|arbetare|familj|natur_landskap|hand_naven|text_dominant|illustration|portratt|karikatyr|abstrakt_symbol|fotografi|partilogo|politiker_portratt"],
  "tone": "hoppfull|hotande|saklig|nostalgisk|upprorisk|lugn|modern",

  "decade_context": "Kort om vad som hände i Sverige under denna tid (baserat på affischens stil/innehåll)",
  "historical_note": "Intressant observation om affischen"
}

${PARTY_CONTEXT}

Svara ENDAST med JSON, ingen annan text.`;

interface AnalysisResult {
  party_detected: string;
  party_confidence: string;
  party_evidence: string;
  slogan?: string;
  transcribed_text: string;
  transcription_confidence: string;
  estimated_year?: number | null;
  themes: string[];
  rhetorical_devices: string[];
  visual_motifs: string[];
  tone: string;
  decade_context: string;
  historical_note: string;
}

interface PosterRow {
  id: string;
  kb_digitalt_id: string | null;
  title: string;
  year: number | null;
  iiif_image_base_url: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  storage_public_url: string | null;
  upload_status: string | null;
  poster_curation: { attributed_party?: string; party?: string }[] | null;
}

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
async function fetchImageAsBase64(url: string): Promise<{ base64: string; mediaType: ImageMediaType } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ValaffischmuseetBot/1.0 (kontakt: david@surpriseventures.io)',
        Accept: 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`   ⚠️  HTTP ${response.status} för bild`);
      return null;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    // Determine media type
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg';
    if (contentType.includes('png')) mediaType = 'image/png';
    else if (contentType.includes('gif')) mediaType = 'image/gif';
    else if (contentType.includes('webp')) mediaType = 'image/webp';

    return {
      base64: Buffer.from(buffer).toString('base64'),
      mediaType,
    };
  } catch (err) {
    console.error(`   ⚠️  Kunde inte hämta bild: ${err}`);
    return null;
  }
}

/**
 * Get the best available image URL for analysis
 */
function getAnalysisImageUrl(poster: PosterRow): string | null {
  // 1. Prefer Supabase Storage (already uploaded)
  if (poster.storage_public_url) {
    return poster.storage_public_url;
  }

  // 2. IIIF with higher resolution for better analysis
  if (poster.iiif_image_base_url) {
    return `${poster.iiif_image_base_url}/full/800,/0/default.jpg`;
  }

  // 3. Direct image URL
  if (poster.image_url) {
    return poster.image_url;
  }

  // 4. Thumbnail as last resort
  if (poster.thumbnail_url) {
    return poster.thumbnail_url;
  }

  return null;
}

async function analyzeImage(imageUrl: string, posterId: string): Promise<AnalysisResult | null> {
  const imageData = await fetchImageAsBase64(imageUrl);
  if (!imageData) {
    console.error(`   ❌ Kunde inte hämta bild för ${posterId}`);
    return null;
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageData.mediaType,
                data: imageData.base64,
              },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') return null;

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`   ❌ Inget JSON i svar för ${posterId}`);
      return null;
    }

    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  } catch (err) {
    console.error(`   ❌ Claude API-fel för ${posterId}:`, err);
    return null;
  }
}

async function updatePosterCuration(posterId: string, analysis: AnalysisResult, posterYear: number | null, sourceUrl: string) {
  // Map party slug to display name
  const partyMap: Record<string, string> = {
    socialdemokraterna: 'Socialdemokraterna',
    moderaterna: 'Moderaterna',
    centerpartiet: 'Centerpartiet',
    liberalerna: 'Liberalerna',
    vansterpartiet: 'Vänsterpartiet',
    miljopartiet: 'Miljöpartiet',
    kristdemokraterna: 'Kristdemokraterna',
    sverigedemokraterna: 'Sverigedemokraterna',
  };

  const partyName = analysis.party_detected === 'okant' || analysis.party_detected === 'annat'
    ? null
    : partyMap[analysis.party_detected] || analysis.party_detected;

  // Check if curation exists
  const { data: existing } = await supabase
    .from('poster_curation')
    .select('id')
    .eq('poster_id', posterId)
    .single();

  const curationData = {
    party: partyName,
    election_year: posterYear || analysis.estimated_year,
    themes: analysis.themes,
    rhetorical_devices: analysis.rhetorical_devices,
    visual_motifs_detailed: analysis.visual_motifs,
    tone: analysis.tone,
    transcribed_text: analysis.transcribed_text,
    transcription_method: 'ai_assisted',
    transcription_confidence: analysis.transcription_confidence === 'high' ? 0.9 :
                              analysis.transcription_confidence === 'medium' ? 0.7 : 0.5,
    context_text_short: analysis.historical_note,
    curation_status: 'draft',
    updated_at: new Date().toISOString(),
    // Analysis metadata for reproducibility
    analysis_model: ANALYSIS_MODEL,
    analysis_prompt_version: ANALYSIS_PROMPT_VERSION,
    analysis_prompt_hash: getPromptHash(ANALYSIS_PROMPT),
    analyzed_at: new Date().toISOString(),
    analysis_source_url: sourceUrl,
    analysis_status: 'completed',
  };

  // Also update slogan on the poster itself if detected
  if (analysis.slogan) {
    await supabase
      .from('posters')
      .update({ slogan: analysis.slogan })
      .eq('id', posterId);
  }

  if (existing) {
    await supabase
      .from('poster_curation')
      .update(curationData)
      .eq('poster_id', posterId);
  } else {
    await supabase
      .from('poster_curation')
      .insert({
        poster_id: posterId,
        ...curationData,
      });
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   🤖 Valaffischmuseet — AI Poster Analysis');
  console.log('═══════════════════════════════════════════════════════════');
  if (force) console.log('   Mode: FORCE (omanalyserar)');
  if (modernOnly) console.log('   Filter: Moderna val (1988-2022)');
  if (yearFilter) console.log(`   Filter: År = ${yearFilter}`);
  if (partyFilter) console.log(`   Filter: Parti = ${partyFilter}`);
  if (uploadedOnly) console.log('   Filter: Endast uppladdade');
  console.log(`   Limit: ${limitArg}`);
  console.log('');

  // Build query
  let query = supabase
    .from('posters')
    .select(`
      id,
      kb_digitalt_id,
      title,
      year,
      iiif_image_base_url,
      image_url,
      thumbnail_url,
      storage_public_url,
      upload_status,
      poster_curation (party)
    `)
    .order('year', { ascending: false });

  // Apply filters
  if (uploadedOnly) {
    query = query.eq('upload_status', 'uploaded');
  }

  if (yearFilter) {
    query = query.eq('year', yearFilter);
  } else if (modernOnly) {
    query = query.in('year', MODERN_YEARS);
  }

  if (partyFilter) {
    query = query.ilike('poster_curation.party', `%${partyFilter}%`);
  }

  const { data: posters, error } = await query.limit(limitArg * 2); // Fetch extra to account for filtering

  if (error || !posters) {
    console.error('❌ Databasfel:', error);
    process.exit(1);
  }

  // Cast and filter
  const allPosters = posters as unknown as PosterRow[];

  // Filter to posters with images
  const withImages = allPosters.filter(p => getAnalysisImageUrl(p) !== null);

  // Filter to untagged posters unless --force
  const toAnalyze = force
    ? withImages
    : withImages.filter(p => {
        const curation = p.poster_curation;
        return !curation?.[0]?.party;
      });

  // Apply limit
  const limited = toAnalyze.slice(0, limitArg);

  console.log(`📊 Hittade ${allPosters.length} poster totalt`);
  console.log(`📷 Med bilder: ${withImages.length}`);
  console.log(`🔍 Att analysera: ${limited.length}${force ? ' (force)' : ' (ej taggade)'}\n`);

  if (limited.length === 0) {
    console.log('✅ Alla affischer redan analyserade!');
    return;
  }

  const stats = {
    analyzed: 0,
    tagged: 0,
    failed: 0,
    byParty: {} as Record<string, number>,
  };

  for (let i = 0; i < limited.length; i++) {
    const poster = limited[i];
    const imageUrl = getAnalysisImageUrl(poster);

    if (!imageUrl) {
      console.log(`⏭️  Hoppar över ${poster.id} — ingen bildkälla`);
      continue;
    }

    const displayId = poster.kb_digitalt_id || poster.id.substring(0, 20);
    console.log(`\n[${i + 1}/${limited.length}] 📷 ${displayId} (${poster.year || '?'})`);
    console.log(`   📝 ${poster.title?.substring(0, 50) || 'Utan titel'}...`);

    const analysis = await analyzeImage(imageUrl, displayId);

    if (analysis) {
      await updatePosterCuration(poster.id, analysis, poster.year, imageUrl);
      stats.analyzed++;

      if (analysis.party_detected && analysis.party_detected !== 'okant') {
        stats.tagged++;
        stats.byParty[analysis.party_detected] = (stats.byParty[analysis.party_detected] || 0) + 1;
        console.log(`   🏛️  ${analysis.party_detected} (${analysis.party_confidence})`);
      } else {
        console.log(`   ❓ Parti okänt`);
      }

      if (analysis.slogan) {
        console.log(`   💬 "${analysis.slogan}"`);
      } else if (analysis.transcribed_text) {
        const preview = analysis.transcribed_text.slice(0, 60).replace(/\n/g, ' ');
        console.log(`   📝 "${preview}${analysis.transcribed_text.length > 60 ? '...' : ''}"`);
      }
    } else {
      stats.failed++;
      console.log(`   ❌ Analys misslyckades`);
    }

    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   📊 SAMMANFATTNING');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Analyserade: ${stats.analyzed}`);
  console.log(`   🏛️  Parti identifierat: ${stats.tagged}`);
  console.log(`   ❌ Misslyckades: ${stats.failed}`);
  console.log('\n   Per parti:');
  for (const [party, count] of Object.entries(stats.byParty).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${party}: ${count}`);
  }
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
