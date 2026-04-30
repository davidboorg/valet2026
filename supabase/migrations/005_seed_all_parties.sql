-- Valaffischmuseet: Migration 005 — Seed alla partier alla riksdagsval
--
-- Källor: Wikimedia Commons (huvudkälla för PD-material 1900-1960),
-- DigitaltMuseum.se (Nordiska museet, Sundsvalls museum, Örebro länsmuseum),
-- affischerna.se (1967-1979), partiarkiv, mediearkiv.
--
-- Strategi: lägg in allt material som har verifierade bild-URL:er. För
-- moderna affischer (post-1955) tagga `restricted` eller `fair_use` med
-- tydlig attribution. För material >70 år gammalt: `free` (public domain).

-- ===============================================================
-- Säkerställ partier
-- ===============================================================
INSERT INTO parties (name, abbreviation, founded_year, color, active)
VALUES
  ('Allmänna valmansförbundet', NULL, 1904, '#1B49DD', false),
  ('Högerpartiet',              NULL, 1904, '#1B49DD', false),
  ('Bondeförbundet',            NULL, 1913, '#008000', false),
  ('Centerpartiet',             'C',  1913, '#009933', true),
  ('Folkpartiet',               'FP', 1934, '#006AB3', false),
  ('Liberalerna',               'L',  2015, '#006AB3', true),
  ('Vänsterpartiet',            'V',  1917, '#DA291C', true),
  ('SKP',                       NULL, 1921, '#CC0000', false),
  ('VPK',                       NULL, 1967, '#CC0000', false),
  ('Miljöpartiet',              'MP', 1981, '#83CF39', true),
  ('Kristdemokraterna',         'KD', 1964, '#000077', true),
  ('Piratpartiet',              'PP', 2006, '#492C7F', false),
  ('Feministiskt initiativ',    'FI', 2005, '#CC1199', false),
  ('Ny demokrati',              'NyD', 1991, '#FFCC00', false),
  ('Nationalsocialistiska Folkpartiet', NULL, 1933, '#7C3F00', false),
  ('Folkomröstning',            NULL, NULL, NULL, false)
ON CONFLICT (name) DO NOTHING;

