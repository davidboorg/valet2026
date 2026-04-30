# B2: Wire getAllElectionPosters till Supabase

**Datum:** 2026-04-29
**Status:** Implementerad

## Vad jag byggde

### 1. Ny central datahämtningsfil (`src/lib/posters.ts`)

Centraliserar all poster-hämtning med Supabase-first, fallback-till-KB-API logik:

```typescript
export async function getAllElectionPosters(options): Promise<Poster[]> {
  // 1. Försök Supabase om konfigurerad
  if (isSupabaseConfigured) {
    const result = await getPostersFromSupabase(options);
    if (result?.length > 0) return result;
  }

  // 2. Fallback till KB API + externa källor
  return getPostersFromFallback(options);
}
```

### 2. Ny typ för Supabase-vyn (`src/lib/types.ts`)

```typescript
export interface VElectionPoster {
  id: string;
  title: string;
  creator?: string;
  year?: number;
  source: PosterSource;
  // ... fler fält som matchar v_election_posters-vyn
}
```

### 3. Uppdaterade imports

- `src/app/affischer/page.tsx` → importerar nu från `@/lib/posters`
- `src/app/page.tsx` → importerar nu från `@/lib/posters`
- `src/lib/kb-api.ts` → re-exporterar `getAllElectionPosters` för bakåtkompatibilitet

## Hur det fungerar

1. **Med Supabase konfigurerad + migrationer körda:**
   - Hämtar från `v_election_posters`-vyn
   - Stöd för filtrering på party, year, etc.

2. **Utan Supabase eller om vyn saknas:**
   - Faller tillbaka till KB API + statiska arrays
   - Console loggar "Supabase not configured" eller "Supabase returned no data"

## Vad nästa person bör veta

1. **Migrationerna måste köras** för att Supabase ska fungera:
   ```bash
   supabase db push
   ```

2. **Fallback är alltid aktiv** — appen fungerar även utan Supabase

3. **Nya hjälpfunktioner finns:**
   - `getPosterById(id)` — hämtar enskild affisch
   - `getPostersByParty(party)` — hämtar per parti
   - `getPostersByYearRange(from, to)` — hämtar per årsspann

4. **Re-export för bakåtkompatibilitet:**
   - `getAllElectionPosters` kan fortfarande importeras från `@/lib/kb-api`
   - Rekommenderat: importera från `@/lib/posters` direkt

## Filer som ändrats

- `src/lib/posters.ts` (ny)
- `src/lib/types.ts` (utökad med VElectionPoster)
- `src/lib/kb-api.ts` (borttaget implementation, lagt till re-export)
- `src/app/affischer/page.tsx` (uppdaterad import)
- `src/app/page.tsx` (uppdaterad import)

## Verifierat

- [x] TypeScript kompilerar utan fel
- [x] Build lyckas
- [x] Fallback fungerar när Supabase-vyn saknas
