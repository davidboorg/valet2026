#!/usr/bin/env npx tsx

/**
 * Ladda upp affischbilder till Supabase Storage
 *
 * Detta script:
 *  1. Läser poster från Supabase med upload_status = 'pending'
 *  2. Hämtar bilder från lokal cache (public/affischer/) eller externa URL:er
 *  3. Laddar upp till Supabase Storage bucket 'posters'
 *  4. Uppdaterar databasen med storage_path och storage_public_url
 *
 * Usage:
 *   npx tsx scripts/upload-to-storage.ts                     # alla pending
 *   npx tsx scripts/upload-to-storage.ts --migrate-local     # migrera från public/affischer/
 *   npx tsx scripts/upload-to-storage.ts --party SD          # bara ett parti
 *   npx tsx scripts/upload-to-storage.ts --year 2022         # bara ett år
 *   npx tsx scripts/upload-to-storage.ts --force             # ladda om alla
 *   npx tsx scripts/upload-to-storage.ts --dry-run           # simulera
 *   npx tsx scripts/upload-to-storage.ts --limit 10          # max antal
 *
 * Kräver:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

// --- Config ---
const args = process.argv.slice(2);
const migrateLocal = args.includes('--migrate-local');
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const partyFilter = args.includes('--party')
  ? args[args.indexOf('--party') + 1]?.toLowerCase()
  : null;
const yearFilter = args.includes('--year')
  ? parseInt(args[args.indexOf('--year') + 1], 10)
  : null;
const limitArg = args.includes('--limit')
  ? parseInt(args[args.indexOf('--limit') + 1], 10)
  : null;

const BUCKET = 'posters';
const CONCURRENCY = 3; // Håll låg för att undvika rate limits

const ROOT = path.resolve(__dirname, '..');
const LOCAL_DIR = path.join(ROOT, 'public', 'affischer');
const MANIFEST_PATH = path.join(ROOT, 'data', 'poster-manifest.json');

// --- Supabase setup ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Saknar miljövariabler:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Types ---
interface PosterRow {
  id: string;
  title: string;
  year: number | null;
  source: string;
  image_url: string | null;
  thumbnail_url: string | null;
  storage_path: string | null;
  storage_public_url: string | null;
  upload_status: string;
  party?: string;
}

// --- Helpers ---
function getPartyAbbrev(party: string | null | undefined): string {
  if (!party) return 'other';
  const p = party.toLowerCase();
  if (p.includes('socialdemokrat')) return 's';
  if (p.includes('moderat')) return 'm';
  if (p.includes('sverigedemokrat')) return 'sd';
  if (p.includes('center')) return 'c';
  if (p.includes('vänster') || p === 'vpk') return 'v';
  if (p.includes('miljö')) return 'mp';
  if (p.includes('liberal') || p.includes('folkparti')) return 'l';
  if (p.includes('kristdemokrat')) return 'kd';
  if (p.includes('höger')) return 'h';
  if (p.includes('bonde')) return 'bf';
  return 'other';
}

function extFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext;
  }
  return 'jpg';
}

function extFromContentType(contentType: string): string {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  return 'jpg';
}

function generateStoragePath(id: string, year: number | null, party: string | null, ext: string): string {
  const y = year?.toString() || 'unknown';
  const p = getPartyAbbrev(party);
  return `${y}/${p}/${id}.${ext}`;
}

function sha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ValaffischmuseetBot/1.0 (kontakt: david@surpriseventures.io)',
        Accept: 'image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      console.log(`   ⚠️  HTTP ${res.status} för ${url}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      console.log(`   ⚠️  Inte en bild: ${contentType}`);
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) {
      console.log(`   ⚠️  För liten bild: ${buffer.length} bytes`);
      return null;
    }

    return { buffer, contentType };
  } catch (err) {
    console.log(`   ⚠️  Nedladdningsfel: ${(err as Error).message}`);
    return null;
  }
}

async function uploadOne(poster: PosterRow, localManifest: Record<string, string>): Promise<boolean> {
  const { id, title, year, source, image_url, thumbnail_url } = poster;
  const party = poster.party || null;

  console.log(`\n📤 ${id}`);
  console.log(`   "${title}" (${year || 'okänt år'})`);

  // 1. Försök läsa från lokal cache först
  let buffer: Buffer | null = null;
  let ext = 'jpg';
  let contentType = 'image/jpeg';

  const localPath = localManifest[id];
  if (localPath) {
    const fullPath = path.join(ROOT, 'public', localPath);
    if (fs.existsSync(fullPath)) {
      console.log(`   📁 Läser från lokal cache: ${localPath}`);
      buffer = fs.readFileSync(fullPath);
      ext = extFromFilename(localPath);
      contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    }
  }

  // 2. Om inte lokalt, ladda ner från extern URL
  if (!buffer) {
    const url = image_url || thumbnail_url;
    if (!url) {
      console.log(`   ❌ Ingen bildkälla`);
      await updateStatus(id, 'missing_source');
      return false;
    }

    console.log(`   🌐 Laddar ner: ${url.substring(0, 80)}...`);
    const result = await downloadImage(url);
    if (!result) {
      await updateStatus(id, 'failed');
      return false;
    }
    buffer = result.buffer;
    contentType = result.contentType;
    ext = extFromContentType(contentType);
  }

  // 3. Generera storage path och hash
  const storagePath = generateStoragePath(id, year, party, ext);
  const imageHash = sha256(buffer);

  console.log(`   📂 Storage path: ${storagePath}`);
  console.log(`   🔑 Hash: ${imageHash.substring(0, 16)}...`);

  if (dryRun) {
    console.log(`   🧪 DRY-RUN: Skulle ladda upp ${buffer.length} bytes`);
    return true;
  }

  // 4. Ladda upp till Supabase Storage
  try {
    await updateStatus(id, 'uploading');

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.log(`   ❌ Upload-fel: ${uploadError.message}`);
      await updateStatus(id, 'failed');
      return false;
    }

    // 5. Hämta publik URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData?.publicUrl || null;

    // 6. Uppdatera databasen
    const { error: updateError } = await supabase
      .from('posters')
      .update({
        storage_path: storagePath,
        storage_public_url: publicUrl,
        upload_status: 'uploaded',
        uploaded_at: new Date().toISOString(),
        image_hash: imageHash,
        image_format: ext,
        image_size_bytes: buffer.length,
      })
      .eq('id', id);

    if (updateError) {
      console.log(`   ❌ DB-uppdateringsfel: ${updateError.message}`);
      return false;
    }

    console.log(`   ✅ Uppladdad! ${publicUrl}`);
    return true;
  } catch (err) {
    console.log(`   ❌ Fel: ${(err as Error).message}`);
    await updateStatus(id, 'failed');
    return false;
  }
}

async function updateStatus(id: string, status: string): Promise<void> {
  if (dryRun) return;
  await supabase
    .from('posters')
    .update({ upload_status: status })
    .eq('id', id);
}

// --- Main ---
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   📤 Valaffischmuseet — Supabase Storage Uploader');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Bucket: ${BUCKET}`);
  if (migrateLocal) console.log('   Mode: MIGRATE-LOCAL');
  if (force) console.log('   Mode: FORCE (laddar om allt)');
  if (dryRun) console.log('   Mode: DRY-RUN');
  if (partyFilter) console.log(`   Filter: parti = ${partyFilter}`);
  if (yearFilter) console.log(`   Filter: år = ${yearFilter}`);
  if (limitArg) console.log(`   Limit: ${limitArg}`);
  console.log('');

  // Läs lokalt manifest för cache-lookup
  let localManifest: Record<string, string> = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      localManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      console.log(`📁 Lokalt manifest: ${Object.keys(localManifest).length} poster`);
    } catch {
      console.log('⚠️  Kunde inte läsa poster-manifest.json');
    }
  }

  // Hämta poster från Supabase
  let query = supabase
    .from('v_election_posters')
    .select('id, title, year, source, image_url, thumbnail_url, storage_path, storage_public_url, upload_status, party');

  // Filtrera
  if (!force) {
    query = query.or('upload_status.eq.pending,upload_status.eq.failed,upload_status.is.null');
  }
  if (yearFilter) {
    query = query.eq('year', yearFilter);
  }
  if (partyFilter) {
    query = query.ilike('party', `%${partyFilter}%`);
  }

  // Om migrate-local, hämta alla som har lokal fil men inte uppladdad
  if (migrateLocal) {
    const localIds = Object.keys(localManifest);
    if (localIds.length === 0) {
      console.log('❌ Inga lokala bilder att migrera');
      return;
    }
    query = query.in('id', localIds);
  }

  const { data: posters, error } = await query;

  if (error) {
    console.error('❌ Databasfel:', error.message);
    process.exit(1);
  }

  if (!posters || posters.length === 0) {
    console.log('✅ Inga poster att ladda upp!');
    return;
  }

  // Filtrera bort redan uppladdade (om inte force)
  let candidates = posters as PosterRow[];
  if (!force) {
    candidates = candidates.filter(p =>
      p.upload_status !== 'uploaded' ||
      (migrateLocal && localManifest[p.id])
    );
  }

  // Applicera limit
  if (limitArg && candidates.length > limitArg) {
    candidates = candidates.slice(0, limitArg);
  }

  console.log(`\n📊 Hittade ${posters.length} poster, ${candidates.length} att bearbeta\n`);

  // Processa i batchar
  const stats = { success: 0, failed: 0 };

  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const batch = candidates.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(p => uploadOne(p, localManifest))
    );

    for (const success of results) {
      if (success) stats.success++;
      else stats.failed++;
    }

    // Paus mellan batchar
    if (i + CONCURRENCY < candidates.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Sammanfattning
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   📊 SAMMANFATTNING');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Lyckades:    ${stats.success}`);
  console.log(`   ❌ Misslyckades: ${stats.failed}`);
  console.log('═══════════════════════════════════════════════════════════');

  if (stats.failed > 0 && stats.success === 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
