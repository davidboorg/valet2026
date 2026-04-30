-- Valaffischmuseet: Migration 006
-- 1) Ta bort Piratpartiet, Nationalsocialistiska Folkpartiet, Birger Furugård
--    och Ungsvenska — ej traditionella riksdagspartier.
-- 2) Lägg till nya verifierade affischer från Stockholmskällan, Wikimedia
--    (Fälldin/Hedlund 1970, V Svedala 2014), affischerna.se VPK/SKP, MP Flickr.

-- ===============================================================
-- 1. TA BORT exkluderade affischer
-- ===============================================================
DELETE FROM poster_curation
WHERE poster_id IN (
  SELECT id FROM posters
  WHERE external_id IN (
    'wm-1928-ungsvenska',
    'wm-1930s-furugard',
    'wm-1934-nsap',
    'wm-2006-pp-bat',
    'wm-2010-pp'
  )
);
DELETE FROM posters
WHERE external_id IN (
  'wm-1928-ungsvenska',
  'wm-1930s-furugard',
  'wm-1934-nsap',
  'wm-2006-pp-bat',
  'wm-2010-pp'
);

-- Ta även bort partireferenser för icke-relevanta partier
DELETE FROM parties WHERE name IN ('Piratpartiet', 'Nationalsocialistiska Folkpartiet');

-- ===============================================================
-- 2. LÄGG TILL nya affischer
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- Stockholmskällan: Högern Stockholm 1931, 1950
  ('media_archive', 'sk-1931-h-kilbom',
   'Högern 1931 — Gör slut på Kilboms kommunala vågmästeri',
   1931, 'Gör slut på Kilboms kommunala vågmästeri',
   'https://stockholmskallan.stockholm.se/skblobs/12/12897f1b-6e01-4a99-b972-05adbc0f059d.jpg',
   'https://stockholmskallan.stockholm.se/post/24618',
   'Stockholmskällan / Stockholms stad',
   'free',
   'Riktad mot Karl Kilbom (kommunist). Stockholms stadsfullmäktige.'),

  ('media_archive', 'sk-1931-h-stadshus',
   'Högern 1931 — vita stjärnor med Stadshusets torn',
   1931, NULL,
   'https://stockholmskallan.stockholm.se/skblobs/98/98fcf64a-d558-42d8-ac6a-76bb76019e63.jpg',
   'https://stockholmskallan.stockholm.se/post/24616',
   'Stockholmskällan / Stockholms stad',
   'free',
   'Konstnär: Moje Åslund.'),

  ('media_archive', 'sk-1950-h-malmskillnad',
   'Högerns valaffisch på Malmskillnadsbron 1950',
   1950, NULL,
   'https://stockholmskallan.stockholm.se/skblobs/6c/6cbce4ce-7a60-4791-8534-82dde84e43fb.JPG',
   'https://stockholmskallan.stockholm.se/post/11708',
   'Stockholmskällan / Stockholms stad',
   'free',
   'Foto från Kungsgatan, Stockholm.'),

  -- Wikimedia: C-affischer 1970
  ('wikimedia', 'wm-1970-c-falldin',
   'Centerpartiet 1970 — Thorbjörn Fälldin',
   1970, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/3/35/Thorbj%C3%B6rn_F%C3%A4lldin_1970.jpg',
   'https://commons.wikimedia.org/wiki/File:Thorbj%C3%B6rn_F%C3%A4lldin_1970.jpg',
   'Wikimedia Commons / Centerpartiet',
   'fair_use',
   'Fälldin var ännu inte partiledare 1970 men en framträdande gestalt.'),

  ('wikimedia', 'wm-1970-c-hedlund',
   'Centerpartiet 1970 — Gunnar Hedlund',
   1970, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/1/1b/Gunnar_Hedlund_1970.jpg',
   'https://commons.wikimedia.org/wiki/File:Gunnar_Hedlund_1970.jpg',
   'Wikimedia Commons / Centerpartiet',
   'fair_use',
   'Hedlund var partiledare 1949-1971.'),

  -- Wikimedia: Vänsterpartiet 2014 Svedala
  ('wikimedia', 'wm-2014-v-svedala',
   'Vänsterpartiet 2014 — Svedala',
   2014, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/d/dc/Valaffisch_vansterpartiet_Svedala_2014sep13_0010-2_%2815039290558%29.jpg',
   'https://commons.wikimedia.org/wiki/File:Valaffisch_vansterpartiet_Svedala_2014sep13_0010-2_(15039290558).jpg',
   'Wikimedia Commons / Johan Wessman',
   'free',
   'Foto från Svedala valdagen 2014.'),

  -- Affischerna.se SKP/VPK 1973-1979
  ('affischerna', 'aff-1973-skp-imperialism',
   'SKP 1973 — Imperialismens klo i Chile',
   1973, 'Imperialismens klo i Chile',
   'https://affischerna.se/wp-content/uploads/1973/01/IMG_0357.jpg',
   'https://affischerna.se/progg_poster/imperialismens-klo-i-chile-2/',
   'Affischerna 1967-1979',
   'fair_use',
   'Postad i samband med USA:s ingripande i Chile 1973.'),

  ('affischerna', 'aff-1973-skp-batre',
   'SKP 1973 — Bättre är ofta sämre',
   1973, 'Bättre är ofta sämre',
   'https://affischerna.se/wp-content/uploads/1973/09/IMG_0350.jpg',
   'https://affischerna.se/progg_poster/battre-ar-ofta-samre-2/',
   'Affischerna 1967-1979',
   'fair_use',
   NULL),

  ('affischerna', 'aff-1973-skp-arbete',
   'SKP 1973 — Arbete, en mänsklig rättighet',
   1973, 'Arbete, en mänsklig rättighet',
   'https://affischerna.se/wp-content/uploads/1973/09/IMG_0351.jpg',
   'https://affischerna.se/progg_poster/arbete-en-mansklig-rattighet-2/',
   'Affischerna 1967-1979',
   'fair_use',
   NULL),

  ('affischerna', 'aff-1979-vpk-egen-kraft',
   'VPK 1979 — Egen kraft är bättre än atomkraft',
   1979, 'Egen kraft är bättre än atomkraft',
   'https://affischerna.se/wp-content/uploads/1979/01/MG_5384.jpg',
   'https://affischerna.se/progg_poster/egen-kraft-ar-battre-an-atomkraft-2/',
   'Affischerna 1967-1979',
   'fair_use',
   'Kärnkraftsfolkomröstningen 1980. VPK var aktiv linje 3 (avveckla).'),

  ('affischerna', 'aff-1979-vpk-fred',
   'VPK 1979 — De talar om fred',
   1979, 'De talar om fred',
   'https://affischerna.se/wp-content/uploads/1979/01/IMG_0346-1.jpg',
   'https://affischerna.se/progg_poster/de-talar-om-fred/',
   'Affischerna 1967-1979',
   'fair_use',
   NULL),

  ('affischerna', 'aff-1979-vpk-bildmotiv',
   'VPK 1979 — bildmotiv',
   1979, NULL,
   'https://affischerna.se/wp-content/uploads/1979/01/MG_5993.jpg',
   'https://affischerna.se/postercategory/valaffischer/',
   'Affischerna 1967-1979',
   'fair_use',
   NULL),

  ('affischerna', 'aff-1979-vpk-batre',
   'VPK 1979 — Bättre, sämre',
   1979, 'Bättre, sämre',
   'https://affischerna.se/wp-content/uploads/1979/01/battresamre01.jpg',
   'https://affischerna.se/postercategory/valaffischer/',
   'Affischerna 1967-1979',
   'fair_use',
   NULL),

  -- Miljöpartiet officiella Flickr 2014
  ('media_archive', 'mp-2014-flickr',
   'Miljöpartiet 2014 — Politiken måste bli varmare. Inte klimatet.',
   2014, 'Politiken måste bli varmare. Inte klimatet.',
   'https://live.staticflickr.com/3843/14863536926_ff0c770354.jpg',
   'https://www.flickr.com/photos/miljopartiet/sets/72157645948460750/',
   'Miljöpartiet de gröna (officiell Flickr)',
   'free',
   'Officiell partikampanj 2014, frisläppt på Flickr.')
