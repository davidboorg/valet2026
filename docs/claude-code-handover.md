# Claude Code prompt — Valaffischen, slutspurt inför demo

Du är Claude Code. Repo: `valaffischer/` (Next 16, Supabase, OpenSeadragon/IIIF, framer-motion). Demo nästa vecka. Det här dokumentet samlar **allt** som har gjorts i tidigare sessioner och **vad som är kvar** för att sajten ska kännas som en upplevelse på riktigt.

Läs först:
1. `AGENTS.md` (repo-regler, kampanj-vs-build-distinktionen)
2. `../design-prompt-valaffischer.md` (originaldesignspec — uppdaterad, se §A)
3. `docs/coverage-report.md` (vilka affischer som finns per parti × val)
4. `docs/granskning-2026-04-29-v2.md` (förra granskningens P0/P1/P2)

---

## A. Designriktning — uppdaterad

Originalspecens *museal restraint* gäller fortfarande, men paletten har ändrats:

- **Monokrom svart-vit.** Ingen terrakotta. Ingen blå (krockar med M/L/SD). Ingen gul. Hover-states använder `opacity` eller border, inte färgskift.
- **Inspiration: dataland.art.** Full-bleed sektioner. Stora italic display-rubriker. Datataglistor i monospace längs sektionsbottnar. Mörka sektioner ska kännas som utställningsrum, ljusa som arkivblad.
- **Brand: Valaffischen** (inte "Valaffischmuseet" — döpt om i alla 14 filer i förra sessionen).

### Tokens som finns i `src/app/globals.css`

```
--bg-primary: #FFFFFF
--bg-secondary: #F5F5F5
--bg-dark: #0A0A0A
--text-primary: #0A0A0A
--text-secondary: #666666
--text-tertiary: #999999
--text-inverse: #FFFFFF
--border: #E5E5E5
--border-strong: #0A0A0A
--accent: #0A0A0A          ← svart, inte terrakotta längre
```

### Typografiska klasser (också i globals.css)

`.display` `.h1` `.h2` `.h3` `.lead` `.body-text` `.meta` `.caption` `.editorial-quote`

Använd dessa, **inte** ad-hoc Tailwind som `font-[var(--font-playfair)] text-4xl md:text-5xl font-bold`.

### Sektionsklasser

- `.section-fullbleed` — `min-height: 100vh`, fullbredd
- `.section-fullbleed.dark` — svart bakgrund, vit text, automatisk kontrast på meta/caption
- `.data-tags` — flexbox-rad i monospace, för dataland-stil "01 · 02 · 03"-listor

### Typsnitt (i `layout.tsx`)

- **EB Garamond** (italic) för rubriker — pekar på `--font-playfair` så befintliga klasser fungerar
- **IBM Plex Sans** för brödtext — pekar på `--font-inter`
- **IBM Plex Mono** för citat och teknisk metadata — `--font-mono`

Allt gratis Google Fonts. Byt inte ut.

### Logotyp

`public/logotype/icon.svg` — affisch på käpp med vikt hörn, currentColor.
`public/logotype/wordmark.svg` — fullversion med ord + tagline.
Headern (`src/components/header.tsx`) använder inline-SVG av samma form.

### Motion assets (NY — använd dessa generöst)

`src/components/motion-assets.tsx` exporterar:
- `MotionPlakat` — affisch på käpp som driver lätt. För hero-sektioner.
- `MotionArkiv` — fyra sheets cyklar. För arkiv-/källmaterial-sektioner.
- `MotionDatapunkter` — scanning-beam + pulserande prickar. För AI-analys-sektioner.
- `MotionAssetsRow` — alla tre i rad med "01/02/03"-labels.

Ren CSS-animation, ingen JS. Stöder `prefers-reduced-motion`. Color via `currentColor` så de fungerar både ljust och mörkt.

---

## B. Vad som är klart

### Data & Supabase
- **61 affischer** i `src/lib/external-sources.ts` fördelade över 12 partier 1908-2022.
- Migrations 001-006 skapade. 003 öppnar schemat för icke-IIIF-källor. 004 seedar SD/M. 005 seedar alla partier. 006 rensar bort Piratpartiet/NSF.
- Täckningsmatris: se `docs/coverage-report.md`. SD bäst täckt (50%), KD/MP sämst (6-8%).
- Helper `src/lib/poster-image.ts` med `resolvePosterImage()` som föredrar lokal cache via `data/poster-manifest.json` om finns, annars extern URL.

