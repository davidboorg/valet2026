# Handover efter demo — 2026-04-30

Detta dokument sammanfattar vad som gjorts under sprinten 28–30 april och vad nästa person behöver veta.

---

## Vad som slutförts

### Dag 1 — Affischsidor
- `/affischer` refaktorerad till editorial hero med asymmetriskt 7+4 grid
- `/affischer/[id]` detalsida med MotionPlakat för tom-state
- `download-posters.ts` kördes — 35/45 bilder nedladdade, 10 Wikimedia-bilder fick HTTP 429

### Dag 2 — Analys + partier + mobil
- `/ord` + `/tonlage` refaktorerade till dark editorial hero med MotionDatapunkter
- `/partier` monokrom utan shadows/accents/scale-transforms
- `analyze-posters.ts` kördes — ~40 av 50 affischer analyserade med Claude Vision (parti, transkription, confidence)
- Mobilnavigation fixad: bort med shadows, rounded corners, accent-färger

### Dag 3 — Scroll-motion + footer
- Scroll-driven motion på hemsidan:
  - `HeroScroll`: MotionPlakat fadear ut med parallax vid scroll
  - `StaggeredDataTags`: datatags animerar in en efter en
  - `FadeInSection`: element fadear in vid scroll-in-view
  - `TypewriterText`: ord-för-ord på final CTA
  - `ScrollLinkedMotion`: motion assets intensifieras vid scroll
- Footer: datatags-rad med källor, monokrom stil, korrekt rättighetsinfo

---

## Commits (kronologisk)

```
bf1482b refactor(ord): editorial dark hero + monokrom filter UI
d7db3de refactor(tonlage): dark editorial hero + AI-disclaimer
aac40b0 refactor(partier): monokrom editorial layout
898ac0a fix(mobile): monokrom navigation och drawer
80c484b feat(home): scroll-driven motion effects
28e8a80 fix(footer): monokrom stil + datatags + korrekt rättighetsinfo
```

---

## Viktiga filer som skapats/ändrats

### Nya filer
- `src/components/home-scroll-effects.tsx` — scroll-motion utilities (HeroScroll, StaggeredDataTags, etc.)
- `src/components/home-client.tsx` — klient-wrapper för hemsidan med alla scroll-effekter
- `docs/decisions/2026-04-30-handover-after-demo.md` — detta dokument

### Större ändringar
- `src/app/page.tsx` — använder nu HomeClient istället för ren server component
- `src/app/ord/page.tsx` + `ord-explorer-client.tsx` — dark editorial hero
- `src/app/tonlage/page.tsx` — dark editorial hero + AI-disclaimer
- `src/app/partier/page.tsx` — monokrom cards, bort med shadows
- `src/components/header.tsx` — border-baserad aktiv-stil
- `src/components/mobile-nav.tsx` — monokrom drawer utan shadows
- `src/components/footer.tsx` — datatags + korrekt rättighetsinfo

---

## Kvarstående arbete

### P0 — Måste göras före lansering
1. **Resterande Wikimedia-bilder** — 10 bilder fick HTTP 429. Vänta och kör `download-posters.ts` igen, eller lägg till retry-logik.
2. **Verifiera AI-analysen** — kolla att `poster_curation`-tabellen har korrekt data för `/tonlage`.
3. **Smoke-test alla sidor** manuellt på desktop och mobil.

### P1 — Bra att ha
1. **`/utstallningar` + `/om`** — refaktorera till monokrom editorial stil (inte gjort i sprinten).
2. **Per-affisch OG-bild** via `next/og` för delning på sociala medier.
3. **JSON-LD VisualArtwork schema** för SEO.
4. **A11y-audit** — border `#E5E5E5` mot vit är 1.15:1 kontrast, för låg.

### P2 — Framtida förbättringar
1. **ISR med `generateStaticParams`** för top 200 affischer.
2. **Slug-baserade URL:er** (`/affischer/kosackvalet-1928` istället för ID).
3. **404-sida** i editorial stil.

---

## Designregler att följa

Dessa regler är dokumenterade i `docs/claude-code-handover.md` §D:

1. **Ingen färg i UI** — affischerna har all färg, UI:t är svart-vit-grå
2. **Typografiska klasser** — `.display`, `.h1`, `.h2`, `.h3`, `.lead`, `.meta`, `.caption`
3. **Hover = opacity eller border** — ingen färgändring
4. **Inga shadows** — `shadow-*` ersätts med `border border-[var(--border-strong)]`
5. **Inga rounded > sm** — ingen `rounded-lg`, `rounded-full`
6. **Asymmetriska grids** — 7+4, 5+6, 8+3 (aldrig centrerad hero)
7. **Editorial copy** — "Bläddra i samlingen", inte "Utforska"

---

## Hur du kör projektet

```bash
cd valaffischer
npm install
npm run dev
# http://localhost:3000
```

### Verktyg
```bash
# Ladda ner externa bilder lokalt
npx tsx scripts/download-posters.ts

# Kör AI-analys av affischer (kräver ANTHROPIC_API_KEY i .env.local)
eval "$(grep -v '^#' .env.local | sed 's/^/export /')" && npx tsx scripts/analyze-posters.ts
```

### Verifiering
```bash
npx tsc --noEmit          # måste vara ren
npx eslint src/           # 0 errors
npm run build             # kontrollera build-tid
```

---

## Kontext för kampanjarbete

Repot har två parallella workstreams (se `AGENTS.md`):

1. **Build** — Next.js-appen (det som gjorts i sprinten)
2. **Campaign** — organisk social media maj–september 2026

Kampanjen använder samma data men opererar under strikta legala ramar (EU 2024/900, SFS 2025:1408). Läs `../kampanj-prompt-valaffischer.md` innan du arbetar med kampanjinnehåll.

---

*Dokument skapat 2026-04-30 av Claude Opus 4.5*
