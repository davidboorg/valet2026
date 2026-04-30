-- Valaffischmuseet: Migration 004 — Seed SD + Moderaterna 1988-2022
--
-- Källor: Wikipedia (slogans), partiernas egna webbplatser, Wikimedia Commons,
-- Arbetet, Dagens Arbete, Resumé, RFSU, Dagens Opinion m.fl.
--
-- VIKTIGT om upphovsrätt:
-- Affischerna är upphovsrättsskyddade. Vi lagrar metadata + thumbnail med
-- länk till primärkälla. Användning är "fair use" enligt URL §23 (citat för
-- kritik, recension och vetenskaplig framställning).
-- Före publik lansering bör juridisk granskning göras + helst
-- användningstillstånd från resp. partikansli.

-- ===============================================================
-- Säkerställ att partierna finns
-- ===============================================================
INSERT INTO parties (name, abbreviation, founded_year, color, active)
VALUES
  ('Sverigedemokraterna', 'SD', 1988, '#DDDD00', true),
  ('Moderaterna',         'M',  1904, '#52BDEC', true)
ON CONFLICT (name) DO NOTHING;

-- ===============================================================
-- SVERIGEDEMOKRATERNA — riksdagsval 1988-2022
-- ===============================================================
-- Notera: 1988 är grundningsår (feb 1988). Inga kända riksdagsvalaffischer
-- finns från det första valet i sept 1988. Vi lägger ändå in en placeholder-
-- post för historisk kontext.

INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1988
  ('sd_party', 'sd-1988', 'Sverigedemokraterna 1988 — partiets första valrörelse',
   1988, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Sverigedemokraterna',
   'Sverigedemokraterna',
   'unknown',
   'Inga publicerade valaffischer från grundningsåret kunde lokaliseras. Partiet bildades 6 februari 1988 och fick 0,02% i sept-valet.'),

  -- 1991 — Anders Klarström-eran, gamla logon (eldsflamma)
  ('sd_party', 'sd-1991', 'Sverigedemokraterna 1991',
   1991, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
   'Sverigedemokraterna',
   'unknown',
   'Partiledare: Anders Klarström / Madeleine Larsson. Resultat: 0,09%. Få affischer arkiverade publikt.'),

  -- 1994
  ('sd_party', 'sd-1994', 'Sverigedemokraterna 1994',
   1994, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1994',
   'Sverigedemokraterna',
   'unknown',
   'Mikael Jansson tog över partiledarskapet 1995. Resultat 1994: 0,25%.'),

  -- 1998
  ('sd_party', 'sd-1998', 'Sverigedemokraterna 1998',
   1998, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1998',
   'Sverigedemokraterna',
   'unknown',
   'Mikael Jansson partiledare. Resultat: 0,37%.'),

  -- 2002 — slogan "Trygghet och tradition", flamman fortfarande logo
  ('sd_party', 'sd-2002', 'Sverigedemokraterna 2002 — Trygghet och tradition',
   2002, 'Trygghet och tradition', NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
   'Sverigedemokraterna',
   'unknown',
   'Resultat: 1,44%. Genombrott på kommunal nivå i Skåne.'),

  -- 2006 — under spärren men växte
  ('sd_party', 'sd-2006', 'Sverigedemokraterna 2006',
   2006, 'Bevara Sverige svenskt',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2006',
   'Sverigedemokraterna',
   'unknown',
   'Akesson tog över 2005. Resultat 2006: 2,93%, fortfarande utanför riksdagen.'),

  -- 2010 — första intåg i riksdagen
  ('sd_party', 'sd-2010', 'Sverigedemokraterna 2010 — Invandringsbroms eller pensionsbroms?',
   2010, 'Invandringsbroms eller pensionsbroms?',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Jimmesd.jpg/800px-Jimmesd.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Jimmesd.jpg/400px-Jimmesd.jpg',
   'https://commons.wikimedia.org/wiki/File:Jimmesd.jpg',
   'Wikimedia Commons',
   'fair_use',
   'Första valet partiet kom in i riksdagen (5,7%). TV-reklamen "pensionärs-burka" stoppades av TV4.'),

  -- 2014
  ('sd_party', 'sd-2014', 'Sverigedemokraterna 2014 — Förändring på riktigt!',
   2014, 'Förändring på riktigt!',
   'https://da.se/app/uploads/2018/04/skruvat-sd.jpg',
   'https://da.se/app/uploads/2018/04/skruvat-sd.jpg',
   'https://da.se/2018/04/val-uppat-vaggarna/',
   'Dagens Arbete / TT Nyhetsbyrån',
   'fair_use',
   'Resultat: 12,86%. Partiet blev tredje störst.'),

  -- 2018
  ('sd_party', 'sd-2018', 'Sverigedemokraterna 2018 — SD2018',
   2018, 'SD2018',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Sverigedemokraterna',
   'unknown',
   'Resultat: 17,53%. Affischerna kritiserades för anonym/personifierad estetik.'),

  -- 2022 — historiskt val, blev näst störst
  ('sd_party', 'sd-2022-manifest', 'Sverigedemokraterna 2022 — Sverige ska bli bra igen',
   2022, 'Sverige ska bli bra igen... och inget snack',
   'https://www.sd.se/wp-content/uploads/2022/08/610f6f9c-e93b-481d-a963-53a9c7077b85.jpg',
   'https://www.sd.se/wp-content/uploads/2022/08/610f6f9c-e93b-481d-a963-53a9c7077b85.jpg',
   'https://www.sd.se/sverigedemokraternas-valmanifest-2022/',
   'Sverigedemokraterna',
   'restricted',
   'Officiellt material från sd.se. Resultat: 20,54%, näst största parti.'),

  ('sd_party', 'sd-2022-skane', 'Sverigedemokraterna 2022 — Vi är redo att styra! (Skåne)',
   2022, 'Vi är redo att styra!',
   'https://dagensopinion.se/wp-content/uploads/2022/05/SD_valkampanj_Sk%C3%A5ne_2022.jpg',
   'https://dagensopinion.se/wp-content/uploads/2022/05/SD_valkampanj_Sk%C3%A5ne_2022.jpg',
   'https://dagensopinion.se/sd-inleder-valoffensiv-i-skane/',
   'Dagens Opinion',
   'fair_use',
   'Regional kampanj för Skåne med kandidaten Niclas Nilsson.');

