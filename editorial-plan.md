# Editorial Plan — Valaffischmuseet

Shared state file for the campaign-curator agent and the human editor (David). The agent reads this on every run, writes drafts and updates back, and flags anything that needs editor attention. David reviews this file once a week (15 min) and at the five phase transitions. This is the single source of truth for what's been planned, drafted, queued, and shipped.

---

## STATUS: COMMITTED — Launch 15 July 2026, capacity-mode operation

**Locked 2026-04-27:**
- *Hård launch-datum:* 15 juli 2026
- *Operativ läge:* kapacitetsdrift — lägre cadence än original-brief, editor handhåller manuellt under maj
- *Valdagen:* 13 september 2026 (oförändrat)

Capacity-mode innebär att original-briefens fyra-fas-struktur skiftar. Agenten genererar inte drafts i april–maj. Under juni rampar vi upp. 15 juli är hård launch. Sedan kör vi som original-brief från och med Fas 3.

---

## Updated phases (kapacitetsdrift)

| Period | Fas | Vem driver | Volym |
|--------|-----|------------|-------|
| **Apr–maj 2026** | Fas 0 — *Soft build-in-open* (NEW) | Editor manuellt (ingen agent) | 1–2 posts/vecka, screenshots och milstolpar |
| **2026-06-01 → 2026-07-14** | Fas 2 — *Pre-launch ramp* | Agent + editor | ~50% av original cadence (12–15 posts/månad) |
| **2026-07-15** | **LAUNCH-dag** | Editor leder, agent levererar | Koordinerad push över alla kanaler |
| **2026-07-15 → 2026-07-31** | Fas 2b — *Post-launch momentum* | Agent + editor | Full cadence (~25–30 posts/månad) |
| **2026-08-01 → 2026-08-25** | Fas 3 — *Kontextfas* | Agent + editor | Full cadence, neutralitets-disclaimers |
| **2026-08-26 → 2026-09-13** | Fas 4 — *Lågrisk-period* | Agent + dubbel editor-review | Minimal cadence, default till säker historik |
| **2026-09-14 →** | Fas 5 — *Post-val* | Agent + editor | Tillbaka till Fas 2-tempo |

Each transition requires editor approval before the agent runs against the new phase rules.

---

## Current phase

**Fas 0 — Soft build-in-open** (april–maj 2026)

Editor (David) postar 1–2 saker per vecka manuellt. Inga agentdrafts. Fokus: bygg-screenshots, milstolpar, "vi bygger nåt"-energi. Inga affischer i feed än.

Agentens roll i Fas 0: passive. Vänta på Fas 2-trigger 1 juni. Gör inte daily ingest, inte weekly draft, inte monthly plan. Om invokerad — säg att vi är i Fas 0, agentdrift är inaktiv, hänvisa till editor-aktivitet.

---

## Next agent activation: 2026-06-01

Då kör agenten sin första monthly plan för juni — pre-launch ramp-up content. Editor approvar serieplan + första veckans drafts innan vidare drafting.

---

## Series this month — MAJ 2026 [ARCHIVED — recycled for June planning]

**This plan was generated for a Fas 1-style spring launch and is no longer the active plan.** Preserved below as reference material for the agent's June planning run — many series concepts (Källkritik 101, IIIF i praktiken) translate well to pre-launch content. Agent should re-evaluate and propose a new June plan when activated 1 juni.

---

### Series 1: Hur vi valjer — Urvalskriterierna

- **Format:** Kuratorkommentar (carousel + reel-versioner)
- **Channels:** Instagram (carousel), TikTok (reel), LinkedIn (long-form)
- **Cadence:** 1 post/week (4 posts total in May)
- **Theme:** Behind-the-scenes look at how we select affischer for the museum. What makes an affisch interesting from a design/cultural history perspective? Not which party, but which visual language.
- **Content pillars:**
  - V.18 (28 apr-4 maj): "Vad ar en valaffisch?" — definition, scope, why we stop at 1988 for now
  - V.19 (5-11 maj): "Proveniensen forst" — how we trace affischer back to KB Digitalt, Regina ID, why source matters
  - V.20 (12-18 maj): "Upphovsratten styr" — why we focus on 1920-1980, what "Fritt" means, KB's rights framework
  - V.21 (19-25 maj): "Motivval utan politik" — how we pick based on graphic interest, not message
- **Affisch pool:** To be populated via KB Digitalt search. Prioritize affischer with clear typography, interesting color use, or unusual compositions from 1920-1960.
- **Kill criteria check:** Safe. Methodology content. No party endorsement risk. No living persons.

---

### Series 2: IIIF i praktiken — Tekniken bakom museet

- **Format:** Kuratorkommentar (reel, 30-45 sek) + behind-the-scenes screenshots
- **Channels:** Instagram (reels), TikTok, YouTube Shorts
- **Cadence:** 1 post/week (4 posts total in May)
- **Theme:** How IIIF deep zoom works, why it matters for studying affischer, tech as cultural preservation tool. This establishes the museum's technical credibility and differentiates from "just another image gallery."
- **Content pillars:**
  - V.18: "Vad ar IIIF?" — 30-sek explainer, zoom into a 1936 affisch showing detail invisible at normal resolution
  - V.19: "Detaljen avgor" — show how zoom reveals printing techniques, registration marks, paper texture
  - V.20: "Fran KB till webben" — the pipeline from physical archive to digital museum
  - V.21: "Varfor inte bara JPEG?" — why interoperability matters for research and teaching
- **Affisch pool:** Same as Series 1. Pick affischer with rich detail that rewards zooming.
- **Kill criteria check:** Safe. Technical/educational content. No political angle.

---

### Series 3: Bygget i det oppna — Veckans screenshot

- **Format:** Single image + caption (Instagram post, not carousel)
- **Channels:** Instagram, Mastodon, Bluesky
- **Cadence:** 2 posts/week (8 posts total in May)
- **Theme:** Work-in-progress screenshots of the museum being built. Interface designs, data model sketches, color palette decisions. Builds audience investment before launch.
- **Content pillars:**
  - Alternating between: UI mockups, Supabase schema snippets (redacted), design system components, accessibility testing, mobile views, search interface iterations
- **Affisch pool:** N/A — this is about the museum build, not specific affischer
- **Kill criteria check:** Safe. Behind-the-scenes build content. No affisch content = no political risk.

---

### Series 4: Kallkritik 101 — Fragor till en affisch

- **Format:** Carousel (5-7 slides)
- **Channels:** Instagram, LinkedIn
- **Cadence:** 1 post/week (4 posts total in May, starting V.19)
- **Theme:** Teaching source criticism through affischer. What questions should you ask when you encounter a historical political poster? This positions the museum as educational, not partisan.
- **Content pillars:**
  - V.19: "Vem ar avsandaren?" — how to identify party/organization, why it matters
  - V.20: "Nar trycktes den?" — dating affischer, what the printing reveals
  - V.21: "Vad ville den gora?" — analyzing rhetorical intent without judging the politics
  - V.22 (26 maj-1 jun): "Vad saknas?" — what affischer leave out, the limits of the medium
- **Affisch pool:** Select 2-3 affischer per post from different parties/decades to show method applies universally. 1920-1960 only.
- **Kill criteria check:** Educational framing essential. Each post must explicitly avoid evaluating whether the political message was "right" — focus on technique and intent, not truth claims.

---

## Posting cadence summary — Maj 2026

| Week | Instagram | TikTok | LinkedIn | Mastodon/Bluesky |
|------|-----------|--------|----------|------------------|
| V.18 (28 apr-4 maj) | 3 | 1 | 1 | 2 |
| V.19 (5-11 maj) | 4 | 1 | 1 | 2 |
| V.20 (12-18 maj) | 4 | 1 | 1 | 2 |
| V.21 (19-25 maj) | 4 | 1 | 1 | 2 |
| V.22 (26-31 maj) | 3 | 1 | 1 | 2 |
| **Total** | **18** | **5** | **5** | **10** |

Default volume from brief: 2-3 IG/week. This plan runs slightly higher (3-4/week) due to Fas 1's build momentum. Editor may adjust downward if capacity is limited.

---

## Affisch sourcing — KB Digitalt queries

**Primary search parameters:**
- Collection: Politiska affischer
- Date range: 1920-1960 (safest for rights and deceased subjects)
- Rights status: "Fritt" only
- Exclude: Affischer with identifiable living persons (manual check required)

**Recommended starting pool (to be verified via KB Digitalt):**
1. 1921 folkpartiet typographic posters (text-heavy, excellent for "reading affischer" content)
2. 1928 hogern visual propaganda (strong graphic design period)
3. 1932 socialdemokraterna worker iconography (interwar visual language)
4. 1936 bondeforbundet agrarian imagery (rural Sweden representation)
5. 1948 post-war modernist designs (transition period)
6. 1956 referendum material (non-party, good for methodology posts)

**Note:** Each affisch must be verified against KB Digitalt before use. Agent cannot confirm rights status definitively — editor must check "Fritt" flag before approval.

---

## Queued (next 4 weeks)

_Drafts the agent has produced, awaiting weekly editor review. Most recent at top._

---

### V.18 DRAFTS (2026-04-28 to 2026-05-04)

**Status:** AWAITING EDITOR REVIEW

**Note:** Affisch sources marked [EDITOR: Source needed] require editor to verify "Fritt" status in KB Digitalt before approval. Posts without affischer (build screenshots) can proceed independently.

---

#### [2026-04-28] [Instagram] [Carousel] — Series 1: Vad ar en valaffisch?

