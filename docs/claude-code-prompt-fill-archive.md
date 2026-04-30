# Claude Code prompt — Fyll arkivet

Du är Claude Code med Bash, fetch, Read, Write, Edit. Repo: `valaffischer/`. Mål: fylla appen med en valaffisch från **varje riksdagsval mellan 1908 och 2022 för varje traditionellt riksdagsparti**. Inget mock-material — bara verifierade bilder med tydlig provenens.

## Kontext: vad som finns idag

Efter två sökrundor finns 55 affischer i `src/lib/external-sources.ts` (statisk fallback) och i Supabase via migrations 001-006. Fördelningen är obalanserad:

| Parti | Antal | Bästa täckning | Värsta luckor |
|---|---|---|---|
| Moderaterna / Höger / AVF | 16 | 1928, 1931, 2010-2022 | 1908-1924, 1936-1948, 1952-1985, 1994-1998 |
| Centerpartiet / Bondeförbundet | 10 | 1930, 1945, 1957, 1970, 1988-1998 | 1917-1928, 1936-1968, 1973-1985, 2002-2022 |
| Socialdemokraterna | 7 | 1908, 1916, 1948, 1960, 1976 | nästan allt 1921-1944, 1952-1968, 1979-2022 |
| Vänsterpartiet / VPK / SKP | 9 | 1973, 1976, 1979, 2014 | 1921-1968, 1982-2010, 2018-2022 |
| Sverigedemokraterna | 6 | 2010, 2014, 2022 | 1988-1998 (mycket sparsamt arkiverat publikt) |
| Miljöpartiet | 1 | 2014 | 1982-2010, 2018-2022 |
| Kristdemokraterna | 1 | 2014 | 1964-2010, 2018-2022 |
| Liberalerna / Folkpartiet / Frisinnade | 0 | — | hela tidsperioden 1902-2022 |

**Totalt 70 valluckor** att fylla för att nå "ett par per parti per val".

## Riksdagsval (alla år)

```
1908, 1911, 1914, 1917, 1920, 1921, 1924, 1928, 1932, 1936, 1940,
1944, 1948, 1952, 1956, 1958, 1960, 1964, 1968, 1970, 1973, 1976,
1979, 1982, 1985, 1988, 1991, 1994, 1998, 2002, 2006, 2010, 2014,
2018, 2022
```

35 val.

---

## Din uppgift

1. Bygg en **systematisk insamlingsskript** `scripts/collect-posters.ts` som tar parti + år och letar verifierade bild-URL:er via flera källor i ordning:
   1. Wikimedia Commons category-API: `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Election_posters_of_the_Social_Democratic_Party_(Sweden)&format=json`
   2. Wikipedia per riksdagsval: `https://sv.wikipedia.org/w/api.php?action=parse&page=Riksdagsvalet_i_Sverige_<år>&prop=images|wikitext`. Plocka ut images vars filename matchar `valaffisch|affisch|kampanj` + partiets namn.
   3. Stockholmskällan: `https://stockholmskallan.stockholm.se/sok/?q=valaffisch+<parti>` — plocka skblobs-URL:er.
   4. Affischerna.se: `https://affischerna.se/?s=<parti>` — extrahera `wp-content/uploads/...jpg`-URL:er från sökresultat-HTMLn.
   5. DigitaltMuseum: `https://digitaltmuseum.se/search?q=valaffisch+<parti>` — plocka `ems.dimu.org/image/...`-URL:er.

2. Skriv resultaten till `data/poster-candidates.json` med struktur:
   ```json
   {
     "party": "...", "year": 1944, "slogan": "...", "title": "...",
     "image_url": "...", "thumbnail_url": "...",
     "source": "wikimedia"|"affischerna"|"stockholmskallan"|"dimu"|"media_archive",
     "source_url": "...", "rights_status": "free"|"fair_use"|"restricted",
     "verified": false  // human-review-flagga
   }
   ```

3. Verifiera varje kandidat:
   ```bash
   curl -sI "$URL" | head -3   # statuskod
   ```
   Behåll bara 200/302-OK kandidater.

