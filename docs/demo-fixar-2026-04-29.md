# Demo-fixar inför stakeholder-möte nästa vecka

Granskningen hittade ett antal saker som kommer få sajten att se trasig ut framför externa intressenter. Detta dokument är prioriterat: P0 = måste fixas, P1 = stor synlig polish, P2 = kan vänta.

## Sammanställd lista — totalt ~25 P0/P1-fynd från tre parallella granskningar

### P0 — MÅSTE fixas innan demo

**Crash-risker (rena demoblockerare):**

1. **`src/components/word-cloud.tsx:51`** — `Math.max(...words.map(w => w.value))` crashar om `words` är tom.
   *Fix:* `Math.max(...words.map(w => w.value), 1)` eller `if (!words.length) return null`.

2. **`src/app/ord/page.tsx:34`** — `Math.min(...enrichedPosters.filter(p => p.year).map(p => p.year!))` ger `NaN`/spread-error om ingen poster har year.
   *Fix:* Guard: `const years = enrichedPosters.filter(p => p.year).map(p => p.year!); const minYear = years.length ? Math.min(...years) : 1900;`.

3. **`src/components/mobile-nav.tsx:35`** — `setIsOpen(false)` direkt i useEffect-body. ESLint flaggar som cascading-render-risk. Tre useEffects manipulerar samma state.
   *Fix:* Slå ihop till en useEffect, eller använd ref för att tracka pathname-byte.

4. **`src/components/poster-viewer.tsx:26`** — Samma setState-i-effect-problem.
   *Fix:* Sätt `isLoading` initialt baserat på prop istället för i useEffect.

5. **`src/app/affischer/page.tsx:76`** (paginering) — `Math.ceil(0/24) = 0` ger "Sida 1 av 0".
   *Fix:* `const totalPages = Math.max(1, Math.ceil(allElectionPosters.length / limit))`.

**Förbjudna färger (bryter designspec direkt):**

6. **`src/components/word-cloud.tsx:23`** + **`src/app/partier/[slug]/page.tsx:113`** — `#DDDD00` (gult) används för Sverigedemokraterna. Designspec: "INGEN GUL".
   *Fix:* Byt SD:s färg till `#1B4F72` (deras egen blå räknas inte i UI:t — använd terrakotta `var(--accent)` eller dämpad neutral istället).

7. **`src/app/page.tsx:115-116`** — `drop-shadow-2xl` blå glow med `#52BDEC` på Moderaterna. Designspec: "INGEN BLÅ".
   *Fix:* Ta bort glow-effekten helt, eller byt till `drop-shadow-sm` + neutral grå.

8. **`src/components/party-filter-tabs.tsx:86-89`** — Aktiva tabbar använder `backgroundColor: party.color` (röd, blå, gul). Designspec: "Inga partifärger som UI-element".
   *Fix:* Byt till `var(--accent)` för alla aktiva states. Behåll partifärgen bara som tunn 2px-bottom-border om något.

9. **`src/components/tone-spectrum.tsx:34, 39`** — Tonläge-färger råkar vara identiska med S (`#E8112D`) och M (`#52BDEC`). Skapar visuell sammanblandning mellan partifärg och tonanalys.
   *Fix:* Använd dämpade jordfärger för tonläge-skalan: t.ex. `#9B6B5F` (varm), `#5F7B6E` (sval), `#8B4049` (intensiv).

**Mock-data som ser riktig ut:**

10. **`src/app/tonlage/page.tsx`** + **`src/lib/rhetoric-utils.ts:22-23`** — `enrichWithSampleRhetoric()` sätter konstant `tone: 'hotande'` på alla SD-affischer 2010-2025 och `tone: 'hoppfull'` på Moderaterna 2006-2015. Det är inte verklig analys — det är hårdkodade regler som *ser ut* som AI.
    *Fix:* Antingen kör `scripts/analyze-posters.ts` mot riktiga data INNAN demon, eller lägg en synlig disclaimer "Demo-data: AI-analys pågår" på sidan. Om mock-data behålls — döp om funktionen från `enrichWithSampleRhetoric` till `applyMockRhetoricForDemo` så det är obvious i koden.

11. **Tidslinjen filtrerar bort 55% av seedat material:**
    `/tidslinje/page.tsx:115-120` filter `(p) => p.thumbnailUrl && p.year` döljer SD/M-poster som har `imageUrl: ''`. Migration 004 seedade 20 poster, bara ~9 har bilder.
    *Fix:* Antingen visa platshållarkort med slogan + årtal, eller exkludera bildlösa poster från statistikräkning så header inte säger "55 affischer" när bara 27 visas.

**Synligt felaktig statistik:**

12. **`src/app/affischer/page.tsx:145`** + **`src/app/page.tsx`** — Header säger `{allElectionPosters.length} valaffischer` men det inkluderar de filtrerade-bort poster. Räkningen och griden mismatchar.
    *Fix:* Använd `getAllExternalPosters()` (filtrerad) för båda räkningen och griden, eller lägg synligt "X visas av Y dokumenterade".

### P1 — Synligt amatörmässigt

13. **`src/components/word-cloud.tsx:62-63`** — Sortering på 120 ord kan blockera huvudtråden. Om demon visas på en svag laptop = 1-2 sek vit skärm.
    *Fix:* `useDeferredValue` eller flytta sortering till server.