**Caption:**
Vad ar egentligen en valaffisch?

Vi bygger ett digitalt museum over svenska valaffischer. Men forst maste vi definiera vad vi menar.

En valaffisch ar ett tryckt meddelande — avsett att sla igenom pa gatan, i valrorelsen, i ogonblicket. Den ar inte en broschyr. Inte en tidningsannons. Den ar formgiven for att synas pa avstand och forstoras pa nara hall.

Vi borjar med affischer fran 1920–1988. Varfor dar? For att kallorna ar oppna, upphovsratten hanterbar, och personerna avbildade med storsta sannolikhet avlidna. Det ar ingen politisk gransdragning — det ar en praktisk.

Vad gor en affisch intressant for oss? Inte budskapet. Typografin. Fargvalet. Kompositionen. Hur tidens grafiska sprak syns i valet av form.

Mer i museet nar vi lanserar. Tills dess: vi bygger i det oppna.

**Alt-text:**
Slide 1: Titelkort "Vad ar en valaffisch?" i museets designsystem.
Slide 2: Historisk valaffisch fran 1932 med fetstilad sans-serif typografi och tvafargsschema [EDITOR: Insert specific affisch].
Slide 3: Tidslinje som visar museets fokusperiod 1920–1988.
Slide 4: Narstudium av typografisk detalj fran samma affisch.
Slide 5: CTA-kort med texten "Folj bygget. Lansering 2026."

**Hashtags:**
#valaffisch #svenskpolitik #grafiskdesign #typografi #kulturhistoria #arkiv #KungligaBiblioteket #valaret2026 #designhistoria #visuellkultur #affischkonst #politiskakommunikation #museibygge #digitalmuseum #svpol

**Image source:**
[EDITOR: Source needed — recommend 1932 SAP affisch with bold typography from KB Digitalt, "Fritt" status required, Regina ID TBD]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Metodfokus, ingen partirekkommendation.
- Levande person: NEJ (1932 material).
- Lockdown-period: NEJ (publicering 28 april).
- Kontext ryms: JA.
- Kalla saknas: FLAGGAD — editor must source.
- Rattighetsstatus: FLAGGAD — editor must verify "Fritt".

**Editor notes:**
Carousel needs 4-5 slides. Affisch behover sourcas fran KB Digitalt med "Fritt"-status. Forslag: 1932 socialdemokraterna typografisk affisch. Alternativ: 1928 hogern eller 1936 bondeforbundet om bild finns. Publicera mandag morgon for veckostart-engagement.

**Suggested posting:** Mandag 2026-04-28, 08:00

---

#### [2026-04-28] [LinkedIn] [Long-form] — Series 1: Vad ar en valaffisch?

**Caption:**
Vad ar en valaffisch — egentligen?

Vi bygger ett digitalt museum over historiska svenska valaffischer. Innan vi kan visa nagot, maste vi definiera vad vi menar.

En valaffisch ar inte en broschyr. Inte en tidningsannons. Den ar ett tryckt meddelande formgivet for gatan — avsett att sla igenom pa avstand och studeras pa nara hall. Den ar ett designobjekt lika mycket som ett politiskt budskap.

Museet kommer att visa affischer fran 1920–1988. Gransdragningen ar inte politisk — den ar praktisk. Fore 1920 finns fa bevarade affischer i digitaliserbar kvalitet. Efter 1988 blir upphovsratt och personuppgifter komplicerade. Vi borjar dar kallorna ar oppna.

Vad gor en affisch intressant for oss?

Inte budskapet. Vi ar inte har for att bedoma politiken. Vi ar har for att studera formspraket. Typografin. Fargvalen. Kompositionen. Hur tidens grafiska grammatik tar sig uttryck i politisk kommunikation.

Det digitala museet bygger pa Kungliga bibliotekets samlingar och anvander IIIF-teknik for djupzoom — du kan studera tryckdetaljer som aldrig synts fore digitaliseringen.

Lansering under 2026. Vi bygger i det oppna och delar processen har.

Folj for uppdateringar om kuratorisk metodik, designhistoria och den svenska valaffischens visuella arv.

**Alt-text:**
Historisk svensk valaffisch fran 1930-talet med distinkt typografi och begransad fargpalett [EDITOR: Insert specific affisch].

**Hashtags:**
#valaffisch #grafiskdesign #designhistoria #politiskkommunikation #kulturarv #digitalmuseum #svenskhistoria #typografi #arkiv #KungligaBiblioteket

**Image source:**
[EDITOR: Source needed — same as Instagram carousel, or separate 1930-tal affisch with strong design interest]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check: PASS (same as Instagram version).

**Editor notes:**
LinkedIn-version ar langre och mer metodfokuserad. Riktar sig till larare, journalister, designers. Kan publiceras samma dag som Instagram-carousel for korsdriving.

**Suggested posting:** Mandag 2026-04-28, 09:00

---

#### [2026-04-29] [Instagram] [Reel 30 sek] — Series 2: Vad ar IIIF?

**Caption:**
IIIF later som nagot fran en IT-avdelning. Det ar det ocksa.

Men det ar ocksa hur du kan zooma in pa en 90 ar gammal valaffisch — och se tryckrastret, pappersfibrerna, registreringsmarkena som tryckaren anvande.

Valaffischmuseet anvander IIIF for att servera hogupplostas bilder fran Kungliga bibliotekets samlingar. Du kan studera detaljer som aldrig synts fore digitaliseringen.

Tekniken ar infrastruktur. Men vad den mojliggor ar kulturhistoria.

Mer i museet nar vi lanserar.

**Alt-text:**
Video: Skarmavspelning som borjar med en helbild av en valaffisch fran 1936, sedan smoot zoom in pa ett typografiskt detalj tills rasterpunkter syns. Text-overlay forklarar IIIF.

**Hashtags:**
#IIIF #digitalmuseum #kulturarv #arkivteknik #KungligaBiblioteket #valaffisch #grafiskdesign #zoom #pixlar #tryckhistoria #bevarande #digitalisering #museitechnik #sverigeshistoria

**Image source:**
[EDITOR: Source needed — recommend 1936 affisch with rich detail for zoom demonstration, "Fritt" status, Regina ID TBD]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Teknikfokus.
- Levande person: NEJ (1936 material).
- Lockdown-period: NEJ.
- Kontext ryms: JA.
- Kalla saknas: FLAGGAD.
- Rattighetsstatus: FLAGGAD.

**Editor notes:**
Reel-skript nedan. Krav: skarminspelning av IIIF-viewer med faktisk KB-affisch. Om viewer inte ar redo, kan goras med KB Digitalts egen viewer som fallback.

**Reel-skript (voiceover eller text-overlay):**
[0-5 sek] Helbildsvy av affisch. Text: "En valaffisch fran 1936."
[5-15 sek] Sakta zoom. Text: "Med IIIF kan du zooma — langt."
[15-25 sek] Narstudium av rasterpunkter/tryckdetalj. Text: "Tryckrastret. Pappersfibrer. Detaljer som aldrig synts fore."
[25-30 sek] Zoomut till helbild igen. Text: "Valaffischmuseet. Lansering 2026."

**Suggested posting:** Tisdag 2026-04-29, 12:00

---

#### [2026-04-29] [TikTok] [Reel 30 sek] — Series 2: Vad ar IIIF?

**Caption:**
Zooma in pa en 90 ar gammal valaffisch tills du ser tryckrastret. Det ar IIIF. Tekniken bakom Valaffischmuseet.

#valaffisch #arkiv #digitalmuseum #zoom #kulturhistoria #design #typografi #fyp #lartiktok #svenskhistoria

**Alt-text:**
Video: Samma innehall som Instagram-reel — skarmavspelning av IIIF deep zoom pa 1936 valaffisch.

**Image source:**
[EDITOR: Same as Instagram reel]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
TikTok-version ar samma video som Instagram men med kortare caption och TikTok-anpassade hashtags. #fyp och #lartiktok for discovery.

**Suggested posting:** Tisdag 2026-04-29, 17:00

---

#### [2026-04-30] [Instagram] [Single image] — Series 3: Bygget i det oppna #1

**Caption:**
Veckans screenshot fran bygget.

Det har ar designsystemets fargpalett. Vi utgick fran de vanligaste fargerna i valaffischer fran 1920–1960 — och byggde ett modernt granssnitt som ekar utan att imitera.

Museet ska kanna tidlost, inte retro. Affischerna ar det historiska. Gransnittet ar det nutida.

Bygget fortsatter. Folj for mer bakom kulisserna.

**Alt-text:**
Screenshot av en designsystem-komponent som visar fargpalett med sex farger: svart, vitt, en dampat rod, en matt bla, en sandfargad beige, och en morkgron. Fargerna ar markta med hex-koder.

**Hashtags:**
#designsystem #webbutveckling #fargpalett #valaffisch #digitalmuseum #ux #ui #byggideboppna #bakomkulisserna #lansering2026 #kulturarv #grafiskdesign

**Image source:**
[EDITOR: Screenshot from actual design system. If not ready, use placeholder mockup with note that real screenshot replaces before publish.]

**Phase compliance:**
Fas 1. Kill criteria check:
- Valppaverkan: NEJ. Bygginnehall, ingen affisch.
- Levande person: NEJ.
- Lockdown-period: NEJ.
- Kontext ryms: JA.
- Kalla saknas: N/A (ingen affisch).
- Rattighetsstatus: N/A.

**Editor notes:**
Behover faktisk screenshot fran designsystemet. Om det inte finns annu, kan denna post senalaggas till V.19. Alternativ: visa UI-mockup av affisch-detaljvyn istallet.

