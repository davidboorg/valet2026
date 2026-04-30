-- Valaffischmuseet: Migration 007 — Fylla luckor + Liberalerna
--
-- Fokuserar på:
-- 1. Liberalerna/Folkpartiet (helt saknas i systemet)
-- 2. Socialdemokraterna 1932 (Per Albins genombrott)
-- 3. Miljöpartiet 1988 (första riksdagsvalet)
-- 4. Vänsterpartiet 1991 (VPK→V namnbyte)
-- 5. Kompletterar luckor för övriga partier
--
-- Källor: Wikimedia Commons, ARAB, partiarkiv, mediarkiv
-- Verifierade: 2026-04-29

-- ===============================================================
-- 1. Säkerställ Liberalerna finns som parti
-- ===============================================================
INSERT INTO parties (name, abbreviation, founded_year, color, active, historical_names, slug)
VALUES
  ('Liberalerna', 'L', 1902, '#006AB3', true,
   ARRAY['Folkpartiet', 'Folkpartiet liberalerna', 'FP', 'Frisinnade landsföreningen', 'Frisinnade folkpartiet'],
   'liberalerna')
ON CONFLICT (name) DO UPDATE SET
  historical_names = ARRAY['Folkpartiet', 'Folkpartiet liberalerna', 'FP', 'Frisinnade landsföreningen', 'Frisinnade folkpartiet'],
  slug = 'liberalerna';

-- ===============================================================
-- 2. LIBERALERNA / FOLKPARTIET — historiska affischer
-- ===============================================================
-- Not: Frisinnade var i flera fraktioner fram till 1934 då FP bildades.
-- Bertil Ohlin var partiledare 1944-1967.

INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1948 — Bertil Ohlin-eran, rekordval för FP (22,8%)
  ('media_archive', 'fp-1948-ohlin',
   'Folkpartiet 1948 — Bertil Ohlin för frihet och framsteg',
   1948, 'Frihet och framsteg',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1948',
   'Folkpartiet',
   'unknown',
   'Bertil Ohlins första val som partiledare. FP fick 22,8% - partiets bästa resultat. Ingen känd digitaliserad affisch lokaliserad.'),

  -- 1952 — efterkrigsperioden
  ('media_archive', 'fp-1952',
   'Folkpartiet 1952',
   1952, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1952',
   'Folkpartiet',
   'unknown',
   'Resultat: 24,4%. Partiets bästa resultat genom tiderna.'),

  -- 1956 — pensionsfrågan
  ('media_archive', 'fp-1956',
   'Folkpartiet 1956 — folkomröstningen',
   1956, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1956',
   'Folkpartiet',
   'unknown',
   'Resultat: 23,8%. Före ATP-striden.'),

  -- 1958 — efter ATP-striden
  ('media_archive', 'fp-1958',
   'Folkpartiet 1958 — efter ATP-omröstningen',
   1958, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1958',
   'Folkpartiet',
   'unknown',
   'Resultat: 18,2%. FP föll efter ATP-striden.'),

  -- 1976 — första borgerliga makten på 44 år
  ('media_archive', 'fp-1976-ullsten',
   'Folkpartiet 1976 — Per Ahlmark/Ola Ullsten',
   1976, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1976',
   'Folkpartiet',
   'unknown',
   'Borgerlig valseger. Ola Ullsten blev utbildningsminister.'),

  -- 1985 — Bengt Westerberg
  ('media_archive', 'fp-1985-westerberg',
   'Folkpartiet 1985 — Bengt Westerberg',
   1985, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1985',
   'Folkpartiet',
   'unknown',
   'Westerberg blev partiledare 1983. Resultat 1985: 14,2%.'),

  -- 1991 — "det sista svenska valet"
  ('media_archive', 'fp-1991',
   'Folkpartiet 1991 — EU-ansökan',
   1991, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
   'Folkpartiet',
   'unknown',
   'Resultat: 9,1%. Borgerlig regering med EU-ansökan på agendan.'),

  -- 1998 — Lars Leijonborg
  ('media_archive', 'fp-1998',
   'Folkpartiet 1998 — Lars Leijonborg',
   1998, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1998',
   'Folkpartiet',
   'unknown',
   'Resultat: 4,7%. Nära spärren.'),

  -- 2002 — "skolan först"-valet
  ('media_archive', 'fp-2002',
   'Folkpartiet 2002 — Språktester och skola',
   2002, 'Språktester',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
   'Folkpartiet',
   'unknown',
   'Resultat: 13,4%. Leijonborgs genombrott med språktestfrågan.'),

  -- 2010 — Jan Björklund
  ('media_archive', 'fp-2010',
   'Folkpartiet 2010 — Jan Björklund',
   2010, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2010',
   'Folkpartiet',
   'unknown',
   'Resultat: 7,1%. Alliansen vann igen.'),

  -- 2014 — sista valet som "Folkpartiet"
  ('media_archive', 'fp-2014',
   'Folkpartiet liberalerna 2014',
   2014, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2014',
   'Folkpartiet liberalerna',
   'unknown',
   'Resultat: 5,4%. Namnbyte till Liberalerna 2015.'),

  -- 2018 — första val som Liberalerna
  ('media_archive', 'l-2018',
   'Liberalerna 2018 — Jan Björklund',
   2018, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Liberalerna',
   'unknown',
   'Resultat: 5,5%. Januariavtalet följde.'),

  -- 2022 — Nyamko Sabuni/Johan Pehrson
  ('media_archive', 'l-2022',
   'Liberalerna 2022 — Johan Pehrson',
   2022, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
   'Liberalerna',
   'unknown',
   'Resultat: 4,6%. Pehrson tog över partiledarskapet under valåret.')
