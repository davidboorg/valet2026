#!/usr/bin/env npx tsx

/**
 * AI-powered poster analysis using Claude Vision
 *
 * Analyzes Swedish election posters to detect:
 * - Political party (from text, symbols, colors)
 * - Transcribed text
 * - Themes and rhetorical devices
 * - Visual motifs
 * - Tone
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/analyze-posters.ts
 *
 * Options:
 *   --limit N     Analyze only N posters (default: all untagged)
 *   --force       Re-analyze even if already tagged
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// Environment setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!anthropicKey) {
  console.error('❌ Missing ANTHROPIC_API_KEY');
  console.error('   Get one at: https://console.anthropic.com/settings/keys');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

// Swedish political parties with historical context
const PARTY_CONTEXT = `
Svenska politiska partier (historiska och moderna namn):

SOCIALDEMOKRATERNA (S)
- Tidigare: Sveriges socialdemokratiska arbetareparti (SAP)
- Symboler: Röd ros, röd färg, arbetarsymboler
- Grundat: 1889

HÖGERPARTIET / MODERATERNA (H/M)
- Tidigare: Allmänna valmansförbundet, Högerpartiet
- Symboler: Blå färg, M-logga
- Grundat: 1904

BONDEFÖRBUNDET / CENTERPARTIET (BF/C)
- Tidigare: Bondeförbundet, Lantmannapartiet
- Symboler: Grön fyrklöver, jordbruksmotiv
- Grundat: 1913

FOLKPARTIET / LIBERALERNA (FP/L)
- Tidigare: Frisinnade, Folkpartiet liberalerna
- Symboler: Blå-gul, L-logga
- Grundat: 1902

KOMMUNISTERNA / VÄNSTERPARTIET (K/V)
- Tidigare: SKP, VPK, Vänsterpartiet kommunisterna
- Symboler: Röd färg, hammare och skära, v-logga
- Grundat: 1917

SVENSK NATIONALSOCIALISTISK PARTI (SNS) - historiskt
NYSVENSKA RÖRELSEN - historiskt
BONDEFÖRBUNDETS UNGDOMSFÖRBUND (BUF)
`;

// Analysis prompt
const ANALYSIS_PROMPT = `Du är expert på svenska politiska affischer från tidigt 1900-tal till 1950-talet.

Analysera denna valaffisch och svara i JSON-format:

{
  "party_detected": "slug för parti (socialdemokraterna|hogerpartiet|moderaterna|bondeforbundet|centerpartiet|liberalerna|vansterpartiet|annat|okant)",
  "party_confidence": "high|medium|low",
  "party_evidence": "Kort förklaring varför du identifierade partiet",

  "transcribed_text": "All läsbar text på affischen, radbrytning med \\n",
  "transcription_confidence": "high|medium|low",

  "themes": ["tema1", "tema2"],
  "rhetorical_devices": ["enhet från: framtidsloftet|hotbilden|vi_och_dom|nostalgin|trygghetsloftet|folkligt_tilltal|auktoritativt|fragan|uppmaningen|faktapastaaendet|kaensloargumentet|humor_satir"],
  "visual_motifs": ["motiv från: flagga_foster|arbetare|familj|natur_landskap|hand_naven|text_dominant|illustration|portratt|karikatyr|abstrakt_symbol|fotografi|vapenemblem"],
  "tone": "hoppfull|hotande|saklig|nostalgisk|upprorisk|lugn",

  "decade_context": "Kort om vad som hände i Sverige under denna tid (baserat på affischens stil/innehåll)",
  "historical_note": "Intressant observation om affischen"
}

${PARTY_CONTEXT}

Svara ENDAST med JSON, ingen annan text.`;

interface AnalysisResult {
  party_detected: string;
  party_confidence: string;
  party_evidence: string;
  transcribed_text: string;
  transcription_confidence: string;
  themes: string[];
  rhetorical_devices: string[];
  visual_motifs: string[];
  tone: string;
  decade_context: string;
  historical_note: string;
}

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  } catch (err) {
    console.error(`Failed to fetch image: ${err}`);
    return null;
  }
}

async function analyzeImage(imageUrl: string, posterId: string): Promise<AnalysisResult | null> {
  // Get a medium-sized version of the image for analysis
  const analysisUrl = imageUrl.replace('/full/200,/', '/full/800,/');

  const imageBase64 = await fetchImageAsBase64(analysisUrl);
  if (!imageBase64) {
    console.error(`  Could not fetch image for ${posterId}`);
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
                media_type: 'image/jpeg',
                data: imageBase64,
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
      console.error(`  No JSON found in response for ${posterId}`);
      return null;
    }

    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  } catch (err) {
    console.error(`  Claude API error for ${posterId}:`, err);
    return null;
  }
}

async function updatePosterCuration(posterId: string, analysis: AnalysisResult) {
  // Map party slug
  const partySlug = analysis.party_detected === 'okant' ? null : analysis.party_detected;

  // Check if curation exists
  const { data: existing } = await supabase
    .from('poster_curation')
    .select('id')
    .eq('poster_id', posterId)
    .single();

  const curationData = {
    attributed_party: partySlug,
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
  };

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
  const args = process.argv.slice(2);
  const limitArg = args.indexOf('--limit');
  const limit = limitArg >= 0 ? parseInt(args[limitArg + 1], 10) : 1000;
  const force = args.includes('--force');

  console.log('🤖 AI Poster Analysis');
  console.log('=====================\n');

  // Fetch posters to analyze
  let query = supabase
    .from('posters')
    .select(`
      id,
      kb_digitalt_id,
      title,
      year,
      iiif_image_base_url,
      poster_curation (attributed_party)
    `)
    .not('iiif_image_base_url', 'is', null)
    .order('year', { ascending: true })
    .limit(limit);

  const { data: posters, error } = await query;

  if (error || !posters) {
    console.error('Failed to fetch posters:', error);
    process.exit(1);
  }

  // Filter to untagged posters unless --force
  const toAnalyze = force
    ? posters
    : posters.filter(p => {
        const curation = p.poster_curation as { attributed_party?: string }[] | null;
        return !curation?.[0]?.attributed_party;
      });

  console.log(`📊 Found ${posters.length} posters total`);
  console.log(`🔍 Analyzing ${toAnalyze.length} posters${force ? ' (force mode)' : ' (untagged only)'}\n`);

  if (toAnalyze.length === 0) {
    console.log('✅ All posters already tagged!');
    return;
  }

  const stats = {
    analyzed: 0,
    tagged: 0,
    failed: 0,
    byParty: {} as Record<string, number>,
  };

  for (const poster of toAnalyze) {
    const thumbnailUrl = poster.iiif_image_base_url
      ? `${poster.iiif_image_base_url}/full/200,/0/default.jpg`
      : null;

    if (!thumbnailUrl) {
      console.log(`⏭️  Skipping ${poster.kb_digitalt_id} - no image URL`);
      continue;
    }

    console.log(`📷 Analyzing: ${poster.kb_digitalt_id} (${poster.year || '?'})`);

    const analysis = await analyzeImage(thumbnailUrl, poster.kb_digitalt_id);

    if (analysis) {
      await updatePosterCuration(poster.id, analysis);
      stats.analyzed++;

      if (analysis.party_detected && analysis.party_detected !== 'okant') {
        stats.tagged++;
        stats.byParty[analysis.party_detected] = (stats.byParty[analysis.party_detected] || 0) + 1;
        console.log(`   ✅ ${analysis.party_detected} (${analysis.party_confidence})`);
        if (analysis.transcribed_text) {
          const preview = analysis.transcribed_text.slice(0, 60).replace(/\n/g, ' ');
          console.log(`   📝 "${preview}${analysis.transcribed_text.length > 60 ? '...' : ''}"`);
        }
      } else {
        console.log(`   ❓ Parti okänt`);
      }
    } else {
      stats.failed++;
      console.log(`   ❌ Analysis failed`);
    }

    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n==================');
  console.log('📊 Analysis Complete\n');
  console.log(`   Analyzed: ${stats.analyzed}`);
  console.log(`   Tagged with party: ${stats.tagged}`);
  console.log(`   Failed: ${stats.failed}`);
  console.log('\n🏛️ By party:');
  for (const [party, count] of Object.entries(stats.byParty).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${party}: ${count}`);
  }
}

main().catch(console.error);
