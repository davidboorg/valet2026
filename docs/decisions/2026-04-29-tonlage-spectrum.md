# B3.3: Tonläge-spectrum visualisering

**Datum:** 2026-04-29
**Status:** Implementerad

## Vad jag byggde

### 1. ToneSpectrum-komponent (`src/components/tone-spectrum.tsx`)

- Interaktiv visualisering av tonlägesfördelning
- Tre vylägen: Överblick, Per årtionde, Per parti
- Klickbara tonlägesindikatorer med detaljbeskrivning
- Animerad spectrum-bar med proportionella segment
- Stacked bar charts för decade/party-vyerna
- Legend med färgkodning

### 2. Delad rhetoric-utils (`src/lib/rhetoric-utils.ts`)

- Flyttade `enrichWithSampleRhetoric()` hit för server-kompatibilitet
- Utökade sample-data med fler partier och decennier
- Fallback-logik för affischer utan explicit matchning

### 3. Tonläge-sida (`src/app/tonlage/`)

- Server component (`page.tsx`) — hämtar data, berikar med retorik
- Client component (`tonlage-client.tsx`) — renderar ToneSpectrum
- Revalideras varje timme
- Statistikfält: antal analyserade, antal tonlägen, antal årtionden
- Kontextsektion som förklarar analysen
- Länkar till relaterade features (ord-explorer, samlingen)

### 4. Navigation

- Lade till "Tonlägen" länk i header (accent-färg som Ord-explorer)

## Designval

1. **Spectrum-ordning** — Tonlägen ordnas från konfrontativt (upprorisk) till lugnt på x-axeln
2. **Sample-data för demo** — Utökade retorik-mappningar täcker alla decennier och fler partier
3. **Server-client split** — `enrichWithSampleRhetoric` i lib/ för att kunna köras på servern
4. **Interaktivitet** — Klicka på tonläge för detaljbeskrivning

## Filer som ändrats/skapats

| Fil | Typ |
|-----|-----|
| `src/components/tone-spectrum.tsx` | Ny |
| `src/lib/rhetoric-utils.ts` | Ny |
| `src/app/tonlage/page.tsx` | Ny |
| `src/app/tonlage/tonlage-client.tsx` | Ny |
| `src/components/rhetoric-overlay.tsx` | Uppdaterad (re-export) |
| `src/components/header.tsx` | Uppdaterad (ny länk) |

## Vad nästa person bör veta

1. **Riktig data:** Sample-retorik ersätts när Supabase har poster_curation-data med riktiga tonlägesanalyser

2. **AI-integration:** Kan kopplas till Claude/GPT för automatisk tonlägesklassificering

3. **Utbyggnad:**
   - Lägg till drill-down: klicka på segment för att visa affischer med det tonläget
   - Jämförelse: välj två partier eller decennier att jämföra
   - Export: ladda ner data som CSV

## Verifierat

- [x] TypeScript kompilerar utan fel
- [x] Build lyckas
- [x] Tre vylägen fungerar
- [x] Animationer är smidiga
- [x] Länk i header fungerar
