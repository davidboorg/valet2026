# B3.2: Retorik-mode på affischer-sidan

**Datum:** 2026-04-29
**Status:** Implementerad

## Vad jag byggde

### 1. RhetoricOverlay-komponent (`src/components/rhetoric-overlay.tsx`)

- Visar retorikanalys som overlay på affischkort
- Stöd för tonlägen (hoppfull, hotande, saklig, nostalgisk, upprorisk, lugn)
- Visar retoriska grepp (alliteration, anafor, antites, hyperbol, metafor, etc.)
- Visar teman som färgkodade badges
- RhetoricLegend för att förklara symbolerna
- `enrichWithSampleRhetoric()` för demo-data

### 2. Uppdaterad PosterCard (`src/components/poster-card.tsx`)

- Nytt prop: `showRhetoric?: boolean`
- AnimatePresence för mjuk övergång
- RhetoricOverlay renderas ovanpå bilden i retorik-läge

### 3. Uppdaterad PosterGrid (`src/components/poster-grid.tsx`)

- Propagerar `showRhetoric` till alla PosterCard

### 4. AffischerClient (`src/app/affischer/affischer-client.tsx`)

- Ny klientkomponent som hanterar retorik-mode state
- Toggle-knapp "Retorik-läge" med ikon
- Visar RhetoricLegend när aktivt
- Berikar affischer med sample-retorik för demonstration
- Länk till ord-explorern när aktiv

### 5. Uppdaterad affischer-sida

- Server component behåller filter-logik
- Delegerar rendering till AffischerClient

## Designval

1. **Fragment istället för main** — AffischerClient använder `<></>` för att inte duplicera semantisk struktur

2. **Sample-data för demo** — `enrichWithSampleRhetoric()` lägger till retorik baserat på år och parti för att visa hur det skulle se ut med riktig data

3. **Färgkodning per tonläge** — Matchar rättighetsmodellens färgpalett (grönt för positiv, rött för dramatisk, etc.)

## Filer som ändrats/skapats

- `src/components/rhetoric-overlay.tsx` (ny)
- `src/components/poster-card.tsx` (uppdaterad)
- `src/components/poster-grid.tsx` (uppdaterad)
- `src/app/affischer/affischer-client.tsx` (ny)
- `src/app/affischer/page.tsx` (uppdaterad)

## Vad nästa person bör veta

1. **Riktig data:** Sample-retorik ersätts när Supabase har poster_curation-data med `tone`, `rhetorical_devices`, etc.

2. **Prestanda:** Med många affischer kan overlays påverka scroll-prestanda. Överväg virtualisering.

3. **Utbyggnad:** Kan lägga till filter för "visa bara hoppfulla" eller "sök retoriska grepp".

## Verifierat

- [x] TypeScript kompilerar utan fel
- [x] Build lyckas
- [x] Toggle fungerar i UI
- [x] Overlay visas på kort