-- ===============================================================
-- HISTORISKT (1900-1948) — public domain, Wikimedia Commons
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1908 Socialdemokraterna
  ('wikimedia', 'wm-1908-s-lindblad', 'A.C. Lindblad — andrakammarvalet 1908',
   1908, 'Rättvisa åt arbetarne och småfolket',
   'https://upload.wikimedia.org/wikipedia/commons/2/2e/A.C.Lindblad-valaffisch.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/A.C.Lindblad-valaffisch.jpg/400px-A.C.Lindblad-valaffisch.jpg',
   'https://commons.wikimedia.org/wiki/File:A.C.Lindblad-valaffisch.jpg',
   'Wikimedia Commons',
   'free',
   'Socialdemokratisk kandidat Anders Christenson Lindblad i Göteborg.'),

  -- 1912 Rösträttsmöte
  ('wikimedia', 'wm-1912-rostratt', 'Affisch om rösträttsmöte, april 1912',
   1912, 'Kvinnlig rösträtt',
   'https://upload.wikimedia.org/wikipedia/commons/3/35/Affisch_om_r%C3%B6str%C3%A4ttsm%C3%B6te_april_1912.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Affisch_om_r%C3%B6str%C3%A4ttsm%C3%B6te_april_1912.jpg/400px-Affisch_om_r%C3%B6str%C3%A4ttsm%C3%B6te_april_1912.jpg',
   'https://commons.wikimedia.org/wiki/File:Affisch_om_rösträttsmöte_april_1912.jpg',
   'Wikimedia Commons / Nordiska museet',
   'free',
   'Stockholm 1912: möte om kvinnlig politisk rösträtt.'),

  -- 1914 Försvaret främst
  ('wikimedia', 'wm-1914-h-forsvaret', 'Försvaret främst — Högerpartiet 1914',
   1914, 'Försvaret främst',
   'https://upload.wikimedia.org/wikipedia/commons/f/f4/F%C3%B6rsvaret_fr%C3%A4mst.JPG',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/F%C3%B6rsvaret_fr%C3%A4mst.JPG/400px-F%C3%B6rsvaret_fr%C3%A4mst.JPG',
   'https://commons.wikimedia.org/wiki/File:F%C3%B6rsvaret_fr%C3%A4mst.JPG',
   'Wikimedia Commons / Gunnar Widholm',
   'free',
   'Borggårdskrisens efterdyningar. Höger-affisch 1914 om försvarsupprustning.'),

  -- 1916 SAC 1 Maj
  ('wikimedia', 'wm-1916-sac', '1 Maj 1916 — Arbetarrörelsens möte',
   1916, '1 Maj 1916',
   'https://upload.wikimedia.org/wikipedia/commons/8/88/1_Maj_1916.png',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/1_Maj_1916.png/400px-1_Maj_1916.png',
   'https://commons.wikimedia.org/wiki/File:1_Maj_1916.png',
   'Wikimedia Commons',
   'free',
   'Mötaffisch för 1 maj 1916, Guldsmedshyttan. SAC arbetarklassens frigörelse.'),

  -- 1917 Kvinnlig rösträtt
  ('wikimedia', 'wm-1917-rostratt', 'Mötesaffisch för kvinnlig rösträtt 1917',
   1917, 'Kvinnlig rösträtt',
   'https://upload.wikimedia.org/wikipedia/commons/b/b8/M%C3%B6tesaffisch_f%C3%B6r_kvinnlig_r%C3%B6str%C3%A4tt.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/M%C3%B6tesaffisch_f%C3%B6r_kvinnlig_r%C3%B6str%C3%A4tt.jpg/400px-M%C3%B6tesaffisch_f%C3%B6r_kvinnlig_r%C3%B6str%C3%A4tt.jpg',
   'https://commons.wikimedia.org/wiki/File:Mötesaffisch_för_kvinnlig_rösträtt.jpg',
   'Wikimedia Commons / Marinmuseum Karlskrona',
   'free',
   'Mötaffisch om kvinnlig rösträtt, sept 1917.'),

  -- 1922 Folkomröstning rusdrycksförbud
  ('wikimedia', 'wm-1922-rusdryck', 'Avlöningsafton — Rösta ja! 1922',
   1922, 'Rösta ja!',
   'https://upload.wikimedia.org/wikipedia/commons/7/79/Avl%C3%B6ningsafton_-_R%C3%B6sta_ja%21_1922.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Avl%C3%B6ningsafton_-_R%C3%B6sta_ja%21_1922.jpg/400px-Avl%C3%B6ningsafton_-_R%C3%B6sta_ja%21_1922.jpg',
   'https://commons.wikimedia.org/wiki/File:Avlöningsafton_-_Rösta_ja!_1922.jpg',
   'Wikimedia Commons',
   'free',
   'Folkomröstningen om rusdrycksförbud 1922. Nej-sidan vann med liten marginal.'),

  -- 1928 Kosackvalet — Dalamän
  ('wikimedia', 'wm-1928-h-dalaman', 'Dalamän, rädda fosterlandet — Kosackvalet 1928',
   1928, 'Dalamän, rädda fosterlandet',
   'https://upload.wikimedia.org/wikipedia/commons/c/c2/Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg/400px-Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg',
   'https://commons.wikimedia.org/wiki/File:Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg',
   'Wikimedia Commons / Kungliga biblioteket',
   'free',
   'Kosackvalet 1928. Sveriges Nationella Ungdomsförbund (SNU) drev anti-kommunistisk skräckpropaganda till stöd för Allmänna valmansförbundet (höger).'),

  -- 1928 Höger — Svensk samling
  ('wikimedia', 'wm-1928-h-svensk-samling', 'Välj högern för svensk samling 1928',
   1928, 'Välj högern för svensk samling',
   'https://upload.wikimedia.org/wikipedia/commons/8/84/Valaffisch-v%C3%A4lj_med_h%C3%B6gern_f%C3%B6r_svensk_samling-redigerad.jpeg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Valaffisch-v%C3%A4lj_med_h%C3%B6gern_f%C3%B6r_svensk_samling-redigerad.jpeg/400px-Valaffisch-v%C3%A4lj_med_h%C3%B6gern_f%C3%B6r_svensk_samling-redigerad.jpeg',
   'https://commons.wikimedia.org/wiki/File:Valaffisch-välj_med_högern_för_svensk_samling-redigerad.jpeg',
   'Wikimedia Commons',
   'free',
   'Höger-affisch 1928 med karikatyr av Per Albin Hansson. Anti-kommunistisk.'),

  -- 1928 Ungsvenska dagen
  ('wikimedia', 'wm-1928-ungsvenska', 'Affisch för Ungsvenska dagen, 26 augusti 1928',
   1928, 'Ungsvenska dagen',
   'https://upload.wikimedia.org/wikipedia/commons/c/c1/1928-08-26_Affisch_f%C3%B6r_Ungsvenska_dagen.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/1928-08-26_Affisch_f%C3%B6r_Ungsvenska_dagen.jpg/400px-1928-08-26_Affisch_f%C3%B6r_Ungsvenska_dagen.jpg',
   'https://commons.wikimedia.org/wiki/File:1928-08-26_Affisch_för_Ungsvenska_dagen.jpg',
   'Wikimedia Commons',
   'free',
   'Sveriges Nationella Ungdomsförbund (SNU) — högerns ungdomsförbund.'),

  -- 1930 Bondeförbundet — smör
  ('wikimedia', 'wm-1930-bf-smor', 'Bondeförbundets valaffisch 1930 — Smör eller margarin',
   1930, 'Smör eller margarin',
   'https://upload.wikimedia.org/wikipedia/commons/8/8c/Bondef%C3%B6rbundets_valaffisch_1930.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bondef%C3%B6rbundets_valaffisch_1930.jpg/400px-Bondef%C3%B6rbundets_valaffisch_1930.jpg',
   'https://commons.wikimedia.org/wiki/File:Bondeförbundets_valaffisch_1930.jpg',
   'Wikimedia Commons / Centerpartiet',
   'free',
   'Landstingsval 1930 — Bondeförbundets kamp för smör i offentlig sjukvård istället för margarin.'),

  -- 1930 Höger — tåget
  ('wikimedia', 'wm-1930-h-tagar', 'Högern tågar ut i valkampen',
   1930, 'Högern tågar ut i valkampen',
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/H%C3%B6gern_t%C3%A5gar_ut_i_valkampen.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/H%C3%B6gern_t%C3%A5gar_ut_i_valkampen.jpg/400px-H%C3%B6gern_t%C3%A5gar_ut_i_valkampen.jpg',
   'https://commons.wikimedia.org/wiki/File:Högern_tågar_ut_i_valkampen.jpg',
   'Wikimedia Commons',
   'free',
   'Höger-affisch ca 1930 med marsmotiv.'),

  -- 1930-tal Birger Furugård
  ('wikimedia', 'wm-1930s-furugard', 'Birger Furugård — propagandaaffisch (1930-tal)',
   1933, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/f/fe/Birger_Furug%C3%A5rd_propagandaaffisch.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Birger_Furug%C3%A5rd_propagandaaffisch.jpg/400px-Birger_Furug%C3%A5rd_propagandaaffisch.jpg',
   'https://commons.wikimedia.org/wiki/File:Birger_Furugård_propagandaaffisch.jpg',
   'Wikimedia Commons / Koppoms museum',
   'free',
   'Svenska Nationalsocialistiska Partiet (SNSP) — Furugård-rörelsen, ej riksdagsmandat. Visas i historisk-kritisk kontext.'),

  -- 1931 Allmänna valmansförbundet
  ('wikimedia', 'wm-1931-avf', 'Allmänna valmansförbundet — valaffisch 1931',
   1931, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/1/18/Valaffisch_f%C3%B6r_AVF_1931.png',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Valaffisch_f%C3%B6r_AVF_1931.png/400px-Valaffisch_f%C3%B6r_AVF_1931.png',
   'https://commons.wikimedia.org/wiki/File:Valaffisch_för_AVF_1931.png',
   'Wikimedia Commons / Moje Åslund',
   'free',
   'Stockholms stadsfullmäktigeval 1931. Konstnär: Moje Åslund (1904-1968).'),

  -- 1934 NSAP-möte
  ('wikimedia', 'wm-1934-nsap', 'Nationalsocialistiska Folkpartiet — propagandamöte 1934',
   1934, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/a/a8/Nationalsocialistiska_Folkpartiet_1934.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nationalsocialistiska_Folkpartiet_1934.jpg/400px-Nationalsocialistiska_Folkpartiet_1934.jpg',
   'https://commons.wikimedia.org/wiki/File:Nationalsocialistiska_Folkpartiet_1934.jpg',
   'Wikimedia Commons / Kungliga biblioteket',
   'free',
   'NSFP-möte på Hvitfeldtska skolan, Göteborg. Allan G. Carlsson, John Eliasson. Visas i historisk-kritisk kontext.'),

  -- 1945 Bondeförbundet
  ('wikimedia', 'wm-1945-bf', 'Landsbygden — Rättvisa åt landsbygden 1945',
   1945, 'Rättvisa åt landsbygden',
   'https://upload.wikimedia.org/wikipedia/commons/5/59/Landsbygden_-_R%C3%A4ttvisa_%C3%A5t_landsbygden_1945.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Landsbygden_-_R%C3%A4ttvisa_%C3%A5t_landsbygden_1945.jpg/400px-Landsbygden_-_R%C3%A4ttvisa_%C3%A5t_landsbygden_1945.jpg',
   'https://commons.wikimedia.org/wiki/File:Landsbygden_-_Rättvisa_åt_landsbygden_1945.jpg',
   'Wikimedia Commons / Centerpartiet',
   'free',
   'Bondeförbundet 1945. Krigsslutets jordbrukspolitik.'),

  -- 1948 Socialdemokraterna — Vi bygger landet
  ('wikimedia', 'wm-1948-s-vibyggerlandet', 'Vi bygger landet — Socialdemokraterna',
   1948, 'Vi bygger landet',
   'https://upload.wikimedia.org/wikipedia/commons/c/c3/Vi_bygger_landet.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Vi_bygger_landet.jpg/400px-Vi_bygger_landet.jpg',
   'https://commons.wikimedia.org/wiki/File:Vi_bygger_landet.jpg',
   'Wikimedia Commons',
   'free',
   'En av efterkrigsperiodens mest kända socialdemokratiska affischer. Folkhemmet i bild.');

