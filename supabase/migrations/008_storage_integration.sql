-- Valaffischmuseet: Migration 008 — Supabase Storage Integration
--
-- Bakgrund: Flytta från externa bild-URL:er och lokal cache (public/affischer/)
-- till Supabase Storage för permanent bildlagring. Detta ger:
-- - Oberoende av externa källor (Wikimedia rate limits, döda länkar)
-- - Enhetlig bildhantering med CDN
-- - Bättre kontroll över rättigheter och åtkomst

-- ===============================================================
-- 1. Storage-relaterade fält i posters-tabellen
-- ===============================================================

-- Sökväg i Supabase Storage bucket
-- Format: "{year}/{party}/{id}.{ext}" t.ex. "2022/sd/sd-2022-001.jpg"
ALTER TABLE posters ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Genererad publik URL från Supabase Storage
ALTER TABLE posters ADD COLUMN IF NOT EXISTS storage_public_url TEXT;

-- Uppladdningsstatus för att tracka migrering
ALTER TABLE posters ADD COLUMN IF NOT EXISTS upload_status TEXT DEFAULT 'pending';
ALTER TABLE posters DROP CONSTRAINT IF EXISTS posters_upload_status_check;
ALTER TABLE posters ADD CONSTRAINT posters_upload_status_check
  CHECK (upload_status IN ('pending', 'uploading', 'uploaded', 'failed', 'missing_source', 'skipped'));

-- Tidsstämpel för senaste uppladdning
ALTER TABLE posters ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ;

-- SHA256-hash för deduplicering och integritetskontroll
ALTER TABLE posters ADD COLUMN IF NOT EXISTS image_hash TEXT;

-- Bildmetadata
ALTER TABLE posters ADD COLUMN IF NOT EXISTS image_format TEXT; -- jpg, png, webp
ALTER TABLE posters ADD COLUMN IF NOT EXISTS image_size_bytes INTEGER;

-- ===============================================================
-- 2. Uppdatera constraint för att tillåta storage som bildkälla
-- ===============================================================

-- Ta bort gammal constraint
ALTER TABLE posters DROP CONSTRAINT IF EXISTS posters_has_image;

-- Ny constraint: minst en av IIIF, direkt-URL, eller Storage måste finnas
-- (eller poster är under uppladdning)
ALTER TABLE posters ADD CONSTRAINT posters_has_image
  CHECK (
    iiif_image_base_url IS NOT NULL
    OR image_url IS NOT NULL
    OR thumbnail_url IS NOT NULL
    OR storage_public_url IS NOT NULL
    OR upload_status IN ('pending', 'uploading', 'missing_source')
  );

-- ===============================================================
-- 3. Index för snabb filtrering
-- ===============================================================

CREATE INDEX IF NOT EXISTS idx_posters_upload_status ON posters(upload_status);
CREATE INDEX IF NOT EXISTS idx_posters_storage_path ON posters(storage_path);
CREATE INDEX IF NOT EXISTS idx_posters_image_hash ON posters(image_hash);

-- ===============================================================
-- 4. Uppdatera v_election_posters view
-- ===============================================================

-- Drop och återskapa vyn för att ändra kolumnordning
DROP VIEW IF EXISTS v_election_posters;

CREATE VIEW v_election_posters AS
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
  -- Prioritera Supabase Storage, sedan IIIF, sedan externa URL:er
  COALESCE(p.storage_public_url, p.thumbnail_url, p.image_url) AS thumbnail_url,
  COALESCE(p.storage_public_url, p.image_url, p.thumbnail_url) AS image_url,
  p.high_res_url,
  p.iiif_image_base_url,
  p.kb_digitalt_id,
  p.storage_path,
  p.storage_public_url,
  p.upload_status,
  p.uploaded_at,
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
  'Affischer kopplade till svenska riksdagsval. Prioriterar Supabase Storage-bilder.';

-- ===============================================================
-- 5. Storage bucket setup (kör manuellt i Supabase Dashboard)
-- ===============================================================
--
-- Bucket: posters (public)
--
-- Policies:
--
-- CREATE POLICY "Public read posters"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'posters');
--
-- CREATE POLICY "Service role upload posters"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'posters'
--   AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
-- );
--
-- CREATE POLICY "Service role delete posters"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'posters'
--   AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
-- );

-- ===============================================================
-- 6. Funktion för att generera storage_path
-- ===============================================================

CREATE OR REPLACE FUNCTION generate_poster_storage_path(
  p_id TEXT,
  p_year INTEGER,
  p_party TEXT,
  p_format TEXT DEFAULT 'jpg'
) RETURNS TEXT AS $$
DECLARE
  party_abbrev TEXT;
BEGIN
  -- Normalisera partinamn till förkortning
  party_abbrev := CASE LOWER(COALESCE(p_party, 'unknown'))
    WHEN 'socialdemokraterna' THEN 's'
    WHEN 'moderaterna' THEN 'm'
    WHEN 'sverigedemokraterna' THEN 'sd'
    WHEN 'centerpartiet' THEN 'c'
    WHEN 'vänsterpartiet' THEN 'v'
    WHEN 'miljöpartiet' THEN 'mp'
    WHEN 'liberalerna' THEN 'l'
    WHEN 'folkpartiet' THEN 'l'
    WHEN 'kristdemokraterna' THEN 'kd'
    WHEN 'högerpartiet' THEN 'h'
    WHEN 'bondeförbundet' THEN 'bf'
    WHEN 'allmänna valmansförbundet' THEN 'avf'
    ELSE 'other'
  END;

  RETURN COALESCE(p_year::TEXT, 'unknown') || '/' || party_abbrev || '/' || p_id || '.' || p_format;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION generate_poster_storage_path IS
  'Genererar konsistent storage path för en affisch: {year}/{party}/{id}.{format}';