### Verktyg som redan finns
- `scripts/download-posters.ts` — laddar ner alla externa bilder lokalt till `public/affischer/` så sajten inte beror på externa servrar live.
- `scripts/analyze-posters.ts` — Claude Vision-analys per affisch (transkriberad text, retoriska grepp, tonläge, visuella motiv).

### Hemsidan
- Skriven om till **5 fullbreddssektioner** (page.tsx):
  1. Editorial hero med MotionPlakat
  2. Featured grid (4-kol, första dubbelstor)
  3. Arkivet (mörk, MotionArkiv + 6 källor)
  4. AI-analys (MotionDatapunkter + länkar till /ord och /tonlage)
  5. Final CTA (mörk, *"Två kvadratmeter papper. Ett vallöfte. 130 år."*)

### Tidslinjen
- `src/app/tidslinje/page.tsx` byttes från KB-only till `getAllElectionPosters()` — sträcker sig nu **1908-2022** istället för att stanna 1951.
- Headern uppdaterad med editorial-stilen + datatag-rad.

### Header & Footer
- Header har ny logotyp (inline-SVG icon + "Valaffischen" wordmark + tagline)
- Footer säger "Valaffischen", inte gamla namnet

### Kod-kvalitet
- `npx tsc --noEmit` ren
- `npx eslint src/` 0 errors (5 kosmetiska warnings kvar)
- Alla P0-krasch-risker fixade (word-cloud, ord-page, mobile-nav, poster-viewer)

---

## C. Vad som är kvar — prioriterat

### P0 — Gör hela sajten konsekvent monokrom + editorial

Vissa sidor använder fortfarande gamla mönster (gradient bg-dark→bg-primary, `font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold`, terrakotta-accenter via `var(--accent)` som visserligen pekar på svart nu men där kontexten är fel).

**Sidor som behöver refactor:**

1. **`src/app/affischer/page.tsx`** + **`affischer-client.tsx`**
   - Headern är still gammal stil. Byt till `display`/`h1` editorial som tidslinjen.
   - Tom-state: använd mönstret från `word-cloud.tsx`s tomma state.
   - Ta bort eventuella `bg-gradient`-klasser.

2. **`src/app/affischer/[id]/page.tsx`** (detalsidan)
   - 60/40-splitten är OK, men metadata-panelen behöver editorial-typografi.
   - Lägg `MotionPlakat` i tom state om bild saknas.
   - Visa `RightsBadge` synligt på alla detalsidor.

3. **`src/app/ord/page.tsx`** + **`ord-explorer-client.tsx`**
   - Hero har gradient `from-bg-dark to-bg-primary` — byt till `section-fullbleed dark` + ren mörk.
   - Replace alla `text-7xl text-white` → `display`.
   - Empty-state finns redan i `word-cloud.tsx`, bra.
   - Lägg `MotionDatapunkter` som dekoration i hero.

4. **`src/app/tonlage/page.tsx`** + **`tonlage-client.tsx`**
   - Samma som ord-explorer. Stripa terrakotta. Editorial typografi.
   - **Mock-data-disclaimer:** `enrichWithSampleRhetoric()` i `lib/rhetoric-utils.ts` är hårdkodad. Lägg en synlig ribbon: *"AI-analys i utvecklingsfas — vissa tonlägen är preliminära"*. Eller kör `scripts/analyze-posters.ts` mot riktig data och eliminera mocken.

5. **`src/app/partier/page.tsx`** + **`partier/[slug]/page.tsx`**
   - Kortgriden använder partifärger på hover (`shadow-2xl`, `glow`, `blur-xl`). Allt detta bryter monokrom-direktivet — ta bort.
   - Aktiv tab i partifilter använder `party.color` — byt till `border-bottom: 2px solid currentColor` istället.
   - **Nationalsocialistiska Folkpartiet ska bort** om den fortfarande finns (togs bort i seed men kolla att hardcoded `parties`-arrayer i partier/page.tsx inte refererar den).

6. **`src/app/utstallningar/page.tsx`** + **`[slug]/page.tsx`**
   - Stripa terrakotta. Editorial-stil.

7. **`src/app/om/page.tsx`** + **`om/rattigheter/page.tsx`**
   - Bra kandidat för `MotionAssetsRow` — visa alla tre asseten en gång.
   - Rättighets-sidan ska tydligt förklara fyra statusen (`free | restricted | fair_use | unknown`).

### P0 — Fixa hero-cyklingen / döda gamla `animated-hero.tsx`

`src/components/animated-hero.tsx` finns kvar från tidigare estetik (parallax-cyklande hero). Den används inte på den nya hemsidan men risk att den används på `/affischer/[id]`. Antingen:
- Ta bort den helt om ingen importerar den
- Eller skriv om till monokrom utan parallax