-- ===============================================================
-- 1957-1979 — Centerpartiet, S, V via Wikimedia + DigitaltMuseum + affischerna.se
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1957 Centerpartiet — pensionsfolkomröstningen (linje 2)
  ('wikimedia', 'wm-1957-c-linje2', 'Vi följer linje 2 — Centerpartiet 1957',
   1957, 'Vi följer linje 2, vi väljer Centerpartiet',
   'https://upload.wikimedia.org/wikipedia/commons/7/75/Gamla_valaffischer_-_13774399845.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Gamla_valaffischer_-_13774399845.jpg/400px-Gamla_valaffischer_-_13774399845.jpg',
   'https://commons.wikimedia.org/wiki/File:Gamla_valaffischer_-_13774399845.jpg',
   'Wikimedia Commons / Centerpartiet',
   'free',
   'Pensionsfolkomröstningen 1957. Centerpartiet drev linje 2.'),

  -- 1960 Socialdemokraterna — anti-Folkpartiet
  ('media_archive', 'dm-1960-s-folkpartiet', 'Där folkpartiet får sig en känga — Socialdemokraterna 1960',
   1960, NULL,
   'https://ems.dimu.org/image/0331xUEG5xC9',
   'https://ems.dimu.org/image/0331xUEG5xC9?dimension=400x400',
   'https://digitaltmuseum.se/021017974544/socialdemokratisk-valaffisch-1960-dar-folkpartiet-far-sig-en-kanga-esplanade',
   'DigitaltMuseum / Sundsvalls museum',
   'fair_use',
   'Socialdemokratisk smutskastningsaffisch mot Folkpartiet, esplanaden 1960.'),

  -- 1970 Centerpartiet
  ('wikimedia', 'wm-1970-c-ungdomligt', 'Centern — Ungdomligt tänkande 1970',
   1970, 'Ungdomligt tänkande',
   'https://upload.wikimedia.org/wikipedia/commons/9/91/Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg/400px-Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg',
   'https://commons.wikimedia.org/wiki/File:Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg',
   'Wikimedia Commons / Centerpartiet',
   'free',
   'Gunnar Hedlund (ordf), Thorbjörn Fälldin, Johannes Antonsson. Centerns generationsskifte.'),

  -- 1976 Socialdemokraterna
  ('media_archive', 'dm-1976-s-orebro', 'Valaffischer 21 augusti 1976 — Socialdemokraterna',
   1976, NULL,
   'https://ems.dimu.org/image/032wYWAAA1bf',
   'https://ems.dimu.org/image/032wYWAAA1bf?dimension=400x400',
   'https://digitaltmuseum.se/021016185672/valaffischer-21-augusti-1976-socialdemokraterna',
   'DigitaltMuseum / Örebro länsmuseum',
   'fair_use',
   'Riksdagsvalet 1976 — det val då borgerliga blocket vann för första gången sedan 1932.');