-- ===============================================================
-- MODERATERNA — riksdagsval 1988-2022
-- ===============================================================

INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1988 — Carl Bildt era
  ('moderaterna_party', 'm-1988', 'Moderaterna 1988',
   1988, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1988',
   'Moderaterna',
   'unknown',
   'Carl Bildt partiledare sedan 1986. Resultat: 18,3%.'),

  -- 1991 — valseger för borgerliga blocket, Bildt blir statsminister
  ('moderaterna_party', 'm-1991', 'Moderaterna 1991 — Brottslingar ska sitta inne. Du ska våga vara ute.',
   1991, 'Brottslingar ska sitta inne. Du ska våga vara ute.',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
   'Moderaterna',
   'unknown',
   'Den klassiska "trygghet"-affischen. Resultat: 21,9%. Bildt blev statsminister.'),

  -- 1994
  ('moderaterna_party', 'm-1994', 'Moderaterna 1994',
   1994, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1994',
   'Moderaterna',
   'unknown',
   'Resultat: 22,4%. Förlust mot S, Bildt avgår 1999.'),

  -- 1998
  ('moderaterna_party', 'm-1998', 'Moderaterna 1998',
   1998, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1998',
   'Moderaterna',
   'unknown',
   'Resultat: 22,9% — partiets bästa val på 70 år (innan 2010).'),

  -- 2002 — Bo Lundgren, det stora skattesänkningskraschet
  ('moderaterna_party', 'm-2002', 'Moderaterna 2002 — Skattesänkning för fler',
   2002, 'Skattesänkning för fler',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
   'Moderaterna',
   'unknown',
   'Bo Lundgren partiledare. Katastrofval: 15,3%. Ledde till Reinfeldts kursändring.'),

  -- 2006 — "Det nya arbetarpartiet" — Reinfeldts genombrott
  ('moderaterna_party', 'm-2006', 'Moderaterna 2006 — Sveriges nya arbetarparti',
   2006, 'Sveriges nya arbetarparti',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2006',
   'Nya Moderaterna',
   'unknown',
   'Reinfeldt och Schlingmanns omprofilering. Resultat: 26,2%, regering med Alliansen.'),

  -- 2010 — partiets bästa val genom tiderna
  ('moderaterna_party', 'm-2010', 'Moderaterna 2010 — Bara ett arbetarparti kan fixa jobben',
   2010, 'Bara ett arbetarparti kan fixa jobben',
   'https://media.arto.se/app/uploads/sites/10/2017/03/2010_02.jpg',
   'https://media.arto.se/app/uploads/sites/10/2017/03/2010_02.jpg?w=515&h=722&format=auto&q=50',
   'https://arbetet.se/2017/03/24/det-nya-arbetarpartiets-resa-tur-och-retur/',
   'Arbetet (foto)',
   'fair_use',
   'Resultat: 30,1% — partiets bästa resultat sedan allmän rösträtt 1921.'),

  -- 2014
  ('moderaterna_party', 'm-2014', 'Moderaterna 2014 — Alla behövs',
   2014, '250 000 nya jobb är bara början',
   'https://media.arto.se/app/uploads/sites/10/2017/03/2014_13.jpg',
   'https://media.arto.se/app/uploads/sites/10/2017/03/2014_13.jpg?w=515&h=721&format=auto&q=50',
   'https://arbetet.se/2017/03/24/det-nya-arbetarpartiets-resa-tur-och-retur/',
   'Arbetet (foto)',
   'fair_use',
   'Reinfeldts sista val. Resultat: 23,3%, regeringen avgår.'),

  -- 2018 — Kristersson tar över
  ('moderaterna_party', 'm-2018', 'Moderaterna 2018 — Nu tar vi tag i Sverige',
   2018, 'Nu tar vi tag i Sverige',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Moderaterna',
   'unknown',
   'Kristersson partiledare. Resultat: 19,8% — sämsta sedan 2002.'),

  -- 2022 — tillbaka i regering
  ('moderaterna_party', 'm-2022', 'Moderaterna 2022 — Nu får vi ordning på Sverige',
   2022, 'Nu får vi ordning på Sverige',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
   'Moderaterna',
   'unknown',
   'Resultat: 19,1% — partiet blev tredje störst men bildade regering m. KD+L+SD-stöd.');