**Suggested posting:** Onsdag 2026-04-30, 08:00

---

#### [2026-04-30] [Mastodon] [Single image] — Series 3: Bygget i det oppna #1

**Caption:**
Bygger ett digitalt museum over svenska valaffischer fran 1920–1988. Det har ar fargpaletten vi landat pa — inspirerad av affischernas egna farger, men for ett modernt granssnitt.

Lansering 2026. Bygget sker i det oppna.

#valaffisch #digitalmuseum #designsystem #kulturarv #KungligaBiblioteket #webbutveckling

**Alt-text:**
Screenshot av designsystemets fargpalett med sex farger och hex-koder.

**Image source:**
[EDITOR: Same as Instagram version]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
Mastodon-version ar kortare och mer saklig. Kulturarvspublik uppskattar direkthet.

**Suggested posting:** Onsdag 2026-04-30, 09:00

---

#### [2026-05-02] [Instagram] [Single image] — Series 3: Bygget i det oppna #2

**Caption:**
Veckans screenshot.

Mobilvy av affisch-detaljsidan. Vi designar mobilt-forst — de flesta kommer att upptacka museet i handen, inte vid skrivbordet.

IIIF-tekniken funkar lika bra pa telefon. Du kan zooma med fingrarna.

Mer fran bygget nasta vecka.

**Alt-text:**
Screenshot av en mobilskarm som visar en valaffisch i helskarm med zoom-kontroller och en informationsruta i botten med artal och kallhanvisning.

**Hashtags:**
#mobilforst #responsivdesign #ux #digitalmuseum #valaffisch #IIIF #webbutveckling #byggideboppna #lansering2026 #kulturarv

**Image source:**
[EDITOR: Screenshot from mobile view of affisch detail page. If not ready, mockup acceptable with note.]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
Behover screenshot av faktisk mobilvy. Om viewer inte ar redo, visa Figma-mockup med disclaimer. Affischen som syns i screenshoten maste ocksa vara "Fritt"-verifierad.

**Suggested posting:** Fredag 2026-05-02, 12:00

---

#### [2026-05-02] [Bluesky] [Single image] — Series 3: Bygget i det oppna #2

**Caption:**
Bygger ett valaffischmuseum. Det har ar mobilvyn — designad for att zooma med fingrarna. IIIF-teknik gor det mojligt.

Lansering nagon gang 2026. Folj for bakom kulisserna.

**Alt-text:**
Screenshot av mobilvy med valaffisch och zoom-kontroller.

**Image source:**
[EDITOR: Same as Instagram]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
Bluesky-publiken ar tech-intresserad. IIIF-omnamnande relevant.

**Suggested posting:** Fredag 2026-05-02, 12:30

---

### V.18 SUMMARY

| Day | Platform | Series | Format | Affisch needed? | Status |
|-----|----------|--------|--------|-----------------|--------|
| Mon 28 | Instagram | S1: Urvalskriterierna | Carousel | YES | SOURCE NEEDED |
| Mon 28 | LinkedIn | S1: Urvalskriterierna | Long-form | YES | SOURCE NEEDED |
| Tue 29 | Instagram | S2: IIIF | Reel | YES | SOURCE NEEDED |
| Tue 29 | TikTok | S2: IIIF | Reel | YES | SOURCE NEEDED |
| Wed 30 | Instagram | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Wed 30 | Mastodon | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Fri 2 | Instagram | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Fri 2 | Bluesky | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |

**Total V.18:** 8 posts across 5 platforms
**Blocked:** 0
**Needs sourcing:** 4 (affischer), 4 (screenshots)

---

---

### V.19 DRAFTS (2026-05-05 to 2026-05-11)

**Status:** AWAITING EDITOR REVIEW

**Series coverage this week:**
- Series 1 (Urvalskriterierna): "Proveniensen forst" — how we trace affischer back to KB Digitalt
- Series 2 (IIIF i praktiken): "Detaljen avgor" — zoom reveals printing techniques
- Series 3 (Bygget i det oppna): 2 work-in-progress posts
- Series 4 (Kallkritik 101): FIRST POST — "Vem ar avsandaren?"

---

#### [2026-05-05] [Instagram] [Carousel] — Series 1: Proveniensen forst

**Caption:**
Var kommer affischerna fran?

Det ar forsta fragan vi staller. Inte "Vad star det?" utan "Var finns originalet?"

Valaffischmuseet bygger pa Kungliga bibliotekets samlingar. Varje affisch vi visar har ett Regina-ID — bibliotekets unika identifierare. Du kan sjalv ga till KB Digitalt och hitta samma bild, i samma upplosning, med samma metadata.

Varfor spelar det roll?

For att kallkritik borjar med kallan. En affisch utan ursprung ar en bild. En affisch med proveniens ar ett dokument.

Vi listar alltid: KB Digitalt-lank + Regina ID + rattighetsstatus. Transparens ar inte en bonus — det ar metoden.

Svep for att se hur det ser ut i praktiken.

**Alt-text:**
Slide 1: Titelkort "Proveniensen forst" med undertext "Varfor vi alltid visar var affischerna kommer fran".
Slide 2: Helbildsvy av en valaffisch fran 1928 med tydlig typografi.
Slide 3: Screenshot fran KB Digitalt som visar samma affisch med Regina-ID, metadata och "Fritt"-markering.
Slide 4: Narstudium av affischens nederkant med tryckeriuppgifter.
Slide 5: Textslide: "Regina ID: [ID]. Rattighetsstatus: Fritt. Kalla: KB Digitalt."
Slide 6: CTA-kort "Folj bygget. Lansering 2026."

**Hashtags:**
#proveniens #kallkritik #valaffisch #KungligaBiblioteket #KBDigitalt #arkivforskning #kulturarv #metadata #digitalmuseum #transparens #metodfokus #svenskhistoria #designhistoria #grafiskdesign #lansering2026

**Image source:**
[EDITOR: Source needed — recommend 1928 affisch with visible tryckeriuppgifter at bottom. Must have "Fritt" status in KB Digitalt. Regina ID required for both affisch and KB Digitalt screenshot.]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Metodfokus, ingen partirekkommendation.
- Levande person: NEJ (1928 material).
- Lockdown-period: NEJ (publicering 5 maj).
- Kontext ryms: JA.
- Kalla saknas: FLAGGAD — editor must source.
- Rattighetsstatus: FLAGGAD — editor must verify "Fritt".

**Editor notes:**
Carousel behover 5-6 slides. Nyckelgrepp: visa KB Digitalt-interfacet sa publiken forstar var de sjalva kan hitta material. Affisch med synliga tryckeriuppgifter i botten ar idealt — visar att proveniens ar inbyggd i objektet, inte bara patvingad metadata. Publicera mandag morgon.

**Suggested posting:** Mandag 2026-05-05, 08:00

---

#### [2026-05-05] [LinkedIn] [Long-form] — Series 1: Proveniensen forst

**Caption:**
Var kommer affischerna fran?

Det ar forsta fragan vi staller nar vi valjer material till Valaffischmuseet. Inte "Vad sager den?" utan "Var finns originalet?"

Museet bygger pa Kungliga bibliotekets samlingar — specifikt de digitaliserade politiska affischerna i KB Digitalt. Varje bild vi visar har ett Regina-ID, bibliotekets unika identifierare. Du kan sjalv navigera till samma kalla och verifiera vad du ser.

Det har ar inte en formalitet. Det ar grundlaget.

En affisch utan ursprung ar en bild. En affisch med dokumenterad proveniens ar ett historiskt dokument. Skillnaden avgors av sparbarhet.

I praktiken innebar det att varje affisch i museet presenteras med:
- Direktlank till KB Digitalt
- Regina-ID for entydig identifiering
- Rattighetsstatus (vi publicerar endast "Fritt"-material)
- Datering och upphovsuppgifter dar de finns

For forskare, larare och journalister betyder det att ni kan verifiera utan att fraga oss. For alla andra betyder det att ni vet vad ni tittar pa.

Transparens ar inte en bonusfunktion. Det ar den kuratoriska metoden.

Mer om urvalsprocessen under veckorna som kommer. Vi bygger i det oppna.

**Alt-text:**
Valaffisch fran 1928 med tydlig typografi, visad bredvid en screenshot fran KB Digitalt som visar samma affisch med metadata och Regina-ID.

**Hashtags:**
#kallkritik #proveniens #digitalmuseum #KungligaBiblioteket #kulturarv #arkivforskning #transparens #metadata #valaffisch #designhistoria

**Image source:**
[EDITOR: Same affisch as Instagram carousel, or side-by-side layout showing affisch + KB Digitalt metadata view]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check: PASS (same as Instagram version).

**Editor notes:**
LinkedIn-version ar langre och forklarar "varfor detta spelar roll" for en professionell publik. Larare och journalister ar primarmottagare — de behover veta att kallorna ar verifierbara. Kan publiceras samma dag som Instagram.

**Suggested posting:** Mandag 2026-05-05, 09:00

---

#### [2026-05-06] [Instagram] [Reel 45 sek] — Series 2: Detaljen avgor

**Caption:**
Zooma in tills du ser hur affischen gjordes.

Det har ar en valaffisch fran 1948. Pa avstand ser du budskapet. Pa nara hall ser du tekniken.

Rasterpunkter. Registreringsmarken. Pappersstruktur. Kanske till och med ett fingeravtryck fran tryckeriet.

IIIF-tekniken later dig ga fran propaganda till materialitet. Fran "vad sager den" till "hur gjordes den".