-- ===============================================================
-- 1988-2022 — Centerpartiet, KD, Piratpartiet via Wikimedia Commons
-- ===============================================================
INSERT INTO posters (source, external_id, title, year, slogan, image_url, thumbnail_url, source_url, source_attribution, rights_status, rights_note)
VALUES
  -- 1988 Centerpartiet
  ('wikimedia', 'wm-1988-c-thurdin', 'Centerpartiet 1988 — Görel Thurdin',
   1988, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/5/5b/Valaffisch_f%C3%B6r_Centerpartiet_med_G%C3%B6rel_Thurdin.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Valaffisch_f%C3%B6r_Centerpartiet_med_G%C3%B6rel_Thurdin.jpg/400px-Valaffisch_f%C3%B6r_Centerpartiet_med_G%C3%B6rel_Thurdin.jpg',
   'https://commons.wikimedia.org/wiki/File:Valaffisch_för_Centerpartiet_med_Görel_Thurdin.jpg',
   'Wikimedia Commons / Centerpartiet',
   'free',
   'Riksdagsvalet 1988. Vice partiordförande Görel Thurdin.'),

  -- 1991 Centerpartiet
  ('wikimedia', 'wm-1991-c-johansson', 'Centerpartiet 1991 — Olof Johansson',
   1991, 'Centern älskar Sverige. Hela Sverige!',
   'https://upload.wikimedia.org/wikipedia/commons/c/c5/Olof_Johansson_-_gamla_valaffischer.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Olof_Johansson_-_gamla_valaffischer.jpg/400px-Olof_Johansson_-_gamla_valaffischer.jpg',
   'https://commons.wikimedia.org/wiki/File:Olof_Johansson_-_gamla_valaffischer.jpg',
   'Wikimedia Commons / Centerpartiet',
   'free',
   'Riksdagsvalet 1991 med partiledare Olof Johansson.'),

  -- 1998 Centerpartiet
  ('wikimedia', 'wm-1998-c-daleus', 'Centerpartiet 1998 — Det här är Lennart',
   1998, 'Det här är Lennart',
   'https://upload.wikimedia.org/wikipedia/commons/b/ba/Centerpartiets_valaffisch_1998_med_Lennart_Dal%C3%A9us.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Centerpartiets_valaffisch_1998_med_Lennart_Dal%C3%A9us.jpg/400px-Centerpartiets_valaffisch_1998_med_Lennart_Dal%C3%A9us.jpg',
   'https://commons.wikimedia.org/wiki/File:Centerpartiets_valaffisch_1998_med_Lennart_Daléus.jpg',
   'Wikimedia Commons / Centerpartiet',
   'free',
   'Riksdagsvalet 1998. Lennart Daléus tog över partiledarskapet samma år.'),

  -- 2006 Piratpartiet
  ('wikimedia', 'wm-2006-pp-bat', 'Piratpartiet 2006 — Piratbåten',
   2006, 'Piratbåten',
   'https://upload.wikimedia.org/wikipedia/commons/0/0b/Piratbaten.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Piratbaten.jpg/400px-Piratbaten.jpg',
   'https://commons.wikimedia.org/wiki/File:Piratbaten.jpg',
   'Wikimedia Commons / Piratpartiet',
   'free',
   'Piratpartiets första riksdagsval. Partiet uttryckligen "no copyright".'),

  -- 2010 Piratpartiet
  ('wikimedia', 'wm-2010-pp', 'Piratpartiet 2010 — Väg väl 10',
   2010, 'Väg väl 10',
   'https://upload.wikimedia.org/wikipedia/commons/7/7a/Piratpartiet2010.jpg',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Piratpartiet2010.jpg/400px-Piratpartiet2010.jpg',
   'https://commons.wikimedia.org/wiki/File:Piratpartiet2010.jpg',
   'Wikimedia Commons / Fredrik Erlingsson',
   'free',
   'Riksdagsvalet 2010. CC-BY-SA 2.5.'),

  -- 2014 Kristdemokraterna
  ('wikimedia', 'wm-2014-kd-stockholm', 'Kristdemokraterna 2014 — valstuga Stockholm',
   2014, NULL,
   'https://upload.wikimedia.org/wikipedia/commons/8/8f/ValrorelseStockholm7.JPG',
   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/ValrorelseStockholm7.JPG/400px-ValrorelseStockholm7.JPG',
   'https://commons.wikimedia.org/wiki/File:ValrorelseStockholm7.JPG',
   'Wikimedia Commons / Patrik Nylin',
   'fair_use',
   'KD-valstuga Stockholm 2014. Foto av valrörelsen — affischen som motiv.');