4. **Omröstningssteg:** Använd `scripts/analyze-posters.ts` (Claude Vision) för att verifiera varje kandidatbild stämmer mot förväntad parti och år. Modellen ska svara JSON med `party_match`, `year_match`, `confidence`. Behåll bara `confidence >= medium`.

5. Skriv migration `007_seed_from_candidates.sql` som INSERT:ar verifierade poster + uppdatera `external-sources.ts` med matchande createExternalPoster-anrop.

6. **Generera en lucktäcknings-rapport** `docs/coverage-report.md`:
   - Per parti × år: ✓ (har), ✗ (saknas), ? (kandidater att verifiera)
   - Synligt på sajten under `/om/tackning` eller liknande.

## Krav på briljans

- **Källkritisk transparens.** Varje affisch på sajten visar källa, attribution, rättighetsstatus och en länk till primärkällan. Detta finns redan i schemat — använd det.
- **Inga fake-bilder.** Om en post inte har bild, visa textcard med slogan + årtal + "bild saknas — bidra på [länk]". Då är luckan en del av berättelsen, inte ett fel.
- **Ingen mock-data i AI-vyer.** `enrichWithSampleRhetoric()` i `lib/rhetoric-utils.ts` måste antingen ersättas med riktig analys (kör `scripts/analyze-posters.ts` mot alla poster) eller döpas om till `applyMockRhetoricForDemo` med synlig disclaimer i UI.
- **Politiskt utfall:** Piratpartiet, NSF/Furugård och Ungsvenska har tagits bort i migration 006. Lägg INTE tillbaka dem. Sajten täcker traditionella riksdagspartier.

## Tekniska skärningsregler

- Före `npm run dev`: kör `npx tsc --noEmit`. Måste vara grön.
- För varje ny image-host: lägg till i `next.config.ts` remotePatterns innan första render.
- Använd `revalidate: 86400` på alla list-sidor.
- För images från affischerna.se / stockholmskällan / dimu.org: notera att dessa har bandbreddsbegränsningar. Cachelagra thumbnails i Supabase Storage om antalet visningar växer.

## Sex specifika luckor som är prioriterade — försök dessa först

1. **Liberalerna/Folkpartiet 1948** — Berömd "Bertil Ohlin"-eran. Vinkel: liberal welfare-state-debatt under Per Albins efterkrigsår.
2. **Socialdemokraterna 1932** — Per Albins genombrottsval. "Mot krisen" / "Folkhemmet" är slogans här någonstans.
3. **Bondeförbundet 1936** — Krisuppgörelsens efterspel. Möjliga sökord: "kohandeln", "saltsjöbaden".
4. **Vänsterpartiet 1991** — Året VPK bytte namn till V, samma år som SD bildades. Brytpunkt.
5. **Moderaterna 1991** — Bildt blev statsminister. "Det blå Sverige" eller "Brottslingar ska sitta inne. Du ska våga vara ute."
6. **Miljöpartiet 1988** — Första gången i riksdagen. Slogan: "Miljövalet". Kontakta Naturhistoriska riksmuseet eller Centrum för Näringslivshistoria för kanske digitaliserat material.

## När du är klar

Lever en `docs/coverage-report.md` som visar:
- Antal affischer per parti per val (matrix)
- Procent täckning totalt
- Top-10 prioriterade luckor att fylla nästa runda
- Tekniska bilagor: vilka image-hosts som introducerats, vilka rättighetsstatusar som dominerar.

Och en `docs/decisions/` markdown om vad du valde bort, varför, och vad nästa person bör veta.

---

## Snabb startkommando

```bash
# 1. Probe vilka källor som faktiskt fungerar
curl -I "https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Election_posters_of_the_Social_Democratic_Party_(Sweden)&format=json"

# 2. Skriv collect-posters.ts som agent-loop med max 5 retries per kandidat

# 3. Verifiera mot Vision-modellen innan databas-insert

# 4. Kör migrationer i ordning, kör tsc, smoke-testa /tidslinje, /partier, /ord
```

Lycka till. Sajten ska bära demokratins visuella historia — det innebär att den måste ha materialet.