Detaljen avgor. Och detaljen ar nu tillganglig.

Valaffischmuseet. Lansering 2026.

**Alt-text:**
Video: Borjar med helbildsvy av en valaffisch fran 1948 i daliga pastellfarger. Sakta zoom in pa ett textparti tills rasterpunkter blir tydliga. Fortsatt zoom visar pappersstruktur och trycktekniska detaljer. Zoomt ut igen till helbild. Text-overlay forklarar vad vi ser vid varje zoomniva.

**Hashtags:**
#IIIF #deepzoom #tryckhistoria #valaffisch #rasterpunkter #grafiskdesign #kulturarv #materialitet #KungligaBiblioteket #digitalmuseum #zoom #pixlar #designdetaljer #arkivteknik #sverigeshistoria

**Image source:**
[EDITOR: Source needed — recommend 1948 affisch med intressant fargpalett och tydlig rastertryckning. "Fritt" status, Regina ID TBD. Behover affisch dar zoomningen avsljojar nagot — inte bara "mer av samma".]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Teknik/materialfokus.
- Levande person: NEJ (1948 material, kontrollera att inga identifierbara portrott).
- Lockdown-period: NEJ.
- Kontext ryms: JA.
- Kalla saknas: FLAGGAD.
- Rattighetsstatus: FLAGGAD.

**Reel-skript (voiceover eller text-overlay):**
[0-5 sek] Helbildsvy. Text: "En valaffisch fran 1948."
[5-12 sek] Sakta zoom mot textparti. Text: "Pa avstand ser du budskapet."
[12-22 sek] Narstudium av rasterpunkter. Text: "Pa nara hall ser du tekniken. Rasterpunkter. Registreringsmarken."
[22-32 sek] Annu narmare — pappersstruktur. Text: "Pappersstruktur. Kanske ett fingeravtryck fran tryckeriet."
[32-40 sek] Sakta zoomut. Text: "Fran propaganda till materialitet."
[40-45 sek] Helbild + logotyp. Text: "Valaffischmuseet. Lansering 2026."

**Editor notes:**
Langre reel (45 sek) for att hinna bygga upp zoom-upplevelsen. Krav: skarminspelning av IIIF-viewer med faktisk KB-affisch. Affischen maste ha visuellt intressanta detaljer vid hog upplosning — inte bara "suddig text blir skarp text".

**Suggested posting:** Tisdag 2026-05-06, 12:00

---

#### [2026-05-06] [TikTok] [Reel 30 sek] — Series 2: Detaljen avgor

**Caption:**
Zooma in pa en 80 ar gammal valaffisch tills du ser rasterpunkterna. Sa ser du hur den trycktes — inte bara vad den sager. Det ar IIIF. Det ar Valaffischmuseet.

#valaffisch #zoom #tryckhistoria #arkiv #kulturhistoria #design #detaljer #fyp #lartiktok #svenskhistoria #pixlar

**Alt-text:**
Video: Komprimerad version av Instagram-reel — snabbare zoom fran helbild till rasterpunkter och tillbaka.

**Image source:**
[EDITOR: Same as Instagram reel]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
TikTok-version ar snabbare (30 sek) och mer "punch". Samma video men tightare klipp. Hook inom forsta 2 sekunderna.

**Suggested posting:** Tisdag 2026-05-06, 17:00

---

#### [2026-05-07] [Instagram] [Single image] — Series 3: Bygget i det oppna #3

**Caption:**
Veckans screenshot fran bygget.

Soksidan. Hur hittar du ratt affisch bland hundratals?

Vi bygger filter for: artal, parti (historiska namn), farg, typografisstil, retoriskt grepp. Du ska kunna soka pa "1950-tal + rod + hotnbild" och fa relevanta traffar.

Det ar inte AI-magi. Det ar manuell taggning baserad pa kuratorisk bedomning.

Mer fran bygget nasta vecka.

**Alt-text:**
Screenshot av en sokgranssnitt med filtermenyer pa vanstersidan. Synliga filter inkluderar "Artal" (reglage 1920-1988), "Farg" (fargrutor), och "Retoriskt grepp" (dropdown-meny). Hogersidan visar ett rutnot av affisch-thumbnails.

**Hashtags:**
#uxdesign #filterdesign #sokgranssnitt #digitalmuseum #valaffisch #webbutveckling #byggideboppna #kuratorisk #taggning #metadata #lansering2026 #kulturarv

**Image source:**
[EDITOR: Screenshot from search interface mockup or prototype. If not ready, Figma mockup acceptable.]

**Phase compliance:**
Fas 1. Kill criteria check:
- Valppaverkan: NEJ. Bygginnehall.
- Levande person: NEJ.
- Kalla saknas: N/A (byggscreenshot).
- Rattighetsstatus: N/A.
- Notering: Om thumbnails visar faktiska affischer, maste de vara "Fritt"-verifierade.

**Editor notes:**
Soksidan ar ett bra "bygget i det oppna"-innehall — visar att museet ar mer an en bildbank. Om thumbnails i screenshoten ar faktiska affischer, kontrollera deras rattighetsstatus. Alternativt: anvand placeholder-rutor.

**Suggested posting:** Onsdag 2026-05-07, 08:00

---

#### [2026-05-07] [Mastodon] [Single image] — Series 3: Bygget i det oppna #3

**Caption:**
Bygger sokfunktionen for Valaffischmuseet. Filter for artal, farg, typografi, retoriskt grepp. Manuell taggning — ingen AI-magi.

Malet: du ska kunna soka pa "1950-tal + hotnbild + rod" och fa relevanta traffar.

Lansering 2026.

#valaffisch #digitalmuseum #uxdesign #kulturarv #sokfunktion #metadata

**Alt-text:**
Screenshot av sokgranssnitt med filtermeny och affisch-thumbnails.

**Image source:**
[EDITOR: Same as Instagram]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
Mastodon-version kortare. "Ingen AI-magi" resonerar med den teknikkritiska publiken dar.

**Suggested posting:** Onsdag 2026-05-07, 09:00

---

#### [2026-05-08] [Instagram] [Carousel 7 slides] — Series 4: Vem ar avsandaren?

**Caption:**
Kallkritik 101: Vem ar avsandaren?

Forsta fragan du staller till en valaffisch: Vem har gjort den?

Det later enkelt. Det ar det inte alltid.

Ibland star partiet med namn och logotyp. Ibland bara en bokstavsforkortning. Ibland en "medborgarkommitte" som doljer den egentliga avsandaren.

Sa har hittar du svaret:

1. Leta efter logotyp eller partinamn — ofta langst ned.
2. Kolla tryckeriuppgifter — de kan avsloja bestaollaren.
3. Jamfor med kanda affischserier fran samma val.
4. Nar du inte hittar: det kan vara meningen.

Anonymitet ar ocksa ett val.

Svep for att se tre exempel fran 1930- och 40-talet.

Nasta vecka: Nar trycktes den?

**Alt-text:**
Slide 1: Titelkort "Kallkritik 101" med undertext "Vem ar avsandaren?"
Slide 2: Valaffisch fran 1936 med tydlig partilogotyp langst ned.
Slide 3: Narstudium av logotypen med pil och text "Avsandaren ar tydlig."
Slide 4: Annan affisch fran 1944 utan tydlig avsandare.
Slide 5: Narstudium av nederkanten — bara tryckerinamn, ingen partimarkering.
Slide 6: Textslide med listan "Sa hittar du avsandaren" (4 punkter).
Slide 7: CTA-kort "Kallkritik 101 — fortsattning nasta vecka."

**Hashtags:**
#kallkritik #valaffisch #avsandare #propaganda #retorik #mediekritik #historiskanalys #kulturarv #KungligaBiblioteket #digitalmuseum #grafiskdesign #politiskaffisch #1930tal #1940tal #larartips

**Image source:**
[EDITOR: Source needed — TWO affischer:
1. En med TYDLIG avsandare (partilogotyp synlig), forslag 1936 bondeforbundet eller SAP
2. En med OTYDLIG avsandare (ingen logotyp, bara tryckeri), forslag 1944 medborgarkommitte-stil
Bada maste ha "Fritt" status, Regina ID kravs.]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Metodfokus — vi llar hur man laser affischer, inte vilka budskap som var "ratt".
- Levande person: NEJ (1936/1944 material).
- Lockdown-period: NEJ.
- Kontext ryms: JA — carousel-format tillater mer utrymme.
- Kalla saknas: FLAGGAD — editor must source.
- Rattighetsstatus: FLAGGAD — editor must verify "Fritt".
- EXTRA GRANSKNING: Eftersom serien handlar om att analysera politiska affischer, dubbelkolla att tonen ar rent metodisk. Ingen vardering av partiernas budskap — bara "sa har identifierar du vem som talar."

**Editor notes:**
FORSTA POSTEN i Series 4 (Kallkritik 101). Den har serien ar den kansligaste — den handlar om att analysera politiska affischer. Nyckel: metodfokus, inte politisk bedomning. Vi llar publiken hur man laser, inte vad de ska tycka. Tva kontrastexempel (tydlig vs otydlig avsandare) ar pedagogiskt effektivt. Foreslagna artal (1936, 1944) ar sakra — tillrackligt gamla for att inga levande personer ar relevanta.

**Suggested posting:** Torsdag 2026-05-08, 12:00

---

#### [2026-05-08] [LinkedIn] [Long-form] — Series 4: Vem ar avsandaren?

**Caption:**
Kallkritik 101: Vem ar avsandaren?

Nar du mater en historisk valaffisch ar forsta fragan inte "Vad sager den?" utan "Vem sager det?"

