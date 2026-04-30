-- Valaffischmuseet: Migration 003 — External sources
--
-- Bakgrund: Den ursprungliga schemat antog att alla affischer kommer från KB
-- via IIIF. För modern era (1988→) finns inget i KB, men material finns hos
-- partiarkiv, mediaorganisationer, Wikimedia Commons m.fl. Den här migrationen
-- öppnar upp posters-tabellen för externa källor och skärper rättighetsmodellen.

-- ===============================================================
-- 1. Gör IIIF-fält nullable. Externa källor saknar dessa.
-- ===============================================================
ALTER TABLE posters ALTER COLUMN iiif_manifest_url DROP NOT NULL;
ALTER TABLE posters ALTER COLUMN iiif_image_base_url DROP NOT NULL;
ALTER TABLE posters ALTER COLUMN kb_digitalt_id DROP NOT NULL;
ALTER TABLE posters ALTER COLUMN kb_digitalt_url DROP NOT NULL;

-- KB digitalt_id behöver vara unik bara när den finns
ALTER TABLE posters DROP CONSTRAINT IF EXISTS posters_kb_digitalt_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS posters_kb_digitalt_id_unique
  ON posters(kb_digitalt_id)
  WHERE kb_digitalt_id IS NOT NULL;

-- ===============================================================
-- 2. Nya kolumner för externa källor
-- ===============================================================
ALTER TABLE posters ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'kb'
  CHECK (source IN ('kb', 'affischerna', 'arab', 'wikimedia', 'sd_party', 'moderaterna_party', 'media_archive', 'external'));

ALTER TABLE posters ADD COLUMN IF NOT EXISTS external_id TEXT;       -- ID inom källan
ALTER TABLE posters ADD COLUMN IF NOT EXISTS image_url TEXT;          -- direkt-URL för icke-IIIF
ALTER TABLE posters ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;      -- explicit thumbnail
ALTER TABLE posters ADD COLUMN IF NOT EXISTS high_res_url TEXT;       -- bästa kvalitet om annan
ALTER TABLE posters ADD COLUMN IF NOT EXISTS source_url TEXT;         -- länk till källans sida
ALTER TABLE posters ADD COLUMN IF NOT EXISTS source_attribution TEXT; -- kreditrad
ALTER TABLE posters ADD COLUMN IF NOT EXISTS rights_note TEXT;        -- specifik rättighetstext
ALTER TABLE posters ADD COLUMN IF NOT EXISTS slogan TEXT;             -- huvudslogan om känd

-- Säkerställ att antingen IIIF ELLER direkt-URL finns
ALTER TABLE posters DROP CONSTRAINT IF EXISTS posters_has_image;
ALTER TABLE posters ADD CONSTRAINT posters_has_image
  CHECK (
    iiif_image_base_url IS NOT NULL
    OR image_url IS NOT NULL
    OR thumbnail_url IS NOT NULL
  );

-- ===============================================================
-- 3. Skärp rättighetsmodellen
-- ===============================================================
-- 'free'           = public domain, fri användning
-- 'restricted'     = upphovsrättsskyddat men ok att visa thumbnail med attribution
-- 'fair_use'       = visning för kritik/utbildning, ej kommersiell
-- 'unknown'        = oklart, hantera försiktigt
ALTER TABLE posters DROP CONSTRAINT IF EXISTS posters_rights_status_check;
ALTER TABLE posters ADD CONSTRAINT posters_rights_status_check
  CHECK (rights_status IN ('free', 'restricted', 'fair_use', 'unknown'));

-- ===============================================================
-- 4. Index på source och kombinationer
-- ===============================================================
CREATE INDEX IF NOT EXISTS idx_posters_source ON posters(source);
CREATE INDEX IF NOT EXISTS idx_posters_year_source ON posters(year, source);

-- ===============================================================
-- 5. Vy som plockar ut färdiga "election posters" oavsett källa
-- ===============================================================
CREATE OR REPLACE VIEW v_election_posters AS
SELECT
  p.id,
  p.title,
  p.creator,
  p.year,
  p.source,
  p.source_url,
  p.source_attribution,
  p.rights_status,
  p.rights_note,
  p.slogan,
  COALESCE(p.thumbnail_url, p.image_url) AS thumbnail_url,
  p.image_url,
  p.high_res_url,
  p.iiif_image_base_url,
  p.kb_digitalt_id,
  c.party,
  c.election_year,
  c.themes,
  c.context_text_short,
  c.context_text_long,
  c.sensitivity_flags,
  c.content_warning
FROM posters p
LEFT JOIN poster_curation c ON c.poster_id = p.id
WHERE p.year IN (
  -- Riksdagsvalen
  1893, 1896, 1899, 1902, 1905, 1908, 1911, 1914, 1917,
  1920, 1921, 1924, 1928, 1932, 1936, 1940, 1944, 1948,
  1952, 1956, 1958, 1960, 1964, 1968,
  1970, 1973, 1976, 1979, 1982, 1985, 1988, 1991,
  1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026
);

COMMENT ON VIEW v_election_posters IS
  'Affischer kopplade till svenska riksdagsval, oavsett källa.';
