#!/usr/bin/env npx tsx

/**
 * Download alla externa affisch-bilder lokalt till public/affischer/
 *
 * Varför: just nu pekar imageUrl på externa servrar (wikimedia, stockholmskällan,
 * affischerna.se, dimu.org, flickr). Det är skört — om någon server är nere
 * eller blockerar oss visar sajten broken images. Lösningen är att cachelagra
 * alla bilder lokalt och servera från samma origin.
 *
 * Skriptet:
 *  1. Läser alla externa affischer från src/lib/external-sources.ts
 *  2. Laddar ner varje imageUrl till public/affischer/<id>.<ext>
 *  3. Skriver data/poster-manifest.json med id → lokal sökväg
 *  4. Idempotent: skippar redan nedladdade filer
 *
 * Usage:
 *   npx tsx scripts/download-posters.ts                    # alla
 *   npx tsx scripts/download-posters.ts --force            # tvinga om-nedladdning
 *   npx tsx scripts/download-posters.ts --party SD         # bara ett parti
 *   npx tsx scripts/download-posters.ts --dry-run          # ingen disk-write
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  AFFISCHERNA_POSTERS,
  AFFISCHERNA_LEFT_POSTERS,
  SD_POSTERS,
  MODERATERNA_POSTERS,
  WIKIMEDIA_POSTERS,
  DIGITALTMUSEUM_POSTERS,
  MILJOPARTIET_POSTERS,
} from '../src/lib/external-sources';
import type { Poster } from '../src/lib/types';

const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const partyFilter = args.includes('--party')
  ? args[args.indexOf('--party') + 1]
  : null;

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'affischer');
const MANIFEST_PATH = path.join(ROOT, 'data', 'poster-manifest.json');

// --- helpers ---
function extFromUrl(url: string): string {
  // Hantera ?dimension=... query strings
  const clean = url.split('?')[0].split('#')[0];
  const m = clean.match(/\.(jpe?g|png|webp|gif|tiff?)$/i);
  if (m) return m[1].toLowerCase().replace('jpeg', 'jpg').replace('tiff', 'tif');
  // Fallback: gissa från content-type efter HEAD
  return 'jpg';
}

async function downloadOne(poster: Poster): Promise<{ ok: boolean; reason?: string; localPath?: string }> {
  const url = poster.imageUrl || poster.thumbnailUrl;
  if (!url) return { ok: false, reason: 'no-url' };

  // Skippa data-URLer eller relativa
  if (url.startsWith('data:') || url.startsWith('/')) {
    return { ok: false, reason: 'not-remote' };
  }

  const ext = extFromUrl(url);
  const filename = `${poster.id}.${ext}`;
  const target = path.join(OUTPUT_DIR, filename);
  const localPath = `/affischer/${filename}`;

  if (!force && fs.existsSync(target)) {
    return { ok: true, localPath, reason: 'cached' };
  }

  if (dryRun) {
    return { ok: true, localPath, reason: 'dry-run' };
  }

  try {
    const res = await fetch(url, {
      headers: {
        // Vissa servrar (affischerna.se) blockerar default User-Agent
        'User-Agent':
          'ValaffischmuseetBot/1.0 (kontakt: david@surpriseventures.io; bildningsprojekt)',
        Accept: 'image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      return { ok: false, reason: `http-${res.status}` };
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return { ok: false, reason: `not-image (${contentType})` };
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) {
      // Sannolikt en placeholder eller felsida
      return { ok: false, reason: `too-small (${buf.length}B)` };
    }

    fs.writeFileSync(target, buf);
    return { ok: true, localPath, reason: 'downloaded' };
  } catch (err) {
    return { ok: false, reason: `error: ${(err as Error).message}` };
  }
}

// --- main ---
async function main() {
  const allPosters: Poster[] = [
    ...AFFISCHERNA_POSTERS,
    ...AFFISCHERNA_LEFT_POSTERS,
    ...SD_POSTERS,
    ...MODERATERNA_POSTERS,
    ...WIKIMEDIA_POSTERS,
    ...DIGITALTMUSEUM_POSTERS,
    ...MILJOPARTIET_POSTERS,
  ];

  // Filtrera bort URL:er som är tomma eller inte är HTTP
  const candidates = allPosters.filter((p) => {
    const url = p.imageUrl || p.thumbnailUrl;
    if (!url) return false;
    if (!url.startsWith('http')) return false;
    if (partyFilter && p.party !== partyFilter) return false;
    return true;
  });

  console.log(`📥 Valaffischmuseet — bilddownloader`);
  console.log(`   Total: ${allPosters.length} affischer i kodbasen`);
  console.log(`   Kandidater för download: ${candidates.length}`);
  if (partyFilter) console.log(`   Filter: parti = ${partyFilter}`);
  if (force) console.log(`   Mode: FORCE (laddar om allt)`);
  if (dryRun) console.log(`   Mode: DRY-RUN (ingen disk-write)`);
  console.log('');

  if (!dryRun) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  }

  // Läs befintligt manifest så vi inte tappar redan nedladdade poster
  let manifest: Record<string, string> = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {
      manifest = {};
    }
  }

  const stats = {
    downloaded: 0,
    cached: 0,
    failed: 0,
    skipped: 0,
  };
  const failures: Array<{ id: string; url: string; reason: string }> = [];

  // Kör 5 parallellt — håll snäll mot servrar
  const CONCURRENCY = 5;
  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const batch = candidates.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (p) => ({ poster: p, result: await downloadOne(p) }))
    );

    for (const { poster, result } of results) {
      const url = poster.imageUrl || poster.thumbnailUrl || '';
      if (result.ok && result.localPath) {
        manifest[poster.id] = result.localPath;
        if (result.reason === 'cached') stats.cached++;
        else if (result.reason === 'dry-run') stats.skipped++;
        else stats.downloaded++;
        const tag =
          result.reason === 'cached' ? '⏭️ ' : result.reason === 'dry-run' ? '🧪' : '✅';
        console.log(`${tag}  ${poster.id.padEnd(30)} ${result.reason}`);
      } else {
        stats.failed++;
        failures.push({ id: poster.id, url, reason: result.reason || 'unknown' });
        console.log(`❌  ${poster.id.padEnd(30)} ${result.reason}`);
      }
    }

    // Liten paus mellan batchar
    if (i + CONCURRENCY < candidates.length) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  if (!dryRun) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  }

  console.log('');
  console.log('═══ Sammanfattning ═══');
  console.log(`  ✅ Nedladdade:  ${stats.downloaded}`);
  console.log(`  ⏭️  Cachade:    ${stats.cached}`);
  console.log(`  🧪 Dry-run:    ${stats.skipped}`);
  console.log(`  ❌ Misslyckade: ${stats.failed}`);
  console.log(`  Manifest: ${MANIFEST_PATH}`);
  console.log(`  Bilder:   ${OUTPUT_DIR}`);

  if (failures.length > 0) {
    console.log('');
    console.log('═══ Misslyckade ═══');
    for (const f of failures) {
      console.log(`  ${f.id} (${f.reason})`);
      console.log(`    ${f.url}`);
    }
  }

  // Status: exit non-zero om alla failade
  if (stats.failed > 0 && stats.downloaded === 0 && stats.cached === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
