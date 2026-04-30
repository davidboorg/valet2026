# Claude Code prompt — Valaffischmuseet, nästa fas

Du är Claude Code. Repo: `valaffischer/` (Next 16, Supabase, OpenSeadragon/IIIF, framer-motion). Läs `AGENTS.md`, `editorial-plan.md`, `claude-code-prompt-valaffischer.md` och `design-prompt-valaffischer.md` innan du börjar.

Denna prompt har två delar: **(A)** vad jag (en föregående AI-session) just har gjort så du har korrekt kontext, och **(B)** vad du ska bygga härnäst — med särskild prioritering på att göra AI-analysen till sajtens mest interaktiva och minnesvärda upplevelse.

---

## A. Vad som gjordes i föregående session (29 april 2026)

### A1. Schemaöppning för icke-IIIF-källor
Lade till migration `supabase/migrations/003_external_sources.sql`:
- IIIF-fälten är nu nullable (`iiif_manifest_url`, `iiif_image_base_url`, `kb_digitalt_id`, `kb_digitalt_url`).
- Nya kolumner: `source`, `external_id`, `image_url`, `thumbnail_url`, `high_res_url`, `source_url`, `source_attribution`, `rights_note`, `slogan`.
- `posters_has_image` constraint säkerställer minst en bildsökväg.
- `rights_status` utökad till `free | restricted | fair_use | unknown`.
- Vy `v_election_posters` plockar ut affischer kopplade till svenska riksdagsval oavsett källa.

### A2. SD + M seed 1988-2022
Migration `004_seed_sd_m_posters.sql` seedar Sverigedemokraterna och Moderaterna för riksdagsvalen 1988, 1991, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022 — slogans från Wikipedia, bildmaterial från sd.se, moderaterna.se, Wikimedia Commons, Arbetet, Dagens Arbete, Dagens Opinion. Kuratoriska metadata (party, election_year, themes, sensitivity_flags) seedas också.

### A3. Statisk fallback i appen
`src/lib/external-sources.ts` har nu `SD_POSTERS` + `MODERATERNA_POSTERS`-arrays + nya source-typer (`sd_party`, `moderaterna_party`, `wikimedia`, `media_archive`). `getAllExternalPosters()` filtrerar bort poster utan bild från grids men `getAllExternalPostersIncludingMissingImages()` exponerar hela datat för katalog/forskningsvyer. `src/lib/types.ts` uppdaterad. Se till att `getAllElectionPosters` läser från Supabase istället när migrationerna kört — statisk fallback ska bara vara säkerhetsnät.

### A4. Image-domäner
`next.config.ts` öppnar för: `upload.wikimedia.org`, `www.sd.se`, `sd.se`, `moderaterna.se`, `da.se`, `media.arto.se`, `dagensopinion.se`, `static.bonniernews.se`.

### A5. Stora luckor som inte är lösta
- Inga publika valaffischer finns för SD 1988-1998 — partiet var marginellt och dåligt arkiverat. Var ärlig om luckan i UI:t.
- KB:s samling stannar 1951. Mellanperioden 1956-2002 har glesa data oavsett parti.
- Rättigheter är osäkra för allt post-1951. Se P1.1 nedan.

---

## B. Vad du ska bygga härnäst

Prioritera i ordning. Stoppa och fråga om något är otydligt — gissa inte.

### B1. (BLOCKERANDE för launch) Rättighetsmodell i UI

**Varför:** Sajtens footer säger "Bildmaterial: Public Domain Mark 1.0" — det stämmer för KB-material 1892-1951 men är direkt felaktigt för affischerna.se, SD/M-material och allt annat post-1951. Detta måste fixas innan publik launch.

**Konkret:**

1. Differentierad footer: visa rättighetsstatus baserat på det material som faktiskt visas på sidan.
2. `RightsBadge`-komponenten finns redan i `src/components/rights-badge.tsx` — gör den synlig på *alla* poster-cards, inte bara detalsidor. Liten ikon i hörnet räcker.
3. Per-affisch-sidan: tydlig sektion "Rättigheter och källa" som visar `rights_status`, `rights_note`, `source`, `source_attribution`, `source_url`. Inkludera URL §23-disclaimer för `fair_use`-poster.
4. Skriv en `/om/rattigheter`-sida som förklarar de fyra statusar och hur sajten hanterar upphovsrätt.

### B2. Wire `getAllElectionPosters` till Supabase