```bash
grep -rn "animated-hero\|AnimatedHero" src/
```

### P0 — Footer

`src/components/footer.tsx`:
- Säger fortfarande "Bildmaterial: Public Domain Mark 1.0" — det är **falskt** så fort en post-1951-poster visas. Differentiera till "Materialet är blandat licensierat — se varje affisch för rättighetsstatus".
- Lägg en datatag-rad i footern: `Kungliga biblioteket · Wikimedia · Stockholmskällan · DigitaltMuseum · partiarkiv`

### P1 — Mer scroll-känsla

Hemsidan är 5 sektioner men inte *scrollytelling*. För att verkligen närma sig dataland:

1. **Sticky scroll på arkiv-sektionen.** När man scrollar genom Arkivet-sektionen ska titlarna i datatag-listan animera in en åt gången baserat på scroll-position. Använd framer-motions `useScroll` + `useTransform`.
2. **Hero pinned + zoom-out.** När man scrollar nedåt från hero ska MotionPlakat pulsera/pinas en sekund innan resten av sidan tar över.
3. **AI-analys-sektionen:** låt MotionDatapunkter:s prickar lysa upp i takt med att man scrollar in i sektionen.
4. **Final CTA:** italic *"Två kvadratmeter papper..."* ska skrivas ut bokstav för bokstav när den scrollar in (typewriter-effekt eller stagger fade).

### P1 — Fix tonläge mock-data

`src/lib/rhetoric-utils.ts:22-23` har hardcoded:
```
SD 2010-2025 → tone: 'hotande'
M 2006-2015 → tone: 'hoppfull'
```

Kör `npx tsx scripts/analyze-posters.ts` mot riktig data så `/tonlage` faktiskt baseras på Claude Visions analys. Om scriptet kör OK ska `enrichWithSampleRhetoric()` ersättas med direkt DB-läsning av `poster_curation.tone`.

### P1 — Bilder lokalt

`scripts/download-posters.ts` finns. Kör en gång:
```bash
npx tsx scripts/download-posters.ts
```
Det laddar ner alla 61 externa bilder till `public/affischer/` och skriver `data/poster-manifest.json`. Sedan resolvar `src/lib/poster-image.ts` automatiskt lokalt i stället för externt — sajten blir oberoende av att Wikimedia/affischerna.se/Stockholmskällan svarar live.

### P1 — Mobile

- Verifiera att hamburger-knappen i `header.tsx` faktiskt öppnar `mobile-nav.tsx` (anslutningen är otydlig)
- `MotionPlakat` etc. fungerar i mobil men kan behöva kollas på smala skärmar
- `/ord` och `/tonlage` är skrivbordsdesign — gör en egen mobil-flöde med fullskärms-vyer

### P2 — Innehåll & SEO

- Per-affisch OG-bild som *är affischen* via `next/og`
- JSON-LD `VisualArtwork` schema
- Slug-baserade URL:er (`/affischer/kosackvalet-1928`)
- 404-sida som matchar editorial-stilen

### P2 — Performance

- ISR `export const revalidate = 86400` på alla server components
- `generateStaticParams` på `/affischer/[id]` för topp 200
- A11y-audit av kontrast (border `#E5E5E5` mot vit är 1.15:1 — för låg, höj till `#D4D4D4`)

---

## D. Hårda regler (bryt inte)

1. **Ingen färg i UI:t.** Inte ens "bara liiite". Affischerna har all färg, UI:t har svart-vit-grå.
2. **Använd typografiska klasserna `.display`/`.h1`/`.h2`/`.h3`/`.lead`/`.meta`/`.caption`** — inte ad-hoc Tailwind på rubriker.
3. **Hover-effekter = opacity eller border**, inte färgskifte.
4. **Inga shadows.** `shadow-sm`, `shadow-lg`, `shadow-2xl`, `drop-shadow-*`, `blur-*` — sök/ersätt → `border border-[var(--border-strong)]`.
5. **Inga rounded corners utöver `rounded-sm` (2px)**. Ingen `rounded-full`, ingen `rounded-lg`.
6. **Använd `MotionPlakat`/`MotionArkiv`/`MotionDatapunkter`** istället för att hitta på nya hover-animationer.
7. **Editorial copy.** Inga "Utforska", "Upptäck", "Ta del av". Skriv specifikt: *"Bläddra i samlingen"*, *"Stig in"*, *"Följ tidslinjen"*.
8. **Asymmetriska grids.** 7+4, 5+6, 8+3. Centrerade hero är förbjudet utom när designen explicit kräver det (final CTA är OK).