Det later enkelt. I praktiken ar det ofta mer komplicerat an vad det forsta intrycket antyder.

Ibland ar avsandaren tydlig: partilogotyp, namn, adress. Men historiska affischer anvander ocksa:
- Bokstavsforkortningar som forutsatter samtida kunskap
- "Medborgarkommitteer" som doljer partianknytning
- Inga avsandaruppgifter alls — anonymitet som strategi

Sa har gar du tillvaga:

1. **Leta efter visuella markorar.** Logotyper och partisymboler placeras ofta langst ned, ibland diskret.

2. **Kontrollera tryckeriuppgifterna.** Svenska tryckerier var ibland knutna till specifika partier. Tryckorten kan avsloja bestallaren.

3. **Jamfor med kanda serier.** Partier anvande ofta enhetlig grafisk profil under en valrorelse. En affisch utan avsandare kan anda tillhora en identifierbar kampanj.

4. **Nar avsandaren saknas: notera det.** Anonymitet ar en retorisk strategi, inte en brist pa information.

I Valaffischmuseet visar vi alltid den information vi har — och markerar tydligt nar den saknas. Kallkritik borjar med att vara arlig om vad vi vet och inte vet.

Nasta vecka: Nar trycktes den? Vad dateringen avsllojar om affischens funktion.

**Alt-text:**
Tva valaffischer sida vid sida: en fran 1936 med tydlig partilogotyp, en fran 1944 utan synlig avsandare. Pilar pekar pa relevanta detaljer.

**Hashtags:**
#kallkritik #mediekunskap #historiskanalys #valaffisch #propaganda #retorik #designhistoria #kulturarv #KungligaBiblioteket #larartips

**Image source:**
[EDITOR: Same as Instagram carousel — side-by-side layout of both affischer]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check: PASS (same methodology focus as Instagram).
EXTRA GRANSKNING: LinkedIn-versionen ar mer detaljerad — skarstadad for metodisk ton. Ingen vardering av nagot partis politik, bara teknik for att identifiera avsandare.

**Editor notes:**
LinkedIn-versionen expanderar resonemanget for en professionell publik (larare, journalister, kommunikatorer). Dessa ar primarmottagare for "Kallkritik 101"-serien. Kan publiceras samma dag som Instagram.

**Suggested posting:** Torsdag 2026-05-08, 13:00

---

#### [2026-05-09] [Instagram] [Single image] — Series 3: Bygget i det oppna #4

**Caption:**
Veckans screenshot.

Tillganglighetstest. Skarmallasaren laser upp affischens slogan + metadata. Men ar ordningen ratt? Ar spraket begripligt?

Vi testar med NVDA och VoiceOver. Feedback valkomnas — vi bygger ju i det oppna.

Nasta vecka: hur sokmotorerna ser museet.

**Alt-text:**
Screenshot av utvecklarverktyg som visar en tillganglighetsgranskningsrapport. Granskade element inkluderar alt-text for affischbild, rubrikhierarki och fokusordning. Nagra varningsmarkeringar synliga.

**Hashtags:**
#a11y #tillganglighet #skarmlosare #NVDA #VoiceOver #webbutveckling #inkluderandedesign #digitalmuseum #valaffisch #byggideboppna #ux #wcag #lansering2026

**Image source:**
[EDITOR: Screenshot from accessibility testing — browser devtools, WAVE report, or screen reader output. Redact any sensitive info.]

**Phase compliance:**
Fas 1. Kill criteria check: PASS (bygginnehall, inget affischmaterial i fokus).

**Editor notes:**
Tillganglighetsfokus ar starkt "bygg i det oppna"-innehall. Visar att museet tar inkludering pa allvar. Om nagra faktiska fel syns i screenshoten — det ar OK, det ar arbete pagaende.

**Suggested posting:** Fredag 2026-05-09, 12:00

---

#### [2026-05-09] [Bluesky] [Single image] — Series 3: Bygget i det oppna #4

**Caption:**
Tillganglighetstest for Valaffischmuseet. Kollar att skarmlosare laser upp affischerna i rott ordning, med begriplig kontext.

Testar med NVDA + VoiceOver. Feedback valkomnas.

Lansering 2026. #a11y #digitalmuseum #valaffisch #tillganglighet

**Alt-text:**
Screenshot fran tillganglighetstest.

**Image source:**
[EDITOR: Same as Instagram]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
Bluesky har en tillganglighets-medveten publik. #a11y-hastaggen ar relevant.

**Suggested posting:** Fredag 2026-05-09, 12:30

---

### V.19 SUMMARY

| Day | Platform | Series | Format | Affisch needed? | Status |
|-----|----------|--------|--------|-----------------|--------|
| Mon 5 | Instagram | S1: Proveniensen | Carousel | YES | SOURCE NEEDED |
| Mon 5 | LinkedIn | S1: Proveniensen | Long-form | YES | SOURCE NEEDED |
| Tue 6 | Instagram | S2: Detaljen avgor | Reel 45s | YES | SOURCE NEEDED |
| Tue 6 | TikTok | S2: Detaljen avgor | Reel 30s | YES | SOURCE NEEDED |
| Wed 7 | Instagram | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Wed 7 | Mastodon | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Thu 8 | Instagram | S4: Kallkritik 101 | Carousel 7s | YES | SOURCE NEEDED (x2) |
| Thu 8 | LinkedIn | S4: Kallkritik 101 | Long-form | YES | SOURCE NEEDED (x2) |
| Fri 9 | Instagram | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Fri 9 | Bluesky | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |

**Total V.19:** 10 posts across 5 platforms
**Blocked:** 0
**Needs sourcing:** 6 (affischer — 4 unique affischer total: 1 for S1, 1 for S2, 2 for S4), 4 (screenshots)

**Series 4 note:** This is the FIRST post in Kallkritik 101. Extra editorial attention recommended — the series analyzes political affischer and must maintain strict methodological focus. No evaluation of political messages.

---

---

### V.20 DRAFTS (2026-05-12 to 2026-05-18)

**Status:** AWAITING EDITOR REVIEW

**Editor override:** Generated per explicit editor request (2026-04-27), overriding Fas 0 passive mode.

**Series coverage this week:**
- Series 1 (Urvalskriterierna): "Upphovsratten styr" — why we focus 1920-1980, what "Fritt" means, KB's rights framework
- Series 2 (IIIF i praktiken): "Fran KB till webben" — the pipeline from physical archive to digital museum
- Series 3 (Bygget i det oppna): 2 work-in-progress posts
- Series 4 (Kallkritik 101): "Nar trycktes den?" — dating affischer, what the printing reveals

---

#### [2026-05-12] [Instagram] [Carousel 6 slides] — Series 1: Upphovsratten styr

**Caption:**
Varfor visar vi bara affischer fran 1920–1980?

Svaret ar inte politik. Det ar upphovsratt.

En affisch ar ett verk. Formgivaren har rattigheter. I Sverige galler upphovsratten i 70 ar efter upphovspersonens dod. For en affisch fran 1985 dar formgivaren levde till 2000 — da ar verket skyddat till 2070.

Vi vill kunna visa, zooma, beskara, analysera. Det kraver rattigheter vi inte har for nyare material.

Kungliga biblioteket markar sina digitaliserade verk med rattighetsstatus. "Fritt" betyder: fri anvandning, inga restriktioner. Det ar var utgangspunkt.

1920–1980 ar inte ett nostalgival. Det ar den zon dar kallorna ar oppna och transparensen ar mojlig.

Svep for att se hur KB:s rattighetssystem fungerar.

**Alt-text:**
Slide 1: Titelkort "Upphovsratten styr" med undertext "Varfor vi fokuserar pa 1920–1980".
Slide 2: Tidslinje som visar 70-arsregeln for upphovsratt med markering av "sakra" och "osokra" perioder.
Slide 3: Screenshot fran KB Digitalt som visar en affisch med "Fritt"-markering i metadatapanelen.
Slide 4: Samma vy med "Begransad atkomst"-markering pa en annan affisch — visar kontrasten.
Slide 5: Infografik: "Fritt = fri anvandning, zooma, beskara, analysera. Begransad = endast visning pa KB."
Slide 6: CTA-kort "Transparens forst. Valaffischmuseet 2026."

**Hashtags:**
#upphovsratt #kulturarv #KungligaBiblioteket #KBDigitalt #rattighetsstatus #fritt #offentligdata #valaffisch #digitalmuseum #transparens #oppnadata #arkivforskning #designhistoria #metodfokus #lansering2026

**Image source:**
[EDITOR: Source needed — TWO screenshots from KB Digitalt:
1. En affisch med tydlig "Fritt"-markering (recommend 1930-tal material)
2. En affisch med "Begransad atkomst"-markering (for contrast, will not be used in museum — only for educational purpose in this post)
Regina IDs for the "Fritt" affisch required.]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Metodfokus om rattighetshantering, ingen partirekkommendation.
- Levande person: NEJ (1930-tal material).
- Lockdown-period: NEJ (publicering 12 maj).
- Kontext ryms: JA — carousel tillater fullstandig forklaring.
- Kalla saknas: FLAGGAD — editor must source KB Digitalt screenshots.
- Rattighetsstatus: FLAGGAD — "Fritt"-affisch maste verifieras.

**Editor notes:**
Nyckelpost for att forklara varfor museet har den tidsmassiga avgransning det har. Rattighetsfokus ar sakert — det ar juridik, inte politik. Kan atervinnas som FAQ-innehall pa sjalva museiwebbplatsen. Publicera mandag morgon for veckostart.

