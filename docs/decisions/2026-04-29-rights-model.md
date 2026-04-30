# B1: Rättighetsmodell i UI

**Datum:** 2026-04-29
**Status:** Implementerad

## Vad jag byggde

### 1. Utökad RightsBadge-komponent (`src/components/rights-badge.tsx`)
- Stöd för fyra rättighetsnivåer: `free`, `restricted`, `fair_use`, `unknown`
- Ny `RightsInfo`-komponent för detaljsidor med full information
- Ny `RightsIndicator` för kompakt visning i grids
- Färgkodning enligt design-prompt (grönt, amber, brunt, grått)

### 2. Uppdaterad Footer (`src/components/footer.tsx`)
- Differentierad rättighetsinformation istället för "Public Domain Mark 1.0"
- Förklarar de tre huvudkategorierna med färgkodning
- Länk till rättigheter-sidan

### 3. Ny sida: /om/rattigheter (`src/app/om/rattigheter/page.tsx`)
- Förklarar de fyra rättighetsstatusarna
- Listar alla källor (KB, partiarkiv, Wikimedia, mediaarkiv)
- Användningsriktlinjer för forskning, utbildning, kommersiell användning
- Attribution-format

### 4. Uppdaterade typer (`src/lib/types.ts`)
- `RightsStatus` typ exporterad: `'free' | 'restricted' | 'fair_use' | 'unknown'`
- Nya fält på Poster: `rightsNote`, `slogan`, analys-fält

### 5. External sources (`src/lib/external-sources.ts`)
- `media_archive`-källor defaultar nu till `fair_use`
- Stöd för `rightsNote` och `slogan`
- SD 2014 och M 2010/2014 markerade som `fair_use` med §23-not

## Vad jag valde bort
- Dynamisk footer baserad på visad sidas material (komplexitet vs värde)
- API-endpoint för rättighetsinformation (statiska data räcker för nu)
- Rights audit-loggning (kan läggas till senare)

## Vad nästa person bör veta
1. Affisch-detaljsidan (`/affischer/[id]/page.tsx`) behöver uppdateras för att använda `RightsInfo` istället för enkel `RightsBadge` + manuell attribution
2. När Supabase-data flödar (B2) kommer `rightsStatus` från databasen
3. §23-texten är korrekt men bör verifieras av jurist innan publik launch
4. Färgerna matchar design-promptens "döva" versioner för integration i paletten

## Filer som ändrats
- `src/components/rights-badge.tsx` (utökad)
- `src/components/footer.tsx` (uppdaterad)
- `src/app/om/rattigheter/page.tsx` (ny)
- `src/lib/types.ts` (utökad)
- `src/lib/external-sources.ts` (uppdaterad)