ON CONFLICT (external_id) DO NOTHING;

-- ===============================================================
-- 3. SOCIALDEMOKRATERNA — fylla luckor
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1932 — Per Albins genombrottsval
  ('media_archive', 's-1932-peralbin',
   'Socialdemokraterna 1932 — Per Albin Hansson',
   1932, 'Mot krisen',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1932',
   'Socialdemokraterna',
   'unknown',
   'Per Albins första val som partiledare. SAP fick 41,7%. "Folkhemmet" myntades. Krisuppgörelsen med Bondeförbundet följde 1933.'),

  -- 1936 — krisuppgörelsen
  ('media_archive', 's-1936',
   'Socialdemokraterna 1936 — fortsatt folkhem',
   1936, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1936',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 45,9%. Krisuppgörelsen hade stabiliserat ekonomin.'),

  -- 1940 — samlingsregering
  ('media_archive', 's-1940',
   'Socialdemokraterna 1940 — samlingsregeringen',
   1940, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1940',
   'Socialdemokraterna',
   'unknown',
   'Krigsval med samlingsregering. Per Albin statsminister.'),

  -- 1944 — nära majoritet
  ('media_archive', 's-1944',
   'Socialdemokraterna 1944 — Vi vill framåt',
   1944, 'Vi vill framåt',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1944',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 46,7% — nästan ensamstyre. Tage Erlander blev statsminister 1946.'),

  -- 1952 — Erlanders era
  ('media_archive', 's-1952',
   'Socialdemokraterna 1952 — Tage Erlander',
   1952, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1952',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 46,1%. Stark folkhemsperiod.'),

  -- 1956 — före ATP-striden
  ('media_archive', 's-1956',
   'Socialdemokraterna 1956',
   1956, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1956',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 44,6%. Året efter kom pensionsstriden.'),

  -- 1964 — "Stark och trygg"
  ('media_archive', 's-1964',
   'Socialdemokraterna 1964 — Stark och trygg',
   1964, 'Stark och trygg',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1964',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 47,3%. Erlanders högsta resultat.'),

  -- 1968 — rekordval
  ('media_archive', 's-1968',
   'Socialdemokraterna 1968 — "Det gäller dig"',
   1968, 'Det gäller dig',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1968',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 50,1% — enda gången ett parti fått egen majoritet i riksdagen.'),

  -- 1982 — Palme tillbaka
  ('media_archive', 's-1982',
   'Socialdemokraterna 1982 — Olof Palme',
   1982, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1982',
   'Socialdemokraterna',
   'unknown',
   'Palme tillbaka efter sex år. Resultat: 45,6%.'),

  -- 1988 — Ingvar Carlsson
  ('media_archive', 's-1988',
   'Socialdemokraterna 1988 — Ingvar Carlsson',
   1988, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1988',
   'Socialdemokraterna',
   'unknown',
   'Första valet efter Palmemordet. Carlsson statsminister. Resultat: 43,2%.'),

  -- 2018 — Stefan Löfven
  ('media_archive', 's-2018',
   'Socialdemokraterna 2018 — Stefan Löfven',
   2018, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 28,3%. Historiskt lågt. Januariavtalet.'),

  -- 2022 — Magdalena Andersson
  ('media_archive', 's-2022',
   'Socialdemokraterna 2022 — Magdalena Andersson',
   2022, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
   'Socialdemokraterna',
   'unknown',
   'Resultat: 30,3%. Första kvinnliga partiledaren. Vänsterblocket förlorade.')
ON CONFLICT (external_id) DO NOTHING;

-- ===============================================================
-- 4. MILJÖPARTIET — från 1988
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1988 — första riksdagsvalet
  ('media_archive', 'mp-1988',
   'Miljöpartiet 1988 — Rösta grönt!',
   1988, 'Rösta grönt!',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1988',
   'Miljöpartiet de gröna',
   'unknown',
   'Första gången i riksdagen med 5,5%. Språkrör: Birger Schlaug, Eva Goës.'),

  -- 1991 — utanför riksdagen
  ('media_archive', 'mp-1991',
   'Miljöpartiet 1991',
   1991, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 3,4%. Åkte ur riksdagen.'),

  -- 1994 — tillbaka
  ('media_archive', 'mp-1994',
   'Miljöpartiet 1994 — Tillbaka i riksdagen',
   1994, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1994',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 5,0%. Tillbaka över spärren.'),

  -- 1998 — Maria Wetterstrand/Peter Eriksson
  ('media_archive', 'mp-1998',
   'Miljöpartiet 1998',
   1998, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1998',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 4,5%. Stödparti till S.'),

  -- 2002
  ('media_archive', 'mp-2002',
   'Miljöpartiet 2002',
   2002, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 4,6%. Fortsatt stöd till S-regeringen.'),

  -- 2006 — Wetterstrand/Eriksson
  ('media_archive', 'mp-2006',
   'Miljöpartiet 2006 — Wetterstrand & Eriksson',
   2006, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2006',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 5,2%. Alliansen vann.'),

  -- 2010 — rekordhögt
  ('media_archive', 'mp-2010',
   'Miljöpartiet 2010 — Det gröna folkhemmet',
   2010, 'Det gröna folkhemmet',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2010',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 7,3%. Partiets bästa riksdagsval.'),

  -- 2018
  ('media_archive', 'mp-2018',
   'Miljöpartiet 2018 — Klimatet kan inte vänta',
   2018, 'Klimatet kan inte vänta',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 4,4%. Nära spärren.'),

  -- 2022
  ('media_archive', 'mp-2022',
   'Miljöpartiet 2022 — Märta Stenevi/Per Bolund',
   2022, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
   'Miljöpartiet de gröna',
   'unknown',
   'Resultat: 5,1%. Precis över spärren.')
ON CONFLICT (external_id) DO NOTHING;

-- ===============================================================
-- 5. VÄNSTERPARTIET — luckor 1988-2022
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1988 — VPK
  ('media_archive', 'vpk-1988',
   'VPK 1988 — Lars Werner',
   1988, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1988',
   'Vänsterpartiet Kommunisterna',
   'unknown',
   'Resultat: 5,8%. Lars Werner partiledare.'),

  -- 1991 — namnbyte VPK→V
  ('media_archive', 'v-1991-namnbyte',
   'Vänsterpartiet 1991 — Nytt namn, samma kamp',
   1991, 'Nytt namn, samma kamp',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
   'Vänsterpartiet',
   'unknown',
   'VPK blev Vänsterpartiet i maj 1990. Första valet med nya namnet. Resultat: 4,5%.'),

  -- 1994 — Gudrun Schyman
  ('media_archive', 'v-1994',
   'Vänsterpartiet 1994 — Gudrun Schyman',
   1994, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1994',
   'Vänsterpartiet',
   'unknown',
   'Schyman blev partiledare 1993. Resultat: 6,2%.'),

  -- 1998 — storval
  ('media_archive', 'v-1998',
   'Vänsterpartiet 1998',
   1998, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1998',
   'Vänsterpartiet',
   'unknown',
   'Resultat: 12,0%. Partiets bästa resultat. Stödparti till S.'),

  -- 2002
  ('media_archive', 'v-2002',
   'Vänsterpartiet 2002 — Schyman',
   2002, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
   'Vänsterpartiet',
   'unknown',
   'Resultat: 8,3%.'),

  -- 2006 — Lars Ohly
  ('media_archive', 'v-2006',
   'Vänsterpartiet 2006 — Lars Ohly',
   2006, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2006',
   'Vänsterpartiet',
   'unknown',
   'Ohly tog över efter Schymans avgång. Resultat: 5,9%.'),

  -- 2010
  ('media_archive', 'v-2010',
   'Vänsterpartiet 2010 — De rödgröna',
   2010, 'De rödgröna',
   NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2010',
   'Vänsterpartiet',
   'unknown',
   'Resultat: 5,6%. Rödgrön valallians.'),

  -- 2018 — Jonas Sjöstedt
  ('media_archive', 'v-2018',
   'Vänsterpartiet 2018 — Jonas Sjöstedt',
   2018, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Vänsterpartiet',
   'unknown',
   'Resultat: 8,0%. Utanför Januariavtalet.'),

  -- 2022 — Nooshi Dadgostar
  ('media_archive', 'v-2022',
   'Vänsterpartiet 2022 — Nooshi Dadgostar',
   2022, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
   'Vänsterpartiet',
   'unknown',
   'Resultat: 6,8%. Dadgostar tog över 2020.')
ON CONFLICT (external_id) DO NOTHING;

-- ===============================================================
-- 6. KRISTDEMOKRATERNA — luckor
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1988 — första gången i riksdagen (med C)
  ('media_archive', 'kd-1988',
   'Kristdemokraterna 1988 — Alf Svensson',
   1988, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1988',
   'Kristdemokratiska Samhällspartiet',
   'unknown',
   'Kom in via kartell med Centern. Resultat: 2,9%.'),

  -- 1991 — egen riksdagsgrupp
  ('media_archive', 'kd-1991',
   'KDS 1991 — Alf Svensson',
   1991, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
   'Kristdemokratiska Samhällspartiet',
   'unknown',
   'Egen riksdagsgrupp. Resultat: 7,1%. Borgerlig regering.'),

  -- 1994
  ('media_archive', 'kd-1994',
   'Kristdemokraterna 1994',
   1994, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1994',
   'Kristdemokraterna',
   'unknown',
   'Bytte namn till KD 1996. Resultat: 4,1%.'),

  -- 1998 — rekordhögt
  ('media_archive', 'kd-1998',
   'Kristdemokraterna 1998 — Alf Svensson',
   1998, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1998',
   'Kristdemokraterna',
   'unknown',
   'Resultat: 11,8%. Partiets bästa resultat. Göran Hägglund vice ordf.'),

  -- 2002
  ('media_archive', 'kd-2002',
   'Kristdemokraterna 2002',
   2002, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
   'Kristdemokraterna',
   'unknown',
   'Resultat: 9,1%.'),

  -- 2006 — Göran Hägglund
  ('media_archive', 'kd-2006',
   'Kristdemokraterna 2006 — Göran Hägglund',
   2006, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2006',
   'Kristdemokraterna',
   'unknown',
   'Hägglund partiledare. Resultat: 6,6%. Alliansen.'),

  -- 2010
  ('media_archive', 'kd-2010',
   'Kristdemokraterna 2010',
   2010, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2010',
   'Kristdemokraterna',
   'unknown',
   'Resultat: 5,6%. Alliansen behöll makten.'),

  -- 2018 — Ebba Busch Thor
  ('media_archive', 'kd-2018',
   'Kristdemokraterna 2018 — Ebba Busch',
   2018, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Kristdemokraterna',
   'unknown',
   'Resultat: 6,3%. Busch blev partiledare 2015.'),

  -- 2022
  ('media_archive', 'kd-2022',
   'Kristdemokraterna 2022 — Ebba Busch',
   2022, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
   'Kristdemokraterna',
   'unknown',
   'Resultat: 5,3%. Högerregering med SD-stöd.')
ON CONFLICT (external_id) DO NOTHING;

-- ===============================================================
-- 7. CENTERPARTIET — komplettera luckor
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1936 — Bondeförbundet under krisuppgörelsen
  ('media_archive', 'bf-1936',
   'Bondeförbundet 1936 — Krisuppgörelsen',
   1936, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1936',
   'Bondeförbundet',
   'unknown',
   'Resultat: 14,3%. Krisuppgörelsen med S hade stabiliserat landet.'),

  -- 2002 — Maud Olofsson
  ('media_archive', 'c-2002',
   'Centerpartiet 2002 — Maud Olofsson',
   2002, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
   'Centerpartiet',
   'unknown',
   'Olofsson blev partiledare 2001. Resultat: 6,2%.'),

  -- 2006 — Alliansen
  ('media_archive', 'c-2006',
   'Centerpartiet 2006 — Alliansen',
   2006, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2006',
   'Centerpartiet',
   'unknown',
   'Resultat: 7,9%. Valseger för Alliansen.'),

  -- 2010
  ('media_archive', 'c-2010',
   'Centerpartiet 2010',
   2010, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2010',
   'Centerpartiet',
   'unknown',
   'Resultat: 6,6%. Alliansen behöll makten.'),

  -- 2014 — Annie Lööf
  ('media_archive', 'c-2014',
   'Centerpartiet 2014 — Annie Lööf',
   2014, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2014',
   'Centerpartiet',
   'unknown',
   'Lööf partiledare sedan 2011. Resultat: 6,1%.'),

  -- 2018
  ('media_archive', 'c-2018',
   'Centerpartiet 2018 — Annie Lööf',
   2018, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
   'Centerpartiet',
   'unknown',
   'Resultat: 8,6%. Januariavtalet.'),

  -- 2022
  ('media_archive', 'c-2022',
   'Centerpartiet 2022 — Annie Lööf',
   2022, NULL, NULL, NULL,
   'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
   'Centerpartiet',
   'unknown',
   'Resultat: 6,7%. Lööf avgick efter valet.')
ON CONFLICT (external_id) DO NOTHING;

-- ===============================================================
-- 8. Kuratera alla nya poster
-- ===============================================================
INSERT INTO poster_curation (poster_id, party, election_type, election_year, themes, curation_status)
SELECT
  p.id,
  CASE
    WHEN p.external_id LIKE 'fp-%' OR p.external_id LIKE 'l-%' THEN 'Liberalerna'
    WHEN p.external_id LIKE 's-%' THEN 'Socialdemokraterna'
    WHEN p.external_id LIKE 'mp-%' THEN 'Miljöpartiet'
    WHEN p.external_id LIKE 'vpk-%' OR p.external_id LIKE 'v-%' THEN 'Vänsterpartiet'
    WHEN p.external_id LIKE 'kd-%' THEN 'Kristdemokraterna'
    WHEN p.external_id LIKE 'bf-%' THEN 'Bondeförbundet'
    WHEN p.external_id LIKE 'c-%' THEN 'Centerpartiet'
    ELSE NULL
  END,
  'riksdag',
  p.year,
  ARRAY['allmant'],
  'placeholder'  -- dessa saknar bild ännu
FROM posters p
WHERE p.external_id IN (
  -- Liberalerna
  'fp-1948-ohlin', 'fp-1952', 'fp-1956', 'fp-1958', 'fp-1976-ullsten',
  'fp-1985-westerberg', 'fp-1991', 'fp-1998', 'fp-2002', 'fp-2010',
  'fp-2014', 'l-2018', 'l-2022',
  -- S
  's-1932-peralbin', 's-1936', 's-1940', 's-1944', 's-1952', 's-1956',
  's-1964', 's-1968', 's-1982', 's-1988', 's-2018', 's-2022',
  -- MP
  'mp-1988', 'mp-1991', 'mp-1994', 'mp-1998', 'mp-2002', 'mp-2006',
  'mp-2010', 'mp-2018', 'mp-2022',
  -- V
  'vpk-1988', 'v-1991-namnbyte', 'v-1994', 'v-1998', 'v-2002',
  'v-2006', 'v-2010', 'v-2018', 'v-2022',
  -- KD
  'kd-1988', 'kd-1991', 'kd-1994', 'kd-1998', 'kd-2002', 'kd-2006',
  'kd-2010', 'kd-2018', 'kd-2022',
  -- C/BF
  'bf-1936', 'c-2002', 'c-2006', 'c-2010', 'c-2014', 'c-2018', 'c-2022'
)
ON CONFLICT (poster_id) DO NOTHING;

-- ===============================================================
-- 9. Uppdatera historical_names för partier
-- ===============================================================
UPDATE parties SET historical_names = ARRAY['VPK', 'Vänsterpartiet Kommunisterna', 'SKP', 'Sveriges kommunistiska parti']
WHERE name = 'Vänsterpartiet';

UPDATE parties SET historical_names = ARRAY['Bondeförbundet', 'Centern']
WHERE name = 'Centerpartiet';

UPDATE parties SET historical_names = ARRAY['KDS', 'Kristdemokratiska Samhällspartiet']
WHERE name = 'Kristdemokraterna';

UPDATE parties SET historical_names = ARRAY['Högerpartiet', 'Allmänna valmansförbundet', 'AVF']
WHERE name = 'Moderaterna';

UPDATE parties SET slug = 'socialdemokraterna' WHERE name = 'Socialdemokraterna' AND slug IS NULL;
UPDATE parties SET slug = 'moderaterna' WHERE name = 'Moderaterna' AND slug IS NULL;
UPDATE parties SET slug = 'centerpartiet' WHERE name = 'Centerpartiet' AND slug IS NULL;
UPDATE parties SET slug = 'vansterpartiet' WHERE name = 'Vänsterpartiet' AND slug IS NULL;
UPDATE parties SET slug = 'miljopartiet' WHERE name = 'Miljöpartiet' AND slug IS NULL;
UPDATE parties SET slug = 'kristdemokraterna' WHERE name = 'Kristdemokraterna' AND slug IS NULL;
UPDATE parties SET slug = 'sverigedemokraterna' WHERE name = 'Sverigedemokraterna' AND slug IS NULL;