**Suggested posting:** Mandag 2026-05-12, 08:00

---

#### [2026-05-12] [LinkedIn] [Long-form] — Series 1: Upphovsratten styr

**Caption:**
Varfor visar Valaffischmuseet bara affischer fran 1920–1980?

Svaret ar inte nostalgi. Det ar upphovsratt.

En valaffisch ar ett grafiskt verk. Formgivaren — ofta anonym, men ibland kand — har upphovsratt. I Sverige galler skyddet i 70 ar efter upphovspersonens dod. For en affisch fran 1988 dar formgivaren avled 2010 ar verket skyddat till 2080.

Vi vill kunna gora mer an bara visa. Vi vill zooma in pa tryckdetaljer, beskara for analys, jamfora kompositioner. Det kraver rattigheter som vi inte har for nyare material — och som skulle krava individuella avtal att forvarva.

Kungliga biblioteket, var kallpartner, anvander ett rattighetssystem for digitaliserade verk:

- **Fritt**: Ingen upphovsrattslig begransning. Fri anvandning.
- **Begransad atkomst**: Visning endast pa KB:s terminaler eller i forskningssyfte.

Valaffischmuseet publicerar endast material med "Fritt"-status. Ingen affisch gar ut utan att vi forst verifierat rattigheterna i KB Digitalt.

1920–1980 ar den zon dar tva kriterier sammanfaller: kallorna ar digitaliserade och rattighetsstatusen ar klarlagd. Det ar inte en konstnarllig gransdragning — det ar en juridisk.

Om du arbetar med kulturarv, arkiv eller digital publicering: det har ar verkligheten. Upphovsratten styr vad som ar mojligt att gora offentligt — oavsett hur angelaget materialet ar.

Vi bygger i det oppna. Rattighetsmodellen ar en del av det.

**Alt-text:**
Infografik som visar KB Digitalts rattighetssystem: "Fritt" (gron markering) vs "Begransad atkomst" (gul markering), med pilar som visar vad varje status tillater.

**Hashtags:**
#upphovsratt #kulturarv #digitalarkiv #KungligaBiblioteket #oppnadata #rattigheter #designhistoria #valaffisch #transparens #arkivarbete

**Image source:**
[EDITOR: Same as Instagram — infografik eller KB Digitalt-screenshot med "Fritt"-markering]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check: PASS (same methodology focus as Instagram).

**Editor notes:**
LinkedIn-versionen ar mer detaljerad och riktar sig till kulturarvsprofessionella, arkivarier, jurister. Forklarar "varfor" pa en djupare niva. Kan publiceras samma dag som Instagram.

**Suggested posting:** Mandag 2026-05-12, 09:00

---

#### [2026-05-13] [Instagram] [Reel 60 sek] — Series 2: Fran KB till webben

**Caption:**
Hur tar sig en 90 ar gammal pappersaffisch fran ett arkiv i Humlegarden till din telefonskarm?

Det har ar pipelinen.

1. Fysiskt original i KB:s magasin
2. Hogupplosningsskanning (300+ DPI)
3. Metadata-registrering i Regina
4. IIIF-manifest genereras
5. Bild serveras via KB:s bildserver
6. Valaffischmuseet hamtar och visar

Sex steg fran papper till pixel. Samma bild, samma upplosning, samma metadata — oavsett var du tittar.

Det ar inte magi. Det ar infrastruktur. Och den ar oppen.

Valaffischmuseet. Lansering 2026.

**Alt-text:**
Video: Animerad flodesschemat som visar en affischs resa fran fysiskt arkiv till digital visning. Borjar med illustration av arkivhylla, gar genom skanningstation, databasregistrering, IIIF-konvertering och slutar med affischen visad pa en telefonskarm. Varje steg markeras med nummer och kort text.

**Hashtags:**
#IIIF #digitalbevarande #kulturarv #arkivteknik #KungligaBiblioteket #pipeline #digitalisering #oppnadata #infrastruktur #valaffisch #digitalmuseum #metadata #bildserver #tekniskprocess #lansering2026

**Image source:**
[EDITOR: Animated flowchart needed. Options:
1. Motion graphics (After Effects/similar) showing the 6-step pipeline
2. Screen recording walking through each step with actual KB interface
3. Static slides with transitions if animation not feasible
Recommend option 2 for authenticity — actual KB Digitalt screens + IIIF viewer.]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Rent tekniskt innehall.
- Levande person: NEJ.
- Lockdown-period: NEJ.
- Kontext ryms: JA — reel-format tillater visuell forklaring.
- Kalla saknas: N/A (process-forklaring, ingen specifik affisch i fokus — men om affisch visas i demon, maste den vara "Fritt"-verifierad).
- Rattighetsstatus: FLAGGAD om affisch visas.

**Reel-skript (voiceover eller text-overlay):**
[0-5 sek] Hook: "Hur tar sig en 90 ar gammal affisch fran arkiv till din telefon?"
[5-15 sek] Steg 1-2: Fysiskt original + skanning. Visa arkivbild eller skanningsillustration.
[15-25 sek] Steg 3-4: Regina-metadata + IIIF-manifest. Visa KB Digitalt-interface.
[25-40 sek] Steg 5-6: Bildserver + museivy. Visa IIIF-viewer med zoom-demo.
[40-55 sek] Summering: "Sex steg fran papper till pixel."
[55-60 sek] CTA: "Valaffischmuseet. Lansering 2026."

**Editor notes:**
Langre reel (60 sek) for att hinna forklara hela pipelinen. Det har ar det mest tekniska innehallet hittills — balansera med tydlig visuell storytelling. "Infrastruktur ar oppen" ar en nyckelpoang for den teknikintresserade publiken. Kan kravas extern hjalp for motion graphics om vi vill ha polerat resultat.

**Suggested posting:** Tisdag 2026-05-13, 12:00

---

#### [2026-05-13] [TikTok] [Reel 30 sek] — Series 2: Fran KB till webben

**Caption:**
Fran arkivhylla till din telefon pa sex steg. Sa fungerar pipelinen bakom Valaffischmuseet. Ingen magi — bara infrastruktur.

#valaffisch #arkiv #digitalmuseum #IIIF #kulturarv #teknik #pipeline #fyp #lartiktok #svenskhistoria

**Alt-text:**
Video: Komprimerad version av Instagram-reel — snabbare genomgang av de sex stegen med mer punch.

**Image source:**
[EDITOR: Same as Instagram reel — kortare klipp]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
TikTok-version ar snabbare (30 sek) — fokuserar pa hook + payoff utan full forklaring av varje steg. Hook: "Fran arkivhylla till din telefon." Payoff: "Ingen magi — bara infrastruktur."

**Suggested posting:** Tisdag 2026-05-13, 17:00

---

#### [2026-05-14] [Instagram] [Single image] — Series 3: Bygget i det oppna #5

**Caption:**
Veckans screenshot fran bygget.

Datamodellen. Det har ar hur vi strukturerar information om varje affisch.

- Grunddata: artal, parti, tryckeri, Regina-ID
- Visuell analys: dominerande farg, typografistil, komposition
- Retorisk analys: grepp (hotnbild, framtidslöfte, vi-och-dom)
- Kalldata: KB Digitalt-lank, rattighetsstatus

Varje affisch far samma struktur. Det gor jamforelser mojliga och sokning meningsfull.

Ingen AI-taggning. Manuell kuratorisk bedomning.

Mer fran bygget nasta vecka.

**Alt-text:**
Screenshot av ett databasschemat eller spreadsheet som visar kolumnrubriker: "regina_id", "year", "party_historical", "dominant_color", "typography_style", "rhetorical_device", "rights_status". Nagra rader med exempeldata synliga (data ar fiktivt/placeholder).

**Hashtags:**
#datamodell #metadata #kuratorisktarbete #digitalmuseum #valaffisch #supabase #databas #struktureraddata #taggning #byggideboppna #webbutveckling #ux #lansering2026

**Image source:**
[EDITOR: Screenshot from actual Supabase schema or data entry interface. If not ready, use spreadsheet mockup. VIKTIGT: Om faktisk affischdata visas, kontrollera att ingen kanslig information exponeras.]

**Phase compliance:**
Fas 1. Kill criteria check:
- Valppaverkan: NEJ. Bygginnehall om datastruktur.
- Levande person: NEJ.
- Kalla saknas: N/A (datamodell, inte affisch).
- Rattighetsstatus: N/A.
- NOTERING: Om riktiga partinamn syns i exempeldata, anvand historiska namn (Bondeforbundet, ej Centerpartiet).

**Editor notes:**
Datamodell-innehall ar bra "bygg i det oppna" — visar seriositet och transparens. Publiken ser att det inte ar en slumpmassig bildsamling utan ett strukturerat arkiv. Undvik att visa for manga detaljer om Supabase — fokusera pa den konceptuella strukturen.

**Suggested posting:** Onsdag 2026-05-14, 08:00

---

#### [2026-05-14] [Mastodon] [Single image] — Series 3: Bygget i det oppna #5

**Caption:**
Datamodellen bakom Valaffischmuseet. Varje affisch far samma struktur: artal, parti (historiskt namn), farg, typografi, retoriskt grepp, kallhanvisning.

Manuell taggning — ingen AI. Sjalvkritisk bedomning dokumenteras.

Lansering 2026. #valaffisch #digitalmuseum #metadata #kulturarv #oppnadata

**Alt-text:**
Screenshot av databasschema med kolumnrubriker for affischmetadata.

**Image source:**
[EDITOR: Same as Instagram]

