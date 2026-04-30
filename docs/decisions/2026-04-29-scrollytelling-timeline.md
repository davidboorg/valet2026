# B4: Editorial scrollytelling på tidslinjen

**Datum:** 2026-04-29
**Status:** Implementerad

## Vad jag byggde

### 1. TimelineScrollytelling-komponent (`src/components/timeline-scrollytelling.tsx`)

- Scroll-baserad berättelse med sex redaktionella "moment"
- Intersection Observer triggar animationer när sektioner kommer i sikte
- Alternerande layout (text vänster/höger) för visuell variation
- Framer Motion för mjuka övergångar
- Sidopanel med progress-indikatorer (desktop)
- Automatisk hämtning av relevanta affischer per moment

### 2. Redaktionella moment (EDITORIAL_MOMENTS)

| År | Moment | Tema |
|----|--------|------|
| 1890 | Politikens affischer föds | change |
| 1921 | Alla får rösta | hope |
| 1928 | Kosackval och klasskonflikt | conflict |
| 1936 | Folkhemmet tar form | hope |
| 1940 | Krigsår och samlingsregering | conflict |
| 1948 | Efterkrigstid och välfärdsbygge | hope |

### 3. Temafärger

- **hope**: Grön accent (#3D7A5F) — framtidsoptimism
- **conflict**: Guld accent (#B8860B) — dramatik, varningar
- **change**: Blå accent (#52BDEC) — förändring, förnyelse
- **modern**: Brun accent (#7C6955) — modernitet, nostalgi

### 4. Uppdaterad tidslinje-sida

- Lade till scrollytelling-sektion under PartyTimeline
- Rubriken "Sex ögonblick som formade valaffischen"
- Introduktionstext som guidar användaren

## Designval

1. **Alternerande layout** — Moment växlar mellan vänster/höger placering för att skapa visuellt intresse och undvika monotoni
2. **Sticky progress** — Progress-indikatorer på desktop hjälper orientering
3. **Tema-baserade färger** — Varje moment har färg som matchar innehållets känsla
4. **Insight callouts** — Extra kontext visas med border-left för att sticka ut
5. **Poster-grid** — Visar 4 relevanta affischer per moment

## Filer som ändrats/skapats

| Fil | Typ |
|-----|-----|
| `src/components/timeline-scrollytelling.tsx` | Ny |
| `src/app/tidslinje/page.tsx` | Uppdaterad |

## Vad nästa person bör veta

1. **Utöka momenten**: Lägg till fler `StoryMoment` objekt i `EDITORIAL_MOMENTS` för att täcka moderna eran (1960-2026)

2. **Specifika affischer**: Sätt `posterIds` i momenten för att visa exakt de affischer du vill highlighta

3. **Kampanjintegration**: Scrollytelling-momenten kan återanvändas för social media — varje moment är en potentiell post

4. **Prestanda**: Vid många moment, överväg virtualisering eller lazy loading av bilder

## Verifierat

- [x] TypeScript kompilerar utan fel
- [x] Build lyckas
- [x] Intersection Observer fungerar
- [x] Animationer triggas vid scroll
- [x] Progress-indikatorer uppdateras
- [x] Affischer hämtas per moment
