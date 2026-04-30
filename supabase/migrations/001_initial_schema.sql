-- Valaffischmuseet: Initial Schema
-- Based on build prompt specification

-- ================================================
-- Källmetadata (från KB — låst, uppdateras via sync)
-- ================================================
CREATE TABLE posters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kb_digitalt_id TEXT UNIQUE NOT NULL,        -- t.ex. "dark-8501200"
  regina_id TEXT,                              -- KB:s Regina ID
  libris_id TEXT,                              -- Libris-URI om tillgänglig
  title TEXT NOT NULL,
  creator TEXT,                                -- upphovsman/formgivare
  publisher TEXT,                              -- utgivare/tryckeri
  year INTEGER,                                -- utgivningsår
  iiif_manifest_url TEXT NOT NULL,             -- IIIF Presentation API manifest
  iiif_image_base_url TEXT NOT NULL,           -- IIIF Image API bas-URL
  image_width INTEGER,
  image_height INTEGER,
  rights_status TEXT NOT NULL CHECK (rights_status IN ('free', 'restricted')),
  kb_digitalt_url TEXT NOT NULL,               -- länk tillbaka till KB Digitalt
  raw_metadata JSONB,                          -- komplett KB-metadata som backup
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- Kurateringsmetadata (eget — öppet licensierat)
-- ================================================
CREATE TABLE poster_curation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID REFERENCES posters(id) ON DELETE CASCADE,
  -- Taxonomi (tre navigeringsaxlar)
  party TEXT,                                  -- parti (kontrollerad vokabulär)
  party_historical_names TEXT[],               -- historiska partinamn/splittringar
  election_type TEXT,                          -- riksdag/kommun/region/EU/folkomröstning
  election_year INTEGER,                       -- specifikt valår
  -- Teman och motiv
  themes TEXT[],                               -- välfärd, försvar, skatter, migration etc.
  visual_motifs TEXT[],                        -- flagga, arbetarikonografi, barnfamilj etc.
  rhetorical_style TEXT,                       -- framtidslöfte, hotbild, "vi och dom" etc.
  -- Kontext
  context_text_short TEXT,                     -- "Vad ser vi?" (2-3 meningar)
  context_text_long TEXT,                      -- Historisk kontext (längre essä)
  -- Känsligt innehåll & etik
  sensitivity_flags TEXT[],                    -- hatpropaganda, stereotyper, våldsbild etc.
  content_warning TEXT,                        -- visas före affischen om satt
  requires_context BOOLEAN DEFAULT false,      -- kräver kontexttext före visning
  -- Provenance
  provenance_note TEXT,                        -- källhänvisning
  -- Status
  curation_status TEXT DEFAULT 'draft' CHECK (curation_status IN ('draft', 'review', 'published')),
  curated_by TEXT,
  curated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poster_id)
);

-- ================================================
-- Kontrollerad vokabulär för partier
-- ================================================
CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,                   -- nuvarande namn
  abbreviation TEXT,                           -- S, M, SD, V etc.
  historical_names TEXT[],                     -- tidigare namn
  founded_year INTEGER,
  color TEXT,                                  -- hex-färg för UI
  active BOOLEAN DEFAULT true
);

-- ================================================
-- Temautställningar
-- ================================================
CREATE TABLE exhibitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  poster_ids UUID[],                           -- ordnad lista
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- Sync log för datainsamling
-- ================================================
CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL,                     -- 'full', 'incremental', 'single'
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  items_processed INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB
);

-- ================================================
-- Indexes för prestanda
-- ================================================
CREATE INDEX idx_posters_year ON posters(year);
CREATE INDEX idx_posters_rights ON posters(rights_status);
CREATE INDEX idx_posters_kb_id ON posters(kb_digitalt_id);
CREATE INDEX idx_curation_party ON poster_curation(party);
CREATE INDEX idx_curation_election_year ON poster_curation(election_year);
CREATE INDEX idx_curation_themes ON poster_curation USING GIN(themes);
CREATE INDEX idx_curation_status ON poster_curation(curation_status);
CREATE INDEX idx_exhibitions_slug ON exhibitions(slug);
CREATE INDEX idx_exhibitions_published ON exhibitions(published);

-- ================================================
-- Full-text search (svenska)
-- ================================================
ALTER TABLE posters ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('swedish', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('swedish', coalesce(creator, '')), 'B')
  ) STORED;
CREATE INDEX idx_posters_fts ON posters USING GIN(fts);

-- ================================================
-- Row Level Security
-- ================================================
ALTER TABLE posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE poster_curation ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- Publik läsning för alla tabeller
CREATE POLICY "Public read posters" ON posters FOR SELECT USING (true);
CREATE POLICY "Public read curation" ON poster_curation FOR SELECT USING (curation_status = 'published');
CREATE POLICY "Public read parties" ON parties FOR SELECT USING (true);
CREATE POLICY "Public read exhibitions" ON exhibitions FOR SELECT USING (published = true);

-- Autentiserad skrivning
CREATE POLICY "Auth write posters" ON posters FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write curation" ON poster_curation FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write parties" ON parties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write exhibitions" ON exhibitions FOR ALL USING (auth.role() = 'authenticated');

-- ================================================
-- Seed data: Svenska partier
-- ================================================
INSERT INTO parties (name, abbreviation, historical_names, founded_year, color, active) VALUES
  ('Socialdemokraterna', 'S', ARRAY['Sveriges socialdemokratiska arbetareparti', 'SAP'], 1889, '#E8112D', true),
  ('Moderaterna', 'M', ARRAY['Högerpartiet', 'Allmänna valmansförbundet'], 1904, '#52BDEC', true),
  ('Sverigedemokraterna', 'SD', NULL, 1988, '#DDDD00', true),
  ('Centerpartiet', 'C', ARRAY['Bondeförbundet'], 1913, '#009933', true),
  ('Vänsterpartiet', 'V', ARRAY['Vänsterpartiet kommunisterna', 'VPK', 'Sveriges kommunistiska parti', 'SKP'], 1917, '#DA291C', true),
  ('Kristdemokraterna', 'KD', ARRAY['Kristen demokratisk samling', 'KDS'], 1964, '#000077', true),
  ('Liberalerna', 'L', ARRAY['Folkpartiet', 'Folkpartiet liberalerna', 'FP'], 1934, '#006AB3', true),
  ('Miljöpartiet', 'MP', ARRAY['Miljöpartiet de gröna'], 1981, '#83CF39', true),
  ('Högerpartiet', NULL, ARRAY['Allmänna valmansförbundet'], 1904, '#1B49DD', false),
  ('Bondeförbundet', NULL, NULL, 1913, '#008000', false);

-- ================================================
-- Helper function: Update timestamp
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER poster_curation_updated_at
  BEFORE UPDATE ON poster_curation
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