**Phase compliance:**
Fas 1. Kill criteria: PASS.

**Editor notes:**
Mastodon-publiken uppskattar transparens om tekniska val. "Manuell taggning — ingen AI" resonerar.

**Suggested posting:** Onsdag 2026-05-14, 09:00

---

#### [2026-05-15] [Instagram] [Carousel 7 slides] — Series 4: Nar trycktes den?

**Caption:**
Kallkritik 101: Nar trycktes den?

En valaffisch utan datum ar ett mysterium. Men trycket sjalvt avslöjar ofta svaret.

Sa har daterar du en affisch:

1. **Tryckeriuppgifter.** Langst ned, ofta i pytteliten text: "AB Centraltryckeriet, Sthlm 1936". Dar har du aret.

2. **Trycktekniken.** Litografi, boktryck, offset — olika epoker dominerades av olika metoder. En fyrfargslitografi pekar mot mellankrigstiden.

3. **Papperskvalitet.** Syns i skanningen. Grovt, obestruket papper = aldre. Glattare ytbehandling = nyare.

4. **Formgivningssprak.** Typsnitt, komposition, farganvandning foljer tidsbundna trender. Funktionalism = 1930-tal. Psykedelisk pop = sent 60-tal.

5. **Politisk kontext.** Vissa budskap gar att koppla till specifika valrorelser — men var forsiktig. Det ar latt att overtolka.

Nar dateringen saknas helt: notera det. "Odaterad, bedomt 1930-tal" ar arligare an en gissning.

Svep for att se exempel pa hur tryckaret avslöjar sig.

**Alt-text:**
Slide 1: Titelkort "Kallkritik 101" med undertext "Nar trycktes den?"
Slide 2: Helbildsvy av en valaffisch fran 1936 med synliga tryckeriuppgifter langst ned.
Slide 3: Narstudium av tryckeriuppgifterna med forstoringsglas-effekt. Text: "AB Centraltryckeriet, Sthlm 1936."
Slide 4: En annan affisch fran 1948 — narstudium av pappersstruktur i hog upplosning.
Slide 5: Jamforelse av tva affischer: en fran 1932 (litografisk) och en fran 1958 (offset). Pilmarkeringar visar tryckteknisk skillnad.
Slide 6: Textslide med listan "5 satt att datera en affisch."
Slide 7: CTA-kort "Kallkritik 101 — fortsattning nasta vecka: Vad ville den gora?"

**Hashtags:**
#kallkritik #valaffisch #datering #tryckhistoria #litografi #offset #papperskvalitet #formgivning #historiskanalys #kulturarv #KungligaBiblioteket #digitalmuseum #grafiskdesign #typografi #larartips

**Image source:**
[EDITOR: Source needed — THREE affischer for maximum pedagogisk effekt:
1. En affisch med TYDLIGA tryckeriuppgifter (forslag 1936 med "AB Centraltryckeriet" eller liknande)
2. En affisch med INTRESSANT pappersstruktur vid zoom (forslag 1948 material)
3. TVA affischer for tryckteknisk jamforelse: en litografisk (1932) + en offset (1958)
Alla maste ha "Fritt" status, Regina ID kravs for samtliga.
NOTERING: Om bara en eller tva affischer finns tillgangliga, kan carousel reduceras till 5-6 slides.]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check:
- Valppaverkan: NEJ. Metodfokus om datering, ingen partirekkommendation.
- Levande person: NEJ (1930-1950-tal material).
- Lockdown-period: NEJ (publicering 15 maj).
- Kontext ryms: JA — carousel tillater fullstandig genomgang.
- Kalla saknas: FLAGGAD — editor must source 3-4 affischer.
- Rattighetsstatus: FLAGGAD — samtliga affischer maste verifieras.
- EXTRA GRANSKNING: Punkt 5 i listan ("Politisk kontext") ar potentiellt kanslig — vi sager uttryckligen "var forsiktig" och fokuserar pa metod, inte bedomning av budskap.

**Editor notes:**
ANDRA POSTEN i Series 4 (Kallkritik 101). Byggjer pa forra veckans "Vem ar avsandaren?" med samma pedagogiska struktur: konkreta verktyg for att analysera affischer. Tryckteknisk vinkel ar sakrare an retorisk — det ar rent materialhistoriskt. Punkt 5 ar medvetet vag for att undvika att framsta som politisk analys. Carousel kraever fler affischer an tidigare posts — om sourcing blir svart, reducera till 5 slides och fokusera pa tryckeriuppgifter + teknikjamforelse.

**Suggested posting:** Torsdag 2026-05-15, 12:00

---

#### [2026-05-15] [LinkedIn] [Long-form] — Series 4: Nar trycktes den?

**Caption:**
Kallkritik 101: Nar trycktes den?

En valaffisch utan datummarkering ar ett problem for den som vill anvanda den som kalla. Men trycket sjalvt avslöjar ofta nar affischen gjordes.

Har ar fem metoder:

**1. Tryckeriuppgifter**
Det mest direkta. Langst ned pa affischen, ofta i minimal text, star ibland tryckeri och artal: "AB Centraltryckeriet, Stockholm 1936." Det ar inte alltid dar — men nar det finns ar det den sakraste dateringen.

**2. Tryckteknik**
Olika tekniker dominerade olika perioder:
- Litografi och boktryck = mellankrigstiden
- Offset = efterkrigstiden och framat
- Serigrafi = begransat, men forekom fran 1960-tal

En fyrfargslitografi med synliga rasterpunkter pekar mot 1930-talet. En jamn, skaarp fyrfargsoffset pekar mot 1960 eller senare.

**3. Papperskvalitet**
Syns i hogupplosningsskanning. Grovt, obestruket papper med synliga fibrer ar typiskt for aldre affischer. Glattare ytbehandling och jamn fargabsorption tyder pa nyare material.

**4. Formgivningssprak**
Typsnitt, komposition och farganvandning ar tidsbundna. Funktionalism och konstruktivistiska influenser = 1930-tal. Psykedeliska farger och organiska former = sent 1960-tal. Men var forsiktig: formsprak ar indicier, inte bevis.

**5. Politisk kontext**
Vissa budskap gar att koppla till specifika val — men detta kraver forkunskap om valrorelsen och riskerar overtolkning. Anvand som komplement, inte primar daterings metod.

**Nar dateringen saknas helt**
Notera det. "Odaterad, bedomt 1930-tal baserat pa tryckteknik och formsprak" ar arligare an en saker gissning. Transparens om osakerhet ar en del av kallkritiken.

I Valaffischmuseet visar vi alltid dateringsinformation dar den finns — och markerar tydligt nar den ar en bedomning snarare an ett faktum.

Nasta vecka: Vad ville affischen gora? Hur man analyserar retorisk avsikt utan att vardera budskapet.

**Alt-text:**
Narstudium av en valaffischs nederkant fran 1936, dar tryckeriuppgifter syns: "AB Centraltryckeriet, Stockholm 1936".

**Hashtags:**
#kallkritik #historiskanalys #tryckteknik #litografi #datering #valaffisch #kulturarv #KungligaBiblioteket #designhistoria #larartips

**Image source:**
[EDITOR: Same as Instagram — fokusera pa affisch med synliga tryckeriuppgifter]

**Phase compliance:**
Fas 1 — Bygg i det oppna. Kill criteria check: PASS (same methodology focus as Instagram).
EXTRA GRANSKNING: LinkedIn-versionen ar mer detaljerad men haaller samma metodfokus. Punkt 5 tonas ned ytterligare — explicit varning mot overtolkning.

**Editor notes:**
LinkedIn-versionen expanderar metodiken for en professionell publik (larare, journalister, arkivarier). Dessa ar primarmottagare for "Kallkritik 101"-serien. Mer tekniskt detaljerad an Instagram-versionen — passar for den som faktiskt vill kunna tilllampa metoderna.

**Suggested posting:** Torsdag 2026-05-15, 13:00

---

#### [2026-05-16] [Instagram] [Single image] — Series 3: Bygget i det oppna #6

**Caption:**
Veckans screenshot fran bygget.

Testa pa riktiga manniskor. Det har ar var forsta anvandartestning — tre personer som aldrig sett museet fore.

Vad vi larde oss:
- "Var ar sokningen?" (den var for gomd)
- "Kan jag zooma?" (ja, men knappen var otydlig)
- "Vad betyder 'retoriskt grepp'?" (vi behover forklara)

Designprocessen ar inte klar forran nagon annan an vi forstar den.

Mer fran bygget nasta vecka.

**Alt-text:**
Screenshot eller foto fran en anvandartestnings-session. En person sitter framfor en dator som visar museets prototyp. Post-it-lappar med anteckningar syns i kanten. Personen ar inte identifierbar (ryggen syns, eller bilden ar beskuren).

**Hashtags:**
#uxtest #anvandartestning #usertesting #feedback #designprocess #digitalmuseum #valaffisch #iteration #byggideboppna #uxdesign #prototyp #lansering2026

**Image source:**
[EDITOR: Photo from actual user testing session, or staged mockup. VIKTIGT: Ingen identifierbar person far synas — fota bakifran eller beskara. Om ingen bild finns, anvand screenshot av testrapport/anteckningar istallet.]

**Phase compliance:**
Fas 1. Kill criteria check:
- Valppaverkan: NEJ. Bygginnehall om designprocess.
- Levande person: KONTROLLERAS — bilden maste beskares sa personen inte ar identifierbar.
- Kalla saknas: N/A (processinnehall).
- Rattighetsstatus: N/A.

