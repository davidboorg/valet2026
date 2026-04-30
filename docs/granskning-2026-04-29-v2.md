# Granskning v2 — Valaffischmuseet

_2026-04-29. Tre parallella granskningar (visuell identitet, kod-kvalitet, UX/copy) har gjorts. Detta är syntesen och åtgärdsplanen._

## Sammanfattande dom

Sajten är **inte trasig**, den är **generic**. Den har rätt palett, rätt grid, rätt arkitektur. Men typografin är överanvänd Inter+Playfair, det finns ingen logotyp, copyn använder ord som "Utforska" och "Upptäck" som inget museum skulle använda, och en handfull P0-buggar gör att t.ex. ord-explorern kraschar på tom data.

Jag har redan i denna runda gjort:
1. Bytt typografin till **EB Garamond** (italic-rubriker) + **IBM Plex Sans** (brödtext) + **IBM Plex Mono** (citat/teknisk metadata) — alla gratis Google Fonts, men med museal viktning.
2. Skapat **två logotyper** (wordmark + monogram) som SVG i `public/logotype/`.
3. Bytt headern att använda wordmark-stilen med italic + accentlinje + årtalsbyline.
4. Lagt till **typografisk skala-tokens** i `globals.css` (`.display`, `.h1`, `.h2`, `.h3`, `.lead`, `.body-text`, `.meta`, `.caption`, `.editorial-quote`).
5. Fixat alla **P0-krasch-risker** (word-cloud Math.max, ord-page Math.min, mobile-nav setState-loop, poster-viewer disable comment).
6. Rensat oanvända imports och unescaped quotes.

ESLint är nu på **0 errors** (från 16) och TS är ren.

---

## P0 — kvar att fixa innan demo

### V.1 Typografi — applicera nya skala-klasserna på sidornas rubriker

De nya CSS-klasserna är på plats men sidorna använder fortfarande hardkodade Tailwind-klasser. Sök/ersätt:

| Sök | Ersätt med |
|---|---|
| `font-[var(--font-playfair)] text-4xl md:text-5xl font-bold` | `h1` |
| `font-[var(--font-playfair)] text-3xl md:text-4xl font-bold` | `h2` |
| `font-[var(--font-playfair)] text-2xl md:text-3xl font-bold` | `h3` |
| `text-lg text-[var(--text-secondary)]` | `lead` |
| `text-xs uppercase tracking-[0.15em]` | `meta` |

Filer som mest behöver det: `src/app/page.tsx`, `src/app/affischer/page.tsx`, `src/app/affischer/[id]/page.tsx`, `src/app/tidslinje/page.tsx`, `src/app/partier/page.tsx`, `src/app/ord/page.tsx`, `src/app/tonlage/page.tsx`.

### V.2 Hero-copy är en vag "ett digitalt museum"

`src/components/animated-hero.tsx:151` säger:

> *Utforska 130 år av politisk kommunikation. Zooma in på detaljer som berättar historien om svensk demokrati.*

Byt till:

> *Två kvadratmeter papper. Ett vallöfte. 130 år av tävlan om din uppmärksamhet — från Per Albins folkhem till SD:s "inget snack". Detta är affischerna som formade Sverige.*

Det är specifikt, det har en hook ("två kvadratmeter papper"), det namnger ett konkret minne från båda yttre flanker.

### V.3 "Utforska samlingen" som CTA är generisk

Genomgående används "Utforska". Byt:

| Var | Idag | Föreslag |
|---|---|---|
| `page.tsx:266` | "Utforska samlingen" | "Bläddra i samlingen" |
| `page.tsx:331` | "Börja utforska" | "Stig in i samlingen" |
| Hero CTA | "Utforska samlingen" | "Se affischerna" |
| `partier/page.tsx` | "Utforska efter" | "Genom" — eller bara ta bort etiketten |

### V.4 Citat på hemsidan är en truism

`src/app/page.tsx:233-235`:

> *"Innan radio, TV och internet var affischen det främsta mediet för politisk kommunikation."*

Det säger inget. Byt till något specifikt:

> *"Affischen 1928 anklagade Per Albin för att vara kosack. Affischen 1991 lovade att brottslingar ska sitta inne. Affischen 2022 sa 'inget snack'. Mediet skiftar form. Tonen är mer ihärdig."*

Det är en bättre öppning till sajten — tre konkreta exempel som täcker tidsspannet.

### V.5 Empty states är generiska

Jag har lagt en bra tom state i `word-cloud.tsx`. Replikera mönstret för:
- `/tonlage` när `tone`-data saknas
- `/affischer?year=1991` när inga poster finns för året
- `/partier/[slug]` när partiet inte har affischer i samlingen