---

## E. Verifieringskommandon

Efter varje större delleverans:

```bash
cd valaffischer
npx tsc --noEmit                         # måste vara ren
npx eslint src/                          # 0 errors, warnings OK
npm run build                            # bygg-tid + ev. build-fel
npm run dev                              # öppna localhost:3000 manuellt
```

Smoke-test följande URL:er manuellt:
- `/` (hemsidan, scroll genom alla 5 sektioner)
- `/affischer` (samlingen, filter)
- `/affischer/[första-id]` (detalsidan, deep zoom)
- `/tidslinje` (hela 1908-2022 ska synas)
- `/partier` + `/partier/socialdemokraterna`
- `/ord` (ord-explorer)
- `/tonlage` (tonlägespektrum)
- `/om` + `/om/rattigheter`
- Mobil 375px bredd

---

## F. Leveransordning för en lyckad demo nästa vecka

**Dag 1 (4 timmar):**
1. Refaktorera `/affischer`-sidan till editorial-stil (P0 §1)
2. Refaktorera `/affischer/[id]`-detalsidan (P0 §2)
3. Kör `download-posters.ts` så sajten är oberoende av externa servrar
4. Kontrollera att alla sidor laddar utan errors

**Dag 2 (4 timmar):**
5. Refaktorera `/ord` + `/tonlage` (P0 §3-4)
6. Kör `analyze-posters.ts` så `/tonlage` har riktig data
7. Refaktorera `/partier` (P0 §5)
8. Mobil-genomgång (P1)

**Dag 3 (3 timmar):**
9. Lägg till scroll-driven motion på hemsidan (P1)
10. Footer-fix + final smoke-test
11. Skapa `docs/decisions/handover-after-demo.md` med vad nästa person bör veta

---

## G. Om något bryter

- **Build failar på framer-motion:** Kolla att `'use client'` finns på alla komponenter som använder `motion.*`.
- **Bilder rendrar inte:** Kolla `next.config.ts` `images.remotePatterns` — alla domäner som `external-sources.ts` använder måste finnas där. Just nu: `data.kb.se`, `affischerna.se`, `upload.wikimedia.org`, `www.sd.se`, `sd.se`, `moderaterna.se`, `da.se`, `media.arto.se`, `dagensopinion.se`, `static.bonniernews.se`, `ems.dimu.org`, `stockholmskallan.stockholm.se`, `live.staticflickr.com`.
- **TypeScript-error på `--font-mono`-import:** layout.tsx behöver `IBM_Plex_Mono` importerad från `next/font/google`.
- **ESLint röd:** Alla `react/no-unescaped-entities` fixar du med `&ldquo;`/`&rdquo;` istället för `"`.

---

## H. Filer ändrade i föregående session (kontext)

```
src/app/layout.tsx                       — typografi (Inter→IBM Plex Sans, Playfair→EB Garamond)
src/app/globals.css                      — monokrom palett + typografisk skala + section-fullbleed + data-tags
src/app/page.tsx                         — fullständig omskrivning till 5 dataland-stil-sektioner
src/app/tidslinje/page.tsx               — bytt till getAllElectionPosters, editorial header
src/app/ord/page.tsx                     — guard mot tom data + escape quotes
src/components/header.tsx                — ny logotyp wordmark + tagline + monokrom hover
src/components/footer.tsx                — Valaffischen-namn
src/components/motion-assets.tsx         — NY fil: MotionPlakat/Arkiv/Datapunkter
src/components/word-cloud.tsx            — guard tom state + escape
src/components/mobile-nav.tsx            — useRef + queueMicrotask för setState-cascading
src/components/poster-viewer.tsx         — eslint-disable för OpenSeadragon-sync
src/components/timeline-scrollytelling.tsx — rensade oanvända imports
src/components/vertical-timeline.tsx     — rensade oanvänd useRef
public/logotype/icon.svg                 — NY: ikon med vikt hörn
public/logotype/wordmark.svg             — NY: fullversion
public/logotype/mark.svg                 — NY: monogram-stämpel (alternativ)
src/lib/external-sources.ts              — 14 nya verifierade affischer (Stockholmskällan, Wikimedia, affischerna.se)
src/lib/poster-image.ts                  — NY: resolvePosterImage() med manifest-fallback
scripts/download-posters.ts              — NY: ladda ner alla externa bilder
supabase/migrations/006_clean_and_extend.sql — ta bort PP/NSF + lägg till nya
```

Lycka till. Bryt inte de hårda reglerna i §D. Skriv `docs/decisions/<datum>-<topic>.md` för varje icke-trivial vägval.
