# B3.1: Ord-explorer (flagship-vy)

**Datum:** 2026-04-29
**Status:** Implementerad

## Vad jag byggde

### 1. Ordanalys-utilities (`src/lib/word-analysis.ts`)

- Extraherar ord från slogans, titlar och transkriberad text
- Filtrerar bort svenska stoppord
- Räknar ordfrekvens per affisch, år och parti
- Sample-slogans för bättre datakvalitet även med begränsad data

### 2. WordCloud-komponent (`src/components/word-cloud.tsx`)

- Interaktivt ordmoln med Framer Motion-animationer
- Ord skalas efter frekvens (14px–72px)
- Tooltips med metadata på hover
- Valfri färgkodning per parti
- WordDetail-komponent för djupare info vid klick

### 3. Ord-explorer-sida (`src/app/ord/`)

**Server Component (`page.tsx`):**
- Hämtar alla affischer via `getAllElectionPosters`
- Berikar med sample-slogans för fullare ordmoln
- Analyserar ordfrekvenser
- Pre-renders med revalidate=3600 (1h cache)

**Client Component (`ord-explorer-client.tsx`):**
- Filter per årtionde och parti
- "Färg per parti"-toggle
- Animerade filterskiften

### 4. Navigation

- Länk "Ord-explorer" tillagd i header.tsx
- Markerad med accent-färg (feature highlight)

## Designval

1. **Serif-typsnitt i molnet** — Playfair Display ger historisk känsla
2. **Storleksscaling med sqrt** — Bättre spridning än linjär (annars dominerar toppord för mycket)
3. **Sample-slogans** — Kompenserar för att KB-data saknar slogans (bara titlar)
4. **Statisk rendering** — /ord är pre-rendered för snabb laddning

## Filer som ändrats/skapats

- `src/lib/word-analysis.ts` (ny)
- `src/components/word-cloud.tsx` (ny)
- `src/app/ord/page.tsx` (ny)
- `src/app/ord/ord-explorer-client.tsx` (ny)
- `src/components/header.tsx` (uppdaterad — ny nav-länk)

## Vad nästa person bör veta

1. **Datakvalitet:** Sample-slogans i `word-analysis.ts` är manuellt kurerade. Lägg till fler för bättre täckning.

2. **Filter prestanda:** Med >500 ord kan rendering bli trög på mobil. Överväg virtualisering för stora dataset.

3. **Utbyggnad:** Ord-trender över tid (hur ofta ett ord används per decennium) finns i utilities men visas inte i UI ännu.

## Verifierat

- [x] TypeScript kompilerar utan fel
- [x] Build lyckas (`/ord` pre-renderas)
- [x] Navigation uppdaterad