**Editor notes:**
Anvandartestnings-innehall ar bra transparens — visar att vi tar feedback pa allvar och inte bygger i isolation. De tre "lardomarna" i captionen ar specifika och trovardiga. Om bilden visar en person: MASTE vara bakifran eller beskuren sa ansiktet inte syns.

**Suggested posting:** Fredag 2026-05-16, 12:00

---

#### [2026-05-16] [Bluesky] [Single image] — Series 3: Bygget i det oppna #6

**Caption:**
Anvandartestning for Valaffischmuseet. Tre personer som aldrig sett prototypen.

Lardom: sokningen var for gomd, zoom-knappen otydlig, "retoriskt grepp" behover forklaras.

Itererar vidare. Lansering 2026. #valaffisch #uxtest #digitalmuseum #designprocess

**Alt-text:**
Screenshot fran anvandartestning (inga identifierbara personer).

**Image source:**
[EDITOR: Same as Instagram — kontrollera att ingen identifierbar person syns]

**Phase compliance:**
Fas 1. Kill criteria: PASS (forutsatt bildkontroll).

**Editor notes:**
Bluesky-publiken uppskattar process-transparens.

**Suggested posting:** Fredag 2026-05-16, 12:30

---

### V.20 SUMMARY

| Day | Platform | Series | Format | Affisch needed? | Status |
|-----|----------|--------|--------|-----------------|--------|
| Mon 12 | Instagram | S1: Upphovsratten | Carousel 6s | YES (KB screenshots) | SOURCE NEEDED |
| Mon 12 | LinkedIn | S1: Upphovsratten | Long-form | YES | SOURCE NEEDED |
| Tue 13 | Instagram | S2: Fran KB till webben | Reel 60s | OPTIONAL | ANIMATION/RECORDING NEEDED |
| Tue 13 | TikTok | S2: Fran KB till webben | Reel 30s | OPTIONAL | ANIMATION/RECORDING NEEDED |
| Wed 14 | Instagram | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Wed 14 | Mastodon | S3: Bygget | Single image | NO | SCREENSHOT NEEDED |
| Thu 15 | Instagram | S4: Kallkritik 101 | Carousel 7s | YES (3-4 affischer) | SOURCE NEEDED |
| Thu 15 | LinkedIn | S4: Kallkritik 101 | Long-form | YES | SOURCE NEEDED |
| Fri 16 | Instagram | S3: Bygget | Single image | NO | PHOTO/SCREENSHOT NEEDED |
| Fri 16 | Bluesky | S3: Bygget | Single image | NO | PHOTO/SCREENSHOT NEEDED |

**Total V.20:** 10 posts across 5 platforms
**Blocked:** 0
**Needs sourcing:** 4 (affischer — 3-4 unique for S4 dating, KB screenshots for S1), 4 (screenshots/photos), 2 (animation/screen recording for S2)

**Production note:** V.20 har hogre produktionskrav an tidigare veckor:
- S1 (Upphovsratten) kraver KB Digitalt screenshots med bade "Fritt" och "Begransad" status
- S2 (Fran KB till webben) kraver animerad grafik eller skarmavspelning av hela pipelinen
- S4 (Nar trycktes den?) kraver 3-4 affischer med varierande trycktekniker

Rekommendation: borja affisch-sourcing och animation-planering omedelbart.

---

---

## Blocked / needs editor attention

_Drafts the agent flagged against kill criteria, or open questions the agent surfaced. Editor handles before next agent run._

### Pre-drafting blockers for May plan:

1. **KB Digitalt access verification needed.** Agent cannot confirm which specific affischer are available with "Fritt" status. Before first weekly draft run, editor should:
   - Verify access to KB Digitalt
   - Confirm at least 10 affischer from 1920-1960 with "Fritt" status
   - Provide Regina IDs or direct URLs for the verified affischer pool

2. **Social accounts not yet created.** Series plan assumes "Valaffischmuseet" handles exist on Instagram, TikTok, LinkedIn, Mastodon, Bluesky. Editor should confirm account creation before first publish.

3. **Krishanteringsplan due in Fas 1.** Per the brief, a crisis management plan (takedown mandate + public statement template) should be prepared during this phase. Suggest completing before Fas 2 transition on June 1.

---

## Recently published (last 4 weeks)

_What actually went live, mirrored back from Buffer/Later/Hootsuite (or manually noted). Agent uses this to avoid repetition and to learn what voice landed._

_(empty — no content published yet)_

---

## Open questions for editor

_Things the agent cannot resolve alone. Default answers from the canonical brief in parentheses where applicable._

- Kontonamn pa social? (default: "Valaffischmuseet") **— Confirm before account creation**
- Sprak-mix? (default: svenska primart, engelska for utvalda long-form) **— May plan assumes svenska only**
- Volym per kanal/vecka? (default: 2-3 IG, 1-2 TikTok, 1 LinkedIn, 1 nyhetsbrev/manad) **— May plan runs slightly above default. OK?**
- Larar-material — solo eller partnerskap? (default: prototyp solo i Fas 3, partnerskap for skala)
- Krishanteringsplan — vem har takedown-mandate och vilken public-statement-mall? (forbereds i Fas 1) **— Due before June 1**

### New questions from May planning:

- **Build content permissions:** Can we share UI mockups and Supabase schema snippets publicly? Any NDA or pre-launch confidentiality concerns?
- **KB filming:** The brief mentions "korta videos fran KB:s arkiv (om vi far filma dar)". Has permission been requested? If not, Series 2 (IIIF) may need to rely on screen recordings only.
- **Nyhetsbrev:** Brief specifies 1/month. Should May include newsletter #1, or wait until Fas 2 launch?

---

## Voice check — Fas 1 calibration

Before drafting individual posts, confirm this register sounds right:

> "Det har ar en affisch fran 1932. Vi valde den for typografin — inte for budskapet. Fontvalet sager nagot om sin tid. Budskapet far du avgora sjalv."

> "Varfor visar vi inte moderna affischer? Upphovsratten. Vi borjar dar riskerna ar laga och kallorna ar oppna. Transparens forst."

> "IIIF later som en akronym fran en IT-avdelning. Det ar det ocksa. Men det ar ocksa hur du kan studera en affisch fran 1936 pa pixelniva — nagot som aldrig gick innan digitaliseringen."

If this voice is wrong, flag before weekly drafting begins.

---

## Run log

_Append-only chronological record. Format: `## [YYYY-MM-DD] mode | summary`_

## [2026-04-27] init | Editorial plan created from template. Agent campaign-curator wired up at .claude/agents/. Awaiting first monthly planning run.

## [2026-04-27] monthly-plan | May 2026 series plan generated. Four series proposed aligned with Fas 1 (Bygg i det oppna): (1) Urvalskriterierna, (2) IIIF i praktiken, (3) Bygget i det oppna, (4) Kallkritik 101. Total planned: ~38 posts across channels. Three blockers flagged for editor attention before weekly drafting can begin. Awaiting editor approval of series plan.

## [2026-04-27] weekly-draft V.18 | Generated 8 post drafts for week 18 (Apr 28 - May 4). Breakdown: 2x Series 1 (Urvalskriterierna) on IG carousel + LinkedIn long-form; 2x Series 2 (IIIF) on IG reel + TikTok; 4x Series 3 (Bygget) on IG, Mastodon, Bluesky. Zero posts blocked against kill criteria. All posts pass Fas 1 compliance. Sourcing needed: 4 posts require affisch from KB Digitalt with "Fritt" status (editor to verify), 4 posts require build screenshots (editor to provide or confirm mockups OK). Series 4 (Kallkritik 101) begins V.19 per plan. Ready for editor review.

## [2026-04-27] weekly-draft V.19 | Generated 10 post drafts for week 19 (May 5-11). Breakdown: 2x Series 1 "Proveniensen forst" (IG carousel + LinkedIn long-form); 2x Series 2 "Detaljen avgor" (IG reel 45s + TikTok reel 30s); 4x Series 3 Bygget i det oppna (IG x2, Mastodon, Bluesky — search interface + a11y testing); 2x Series 4 "Vem ar avsandaren?" FIRST POST in Kallkritik 101 (IG carousel 7 slides + LinkedIn long-form). Zero posts blocked against kill criteria. All posts pass Fas 1 compliance. Series 4 flagged for extra editorial attention — analyzes political affischer, must maintain strict methodological focus. Sourcing needed: 4 unique affischer (1 for S1 proveniens demo, 1 for S2 zoom demo, 2 for S4 avsandar-kontrast), 4 build screenshots. Ready for editor review.

## [2026-04-27] weekly-draft V.20 | EDITOR OVERRIDE — generated per explicit request, Fas 0 passive mode bypassed. 10 post drafts for week 20 (May 12-18). Breakdown: 2x Series 1 "Upphovsratten styr" (IG carousel 6s + LinkedIn long-form, KB rights framework focus); 2x Series 2 "Fran KB till webben" (IG reel 60s + TikTok reel 30s, full IIIF pipeline explainer); 4x Series 3 Bygget i det oppna (IG x2, Mastodon, Bluesky — data model + user testing); 2x Series 4 "Nar trycktes den?" SECOND post in Kallkritik 101 (IG carousel 7s + LinkedIn long-form, dating methodology). Zero posts blocked against kill criteria. All posts pass Fas 1 compliance. V.20 has higher production requirements than prior weeks: S1 needs KB Digitalt screenshots, S2 needs animation/screen recording, S4 needs 3-4 affischer with varying print techniques. Sourcing: 4 affischer for S4, KB screenshots for S1, 4 build screenshots/photos, animation for S2. Ready for editor review.