-- ===============================================================
-- Kuratering: koppla nya posters till partier, valår, teman
-- ===============================================================
INSERT INTO poster_curation (poster_id, party, election_type, election_year, themes, curation_status)
SELECT
  p.id,
  CASE
    WHEN p.external_id LIKE 'wm-%-h-%' OR p.external_id LIKE 'wm-1931-avf' THEN 'Allmänna valmansförbundet'
    WHEN p.external_id LIKE 'wm-1928-ungsvenska' THEN 'Allmänna valmansförbundet'
    WHEN p.external_id LIKE 'wm-1930-bf-%' OR p.external_id LIKE 'wm-1945-bf' THEN 'Bondeförbundet'
    WHEN p.external_id LIKE '%-c-%' OR p.external_id LIKE 'wm-1957-c-%' OR p.external_id LIKE 'wm-1970-c-%' THEN 'Centerpartiet'
    WHEN p.external_id LIKE '%-s-%' THEN 'Socialdemokraterna'
    WHEN p.external_id LIKE '%-pp-%' OR p.external_id LIKE 'wm-2010-pp' THEN 'Piratpartiet'
    WHEN p.external_id LIKE '%-kd-%' THEN 'Kristdemokraterna'
    WHEN p.external_id LIKE '%-nsap' OR p.external_id LIKE '%-furugard' THEN 'Nationalsocialistiska Folkpartiet'
    WHEN p.external_id LIKE 'wm-1922-rusdryck' OR p.external_id LIKE 'wm-1957-c-linje2' THEN 'Folkomröstning'
    ELSE NULL
  END AS party,
  CASE
    WHEN p.year IN (1957) AND p.external_id LIKE 'wm-1957-c-linje2' THEN 'folkomrostning'
    WHEN p.year = 1922 THEN 'folkomrostning'
    WHEN p.year IN (1931, 1930) AND p.external_id LIKE 'wm-1931-avf' THEN 'kommun'
    ELSE 'riksdag'
  END AS election_type,
  p.year,
  CASE
    WHEN p.external_id LIKE '%kosack%' OR p.external_id LIKE '%dalaman%' OR p.external_id LIKE '%svensk-samling%' THEN ARRAY['hotbild', 'antikommunism', 'nation']
    WHEN p.external_id LIKE '%rostratt%' THEN ARRAY['rostratt', 'demokrati']
    WHEN p.external_id LIKE '%forsvaret%' THEN ARRAY['forsvar', 'krig']
    WHEN p.external_id LIKE '%vibyggerlandet%' THEN ARRAY['arbete', 'folkhem', 'framtidsloftet']
    WHEN p.external_id LIKE '%bondeforbundet%' OR p.external_id LIKE '%-bf-%' THEN ARRAY['jordbruk', 'landsbygd']
    WHEN p.external_id LIKE '%nsap%' OR p.external_id LIKE '%furugard%' THEN ARRAY['nationalism', 'extremism']
    WHEN p.external_id LIKE '%pp-%' OR p.external_id LIKE '%piratpartiet%' THEN ARRAY['integritet', 'upphovsratt', 'natpolitik']
    WHEN p.external_id LIKE '%rusdryck%' THEN ARRAY['alkohol', 'folkomrostning']
    WHEN p.external_id LIKE '%-1-maj%' OR p.external_id LIKE '%sac%' THEN ARRAY['arbete', 'arbetarrorelsen']
    ELSE ARRAY['allmant']
  END AS themes,
  'review' AS curation_status
FROM posters p
WHERE p.external_id LIKE 'wm-%' OR p.external_id LIKE 'dm-%'
ON CONFLICT (poster_id) DO NOTHING;