ON CONFLICT (external_id) DO NOTHING;

-- ===============================================================
-- 3. Kuratera nya posters
-- ===============================================================
INSERT INTO poster_curation (poster_id, party, election_type, election_year, themes, curation_status)
SELECT
  p.id,
  CASE
    WHEN p.external_id LIKE 'sk-%-h-%' THEN 'Allmänna valmansförbundet'
    WHEN p.external_id = 'sk-1950-h-malmskillnad' THEN 'Högerpartiet'
    WHEN p.external_id LIKE 'wm-1970-c-%' THEN 'Centerpartiet'
    WHEN p.external_id = 'wm-2014-v-svedala' THEN 'Vänsterpartiet'
    WHEN p.external_id LIKE 'aff-%-skp-%' THEN 'SKP'
    WHEN p.external_id LIKE 'aff-%-vpk-%' THEN 'VPK'
    WHEN p.external_id = 'mp-2014-flickr' THEN 'Miljöpartiet'
  END,
  CASE
    WHEN p.year = 1931 THEN 'kommun'
    ELSE 'riksdag'
  END,
  p.year,
  ARRAY['allmant'],
  'review'
FROM posters p
WHERE p.external_id IN (
  'sk-1931-h-kilbom', 'sk-1931-h-stadshus', 'sk-1950-h-malmskillnad',
  'wm-1970-c-falldin', 'wm-1970-c-hedlund', 'wm-2014-v-svedala',
  'aff-1973-skp-imperialism', 'aff-1973-skp-batre', 'aff-1973-skp-arbete',
  'aff-1979-vpk-egen-kraft', 'aff-1979-vpk-fred',
  'aff-1979-vpk-bildmotiv', 'aff-1979-vpk-batre',
  'mp-2014-flickr'
)
ON CONFLICT (poster_id) DO NOTHING;