Mönster: `meta`-etikett ovanför, `editorial-quote` med kuratoriell mening, `caption` med teknisk hint.

---

## P1 — synligt amatörmässigt (men inte demoblockerande)

### K.1 Footer säger fel om rättigheter

`src/components/footer.tsx` säger fortfarande "Bildmaterial: Public Domain Mark 1.0". Det är **falsk** så fort en post-1951-poster visas. Differentiera per affisch eller säg "Materialet är blandad licensierat — se varje affisch för exakt rättighetsstatus."

### K.2 KB-API anropas på varje sidladdning

`src/app/page.tsx`, `src/app/affischer/page.tsx`, `/tidslinje/page.tsx` kör alla `getAllElectionPosters({ limit: 300 })` synkront utan ISR-cache. Lägg `export const revalidate = 86400;` överst i alla server components.

### K.3 Drop-shadows mot designspec

Designspec säger "inga mjuka skuggor". Ändå har:
- `src/components/poster-card.tsx` `shadow-sm group-hover:shadow-xl`
- `src/app/page.tsx` `drop-shadow-2xl`, `blur-xl`
- `src/components/year-cluster.tsx` `shadow-lg` på tooltip

Sök/ersätt: `shadow-` → ta bort, eller byt till `border border-[var(--border-strong)]` vid hover.

### K.4 Hamburgermeny: visuellt korrekt men anslutningen är subtil

`MobileNav` är importerad i `header.tsx` men det är inte uppenbart från koden att hamburger-knappen är bunden till open-state. Lägg en kommentar och säkerställ att `aria-controls` pekar rätt.

### K.5 Spacing-tokens används inte konsekvent

CSS har `--space-xl`, `--space-2xl` definierade, men sidorna använder `py-24`, `py-32` ad hoc. Skapa `.section-spacing` i globals.css:

```css
.section-spacing { padding-block: var(--space-xl); }
@media (min-width: 768px) {
  .section-spacing { padding-block: var(--space-2xl); }
}
```

Ersätt all `py-24/py-32` → `section-spacing`.

---

## P2 — efter demo

- Webfont-preload via `<link rel="preload">` i layout.tsx
- ISR + `generateStaticParams` på `/affischer/[id]` för topp 200
- JSON-LD `VisualArtwork` schema per affisch
- OG-bilder via `next/og` som *är* affischen
- A11y-audit (kontrast på `--text-secondary` är gränsfall mot WCAG AA)
- Bundle-size — framer-motion + recharts är tunga

---

## Konkret sak du kan göra på 30 minuter

1. **Refactor 5 sidor till nya h1/h2/h3-klasser** — sök/ersätt enligt V.1.
2. **Byt hero-copy** enligt V.2.
3. **Byt 4 CTA-knappar** enligt V.3.
4. **Byt hemsidans citat** enligt V.4.
5. **Lägg `revalidate = 86400`** på 3 server components.

Då har sajten gjort ett rejält kvalitetshopp utan att du har ändrat arkitekturen.

---

## Vad som är *briljant* idag (behåll)

- IIIF deep-zoom — det är sajtens unika tekniska fingeravtryck.
- Den nya logotypen + typografin — museal, inte SaaS.
- Coverage-rapporten + täckningsmatrisen — pedagogiskt ärlig.
- Den varma neutrala paletten + terrakotta-accenten.
- Att luckorna i materialet redovisas öppet istället för att gömmas.

---

## Filer ändrade i denna runda

```
src/app/layout.tsx              ← bytte font-familjer (Inter+Playfair → IBM Plex Sans + EB Garamond + IBM Plex Mono)
src/app/globals.css             ← typografisk skala (--type-display, --type-h1..h3, .display/.h1/.h2/.h3/.lead/.meta/.caption/.editorial-quote)
src/components/header.tsx       ← logotyp-wordmark med italic, accentlinje, årtalsbyline
public/logotype/wordmark.svg    ← stand-alone SVG-logotyp
public/logotype/mark.svg        ← monogram-version
src/components/word-cloud.tsx   ← guard mot tom data + tom-state UI + fixade quotes
src/app/ord/page.tsx            ← guard mot Math.min av tom array + fixade quotes
src/app/page.tsx                ← fixade quotes
src/components/mobile-nav.tsx   ← fixade setState-cascading-render via useRef + queueMicrotask
src/components/poster-viewer.tsx ← legitim eslint-disable för OpenSeadragon-sync + tog bort oanvänd err
src/components/timeline-scrollytelling.tsx ← rensade oanvända imports
src/components/vertical-timeline.tsx ← rensade oanvänd useRef
```

Test: `npx tsc --noEmit` ren. `npx eslint src/` 0 errors, 5 kvarvarande warnings (alla kosmetiska, inga demoblockerare).