14. **`src/components/tone-spectrum.tsx:83`** — `total = posters.filter(p => p.tone).length || 1` skapar fake 100% när ingen tone finns. Visar "100% hoppfull 1990-talet".
    *Fix:* `if (total === 0) return <EmptyState>Tonlägesdata kommer i nästa sprint</EmptyState>`.

15. **Hero-sektionen (`src/app/page.tsx`)** — för många konkurrerande sektioner (parallax, decennie-scroll, grid, pull-quote, deep-zoom-teaser, dual-CTA). Designspec sa "asymmetri och restraint" — det här är max-stack.
    *Fix för demo:* Klipp parallaxen i decennie-scrollen och ta bort dual-CTA längst ner. Spara två sektioner: hero + grid.

16. **`src/app/page.tsx:5`** — `ParallaxImage` importerad men oanvänd.
    *Fix:* Ta bort import.

17. **Drop-shadows överallt** — `drop-shadow-2xl`, `shadow-lg`, `shadow-2xl` på flera ställen (page.tsx, year-cluster, word-cloud tooltip). Designspec: "inga mjuka skuggor + rundade kort".
    *Fix:* Sök/ersätt `shadow-2xl` → `shadow-none border border-[var(--border)]`. Behåll skarp linje istället för mjuk skugga.

18. **`src/components/year-cluster.tsx:44`** — `rounded-full` på partibadges. Spec säger max `rounded-sm`.
    *Fix:* `rounded-sm`.

19. **Centrerade hero/CTA på flera sidor** — `/page.tsx:331`, `/affischer/affischer-client.tsx:126`. Spec säger "asymmetri".
    *Fix:* För demo: behåll centrerat på `/`, men gör `/ord` och `/tonlage` asymmetriska — flytta rubrik till vänster, panel till höger.

20. **Konsole-loggning i prod-kod** — `console.error` i `/tidslinje/page.tsx:21, 36, 60`.
    *Fix:* Ersätt med `if (process.env.NODE_ENV === 'development') console.error(...)` eller skicka till logger.

21. **Hamburger-knappen i headern** är inte ansluten till `MobileNav`. På mobil händer ingenting när man trycker.
    *Fix:* Verifiera kopplingen i `header.tsx:55` mot `mobile-nav.tsx`. Annars är hela mobil-flödet brutet.

22. **`affischerna.se`-poster** har URL:er som pekar på sidsökvägar, inte bildfiler. Dessa kommer rendera som broken images.
    *Fix:* Verifiera varje URL i `AFFISCHERNA_POSTERS`. Ta bort eller ersätt URL:er som inte är direktlänkar till `.jpg`.

### P2 — Efter demo

23. KB API utan rate-limiting / cache-lager. Risk för att slå ihjäl KB:s API om många besöker samtidigt.

24. Ingen `generateStaticParams` på `/affischer/[id]` — alla detaljsidor är dynamiska. Långsamt vid demo.

25. OG-bilder per affisch genereras inte. Delningar blir generiska.

---

## Snabb fix-prioritering inför demon

Om du har 2 timmar:
- Fixa #1, #2, #3, #5, #6, #7 (krasch-skydd + förbjudna färger).
- Lägg disclaimer på `/tonlage` och `/ord` om mock-data (#10).
- Slå av parallaxer på hemsidan (#15).

Om du har en hel dag:
- Allt ovan + #4, #8, #9, #11, #12, #21.
- Kör `scripts/analyze-posters.ts` mot riktig data så `/ord` och `/tonlage` har äkta innehåll.

Om du har två dagar:
- Hela P0 + P1.
- Bonusen: kör migration 005 + lägg till alla nya Wikimedia-affischer (15+ nya, public domain) — då har sajten meningsfullt mer innehåll att visa.

---

## Ny data tillgänglig (denna session)

`supabase/migrations/005_seed_all_parties.sql` + `src/lib/external-sources.ts` har fått ~25 nya affischer från Wikimedia Commons och DigitaltMuseum. Fördelning efter parti i de nya tilläggen:

- Allmänna valmansförbundet/Högerpartiet: 5
- Centerpartiet/Bondeförbundet: 6
- Socialdemokraterna: 4 (1908, 1916, 1948, 1960, 1976)
- Piratpartiet: 2
- Kristdemokraterna: 1
- Nationalsocialistiska Folkpartiet (i historisk-kritisk kontext): 2
- Folkomröstning 1922: 1
- Diverse rösträtt/arbetarrörelse: 3

Tidsmässigt: 1908, 1912, 1914, 1916, 1917, 1922, 1928 (×3), 1930 (×2), 1931, 1933, 1934, 1945, 1948, 1957, 1960, 1970, 1976, 1988, 1991, 1998, 2006, 2010, 2014.

Tomma år (där seed saknar bild men slogan finns för SD/M): 1991, 1994, 1998, 2002, 2018, 2022 för SD/M där bilden inte hittats publikt. Demonstrerar luckan i historiskt material — inget som ska döljas, det är en del av storyn.

Källor:
- [Wikimedia Commons – Political posters of Sweden](https://commons.wikimedia.org/wiki/Category:Political_posters_of_Sweden)
- [DigitaltMuseum.se](https://digitaltmuseum.se)
- [Wikipedia – Riksdagsvalet i Sverige (per år)](https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2010)