-- ===============================================================
-- Kuratering: koppla till parti, valår, teman
-- ===============================================================
INSERT INTO poster_curation (poster_id, party, election_type, election_year, themes, sensitivity_flags, requires_context, curation_status)
SELECT
  p.id,
  CASE
    WHEN p.source = 'sd_party' THEN 'Sverigedemokraterna'
    WHEN p.source = 'moderaterna_party' THEN 'Moderaterna'
  END,
  'riksdag',
  p.year,
  CASE
    WHEN p.source = 'sd_party' AND p.year >= 2002 THEN ARRAY['migration', 'trygghet', 'identitet']
    WHEN p.source = 'sd_party' THEN ARRAY['identitet', 'invandring']
    WHEN p.source = 'moderaterna_party' AND p.year IN (2006, 2010, 2014) THEN ARRAY['arbete', 'skatter', 'tillvaxt']
    WHEN p.source = 'moderaterna_party' AND p.year = 2002 THEN ARRAY['skatter']
    WHEN p.source = 'moderaterna_party' AND p.year = 1991 THEN ARRAY['trygghet', 'brottslighet']
    WHEN p.source = 'moderaterna_party' AND p.year = 2022 THEN ARRAY['trygghet', 'brottslighet', 'energi']
    ELSE ARRAY['allmant']
  END,
  CASE
    WHEN p.source = 'sd_party' THEN ARRAY['kontroversiellt_parti']
    ELSE NULL
  END,
  p.source = 'sd_party',  -- SD-affischer kräver kontextläsning först
  'review'
FROM posters p
WHERE p.source IN ('sd_party', 'moderaterna_party')
  AND p.year BETWEEN 1988 AND 2022
ON CONFLICT (poster_id) DO NOTHING;