Just nu läser `getAllElectionPosters` KB-API direkt + statiska arrays från `external-sources.ts`. När migration 003 + 004 körts ska den läsa från `v_election_posters`-vyn istället. Behåll statiska arrays som dev-fallback om Supabase inte är konfigurerad.

### B3. **AI-upplevelsen — det här är där sajten ska vara världsklass**

Repo har redan `scripts/analyze-posters.ts` som extraherar via Claude Vision per affisch:
- `transcribed_text` (ALL läsbar text på affischen)
- `themes` (välfärd, försvar, migration etc.)
- `rhetorical_devices` (framtidslöftet, hotbilden, vi_och_dom, nostalgin, trygghetslöftet, folkligt_tilltal etc.)
- `visual_motifs` (flagga_foster, arbetare, familj, hand_naven, karikatyr etc.)
- `tone` (hoppfull | hotande | saklig | nostalgisk | upprorisk | lugn)
- `party_detected` + `party_evidence`
- `decade_context` + `historical_note`

Schemat finns i migration 002. **Det är detta data som ska driva sajtens mest interaktiva delar.** Just nu är det dolt under huven. Bygg fram det.

#### B3.1 Ord-explorer (flagship-vyn)

Bygg `/utforska/ord` — en interaktiv ordvy där alla affischers transkriberade text aggregeras.

- **Ordmoln per decennium**, men inte ett vanligt ordmoln — gör det som en *typografisk konstinstallation*. Ord ska sitta i Playfair Display, blandade storlekar baserat på frekvens, men positionerade asymmetriskt enligt designprompten. Klicka på ett ord → visa alla affischer som använder det.
- **Tidsslider** överst — när man drar slidern animeras orden in/ut. Vissa ord dominerar 1932 ("kris", "arbete"), försvinner 1968, kommer tillbaka 2010 ("trygghet"). Visa det visuellt.
- **Jämför två decennier** sida vid sida. Vänster: 1928. Höger: 2022. Visa vilka ord som överlapper, vilka som är unika. Detta blir minnesvärt — det är historielektion förklädd till leksak.
- **Sökfält**: skriv "trygghet" → få graf över hur ofta ordet använts genom tid + vilka partier som använt det mest + de 10 affischer det förekommer i.

Använd `recharts` för graferna och `framer-motion`'s `LayoutGroup` + `layoutId` för smooth-transitions när orden flyttas. Inga generiska wordcloud-bibliotek — det måste se ut som det här museet, inte som en tagcloud-widget från 2008.

#### B3.2 Retorik-mode

Lägg till en visningsmode på `/affischer`-sidan: knappen "Retorik" överst som lägger ett **filter över hela griden baserat på `rhetorical_devices`**.

- Klicka på "Hotbilden" → endast affischer som använder hotbild visas, sorterade kronologiskt.
- Klicka på "Vi och dom" → endast den retoriken visas. Spelar roll: vissa retoriska grepp har varit konstanta i 130 år men antagit nya skepnader. Det är pedagogiskt explosivt.
- För varje retoriskt grepp, en kort essä: vad är det, var kommer det från, hur skiftar det över tid?

Det ska kännas som att man skiftar lins. Subtil färgshift på UI:t (terrakotta blir lite varmare, mörkare för "hotbilden"; ljusare och svalare för "framtidslöftet").

#### B3.3 Tonläge-spectrum

Bygg en `/tonlage` — visualisering där alla affischer plottas i ett 2D-fält:

- X-axel: hoppfull ↔ hotande
- Y-axel: saklig ↔ känslomässig
- Punkter färgade efter parti (men dämpade så materialet inte konkurrerar med UI).
- Hovra över en punkt → mini-thumbnail + slogan visas.
- Klicka → öppna affisch.

Animera in punkterna på scroll. Lägg till tidslinje-controll så man kan filtrera på decennium. Här finns potential att visa något *häftigt*: t.ex. att Moderaternas affischer flyttar sig från "saklig + hoppfull" på 90-talet till "känslomässig + hotande" 2014-2022. Det är en visuell story som är omöjlig att se på något annat sätt.

#### B3.4 Visuella motiv som DNA

`visual_motifs_detailed` lagras per affisch. Bygg en mode på partisida (`/partier/[slug]`) som visar:

- **Visuellt DNA**: en horisontell stapel som visar fördelningen av visuella motiv för partiets affischer genom tiden. T.ex. SD: 60% "text_dominant", 25% "portratt", 15% "flagga_foster". Moderaterna 2010-talet: 70% "portratt", 20% "abstrakt_symbol".
- **Förändring över tid**: stapeln animerad så man kan se hur partiets visuella språk förändrats. Socialdemokraternas övergång från "arbetare/hand_naven" på 1930-talet till "familj/portratt" på 2010-talet ska gå att *se* med en gest.

#### B3.5 Affisch-radar (bonus, men cool)

På affischens detalsida — utöver IIIF deep zoom — bygg en **AI-radar**: en cirkel-grafik (recharts radarchart) som visar denna specifika affischens "fingeravtryck": tonläge, retoriska grepp, visuella motiv, jämfört med decenniets snitt. Läsaren ser direkt om affischen är typisk eller avvikande för sin tid.

### B4. Editorial scrollytelling på tidslinjen

`/tidslinje` är just nu en ren grid. Bygg om till scroll-driven storytelling:

- Per epok (t.ex. 1921, 1932, 1948, 1968, 1991, 2010, 2022) en fullbredd-sektion med **redaktionell text**, **3-5 utvalda affischer**, **valresultat-mini-graf** + **statsministerutfall**.
- Mellan sektionerna: scroll-utlöst **bakgrundsfärgskifte** (subtilt — håll dig inom palettens varma neutraler men tona mot mörkare/ljusare beroende på epokens stämning).
- Använd `useScroll` + `useTransform` från framer-motion för att animera affischer in/ut, men *inte* som dekoration — som *redigering*. Affischen ska komma in när texten omtalar den.

### B5. Mobil

Headern har en hamburger-knapp utan funktion. Bygg en fullskärms mobilmeny + en separat mobil-flöde för `/affischer/[id]` med swipe-gester (vänster/höger för nästa affisch, pinch för zoom). Affischer fungerar utmärkt i mobil när UI:t kommer ur vägen.

### B6. Performance

- ISR på alla list-sidor: `export const revalidate = 86400`.
- `generateStaticParams` på `/affischer/[id]` för topp 200 affischerna.
- Cachelagra KB-API:s svar i Supabase istället för att slå mot KB live på varje request.

### B7. SEO + delning

- Per-affisch OG-bild som *är affischen själv* i 1200x630, genererad via `next/og`.
- JSON-LD `VisualArtwork` schema på alla affisch-sidor.
- Slug-baserade URL:er som komplement till id (`/affischer/kosackvalet-1928`).

---

## C. Designprinciper du ska hålla fast vid

Från `design-prompt-valaffischer.md` — ofrånkomliga:
- **Affischerna är färgen, UI:t är tyst.** Ingen blå, ingen gul. Terrakotta endast som accent, en per sida.
- **Editorial serif** (Playfair) för rubriker. Dimensioner och typografisk hierarki ska bära auktoritet.
- **Asymmetri.** 7+4, 5+6, 8+3 splits — inte centrerade hero-sektioner.
- **Museal restraint.** Generösa marginaler. Vita ytor. Ingen card-shadow-rounded-corner-stack.

För AI-upplevelserna ovan: motstå frestelsen att bygga "dashboards". Det här är ett museum, inte ett analytics-verktyg. Visualiseringarna ska kännas som **utställningsobjekt** — typografiska, redigerade, generösa i layouten. När i tvekan, gör det större och tystare snarare än mindre och mer datatätt.

---

## D. Innan du börjar

1. Läs `docs/feedback-2026-04-29.md` (samma session som denna prompt) — där finns hela P1/P2/P3-prioriteringen.
2. Kör migration 003 + 004 mot Supabase och verifiera att data flödar via `v_election_posters`.
3. Kör `scripts/analyze-posters.ts` på KB-materialet om det inte redan kört. Då har du fullt analysdata att bygga på.
4. Kontrollera att `getAllElectionPosters` läser från Supabase (inte bara KB + statiska arrays). Detta är förutsättningen för B3.

## E. Rapportera tillbaka

För varje större delleverans (B1, B3.1, B3.2 etc.):
- Säkerställ att `npx tsc --noEmit` är ren.
- Skapa en kort markdown i `docs/decisions/` med rubriken "Vad jag byggde, vad jag valde bort, vad nästa person bör veta".
- Föreslå konkret nästa uppgift om det inte är uppenbart.
