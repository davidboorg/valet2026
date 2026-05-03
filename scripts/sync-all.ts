#!/usr/bin/env npx tsx

/**
 * Valaffischmuseet — Full Sync Orchestrator
 *
 * Kör hela synkroniseringsflödet:
 *   1. Samla kandidater från Wikimedia Commons (collect-posters)
 *   2. Verifiera URL:er (collect-posters --verify)
 *   3. Importera till Supabase (collect-posters --import-to-db)
 *   4. Ladda upp bilder till Supabase Storage (upload-to-storage)
 *   5. Analysera med Claude Vision (analyze-posters)
 *
 * Usage:
 *   npx tsx scripts/sync-all.ts                    # kör alla steg
 *   npx tsx scripts/sync-all.ts --step upload      # bara upload
 *   npx tsx scripts/sync-all.ts --step analyze     # bara analyze
 *   npx tsx scripts/sync-all.ts --modern           # moderna val endast
 *   npx tsx scripts/sync-all.ts --dry-run          # simulera
 *
 * Miljövariabler:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY (för analyze-steget)
 */

import { spawn } from 'child_process';
import * as path from 'path';

// --- CLI Args ---
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const modernOnly = args.includes('--modern');
const stepOnly = args.includes('--step') ? args[args.indexOf('--step') + 1] : null;
const limitArg = args.includes('--limit') ? args[args.indexOf('--limit') + 1] : null;

const SCRIPTS_DIR = __dirname;

// Step definitions
interface Step {
  name: string;
  script: string;
  args: string[];
  description: string;
  requiresKey?: string;
}

const STEPS: Step[] = [
  {
    name: 'collect',
    script: 'collect-posters.ts',
    args: ['--scan-all'],
    description: 'Samlar affischkandidater från Wikimedia Commons',
  },
  {
    name: 'verify',
    script: 'collect-posters.ts',
    args: ['--verify'],
    description: 'Verifierar att bild-URL:er är tillgängliga',
  },
  {
    name: 'import',
    script: 'collect-posters.ts',
    args: ['--import-to-db'],
    description: 'Importerar verifierade kandidater till Supabase',
  },
  {
    name: 'upload',
    script: 'upload-to-storage.ts',
    args: [],
    description: 'Laddar upp bilder till Supabase Storage',
  },
  {
    name: 'analyze',
    script: 'analyze-posters.ts',
    args: ['--uploaded-only'],
    description: 'Analyserar affischer med Claude Vision AI',
    requiresKey: 'ANTHROPIC_API_KEY',
  },
];

function runScript(script: string, scriptArgs: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, script);
    const allArgs = [scriptPath, ...scriptArgs];

    console.log(`\n   $ npx tsx ${script} ${scriptArgs.join(' ')}\n`);

    if (dryRun) {
      console.log('   [DRY-RUN: skulle köra ovan]');
      resolve(0);
      return;
    }

    const proc = spawn('npx', ['tsx', ...allArgs], {
      stdio: 'inherit',
      cwd: path.resolve(SCRIPTS_DIR, '..'),
      env: process.env,
    });

    proc.on('close', (code) => {
      resolve(code ?? 0);
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   🔄 Valaffischmuseet — Full Sync');
  console.log('═══════════════════════════════════════════════════════════');
  if (dryRun) console.log('   Mode: DRY-RUN');
  if (modernOnly) console.log('   Filter: Moderna val (1988-2022)');
  if (stepOnly) console.log(`   Step: ${stepOnly} endast`);
  if (limitArg) console.log(`   Limit: ${limitArg}`);
  console.log('');

  // Validate environment
  const missingEnv: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingEnv.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingEnv.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missingEnv.length > 0) {
    console.error('❌ Saknar miljövariabler:');
    for (const env of missingEnv) {
      console.error(`   ${env}`);
    }
    process.exit(1);
  }

  // Filter steps
  let stepsToRun = STEPS;
  if (stepOnly) {
    const step = STEPS.find(s => s.name === stepOnly);
    if (!step) {
      console.error(`❌ Okänt steg: ${stepOnly}`);
      console.error('   Tillgängliga steg: ' + STEPS.map(s => s.name).join(', '));
      process.exit(1);
    }
    stepsToRun = [step];
  }

  // Run steps
  const results: { name: string; success: boolean; duration: number }[] = [];

  for (const step of stepsToRun) {
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   📦 Steg: ${step.name.toUpperCase()}`);
    console.log(`   ${step.description}`);
    console.log('───────────────────────────────────────────────────────────');

    // Check required env vars
    if (step.requiresKey && !process.env[step.requiresKey]) {
      console.log(`   ⏭️  Hoppar över — saknar ${step.requiresKey}`);
      results.push({ name: step.name, success: false, duration: 0 });
      continue;
    }

    // Build args
    const stepArgs = [...step.args];
    if (modernOnly) stepArgs.push('--modern');
    if (dryRun) stepArgs.push('--dry-run');
    if (limitArg) stepArgs.push('--limit', limitArg);

    const startTime = Date.now();

    try {
      const exitCode = await runScript(step.script, stepArgs);
      const duration = (Date.now() - startTime) / 1000;

      if (exitCode === 0) {
        console.log(`\n   ✅ ${step.name} klart (${duration.toFixed(1)}s)`);
        results.push({ name: step.name, success: true, duration });
      } else {
        console.log(`\n   ⚠️  ${step.name} avslutades med kod ${exitCode}`);
        results.push({ name: step.name, success: false, duration });

        // Don't continue if a step fails (except in dry-run)
        if (!dryRun && exitCode !== 0) {
          console.log('\n   ⛔ Avbryter på grund av fel');
          break;
        }
      }
    } catch (err) {
      console.error(`\n   ❌ Fel vid körning av ${step.name}:`, err);
      results.push({ name: step.name, success: false, duration: 0 });
      break;
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   📊 SAMMANFATTNING');
  console.log('═══════════════════════════════════════════════════════════');

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  for (const result of results) {
    const icon = result.success ? '✅' : '❌';
    const time = result.duration > 0 ? ` (${result.duration.toFixed(1)}s)` : '';
    console.log(`   ${icon} ${result.name}${time}`);
  }

  console.log('');
  console.log(`   Total tid: ${totalDuration.toFixed(1)}s`);
  console.log(`   Lyckades: ${succeeded} / ${results.length}`);

  if (failed > 0) {
    process.exit(1);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   💡 Nästa steg:');
  console.log('      Starta dev-servern: npm run dev');
  console.log('      Kör enskilt steg: npx tsx scripts/sync-all.ts --step analyze');
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
