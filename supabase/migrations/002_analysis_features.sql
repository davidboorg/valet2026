-- Valaffischmuseet: Analysis Features
-- Migration 002: Extends schema for analytical tools
--
-- Features enabled:
--   - Parti-tidslinje (party timeline)
--   - Ordanalys (word analysis)
--   - Retorisk taxonomi (rhetorical classification)
--   - Visuell DNA (automated visual analysis)
--   - Jämförelseverktyg (comparison tools)

-- ================================================
-- PART 1: Extend poster_curation with analysis fields
-- ================================================

-- Partitillhörighet (kan skilja från party-fältet som är striktare)
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  attributed_party TEXT;

-- Retoriska grepp (array - kan ha flera per affisch)
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  rhetorical_devices TEXT[];

-- Detaljerade visuella motiv (utökad taxonomi)
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  visual_motifs_detailed TEXT[];

-- Målgrupp
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  target_audience TEXT;

-- Ton/stämning
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  tone TEXT CHECK (tone IN (
    'hoppfull',     -- Positivt framtidsfokus
    'hotande',      -- Varningar, faror
    'saklig',       -- Neutral, informativ
    'nostalgisk',   -- Tillbakablickande
    'upprorisk',    -- Proteststämning
    'lugn'          -- Trygghetsfokus
  ));

-- Transkriberad text från affischen
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  transcribed_text TEXT;

-- Transkriptionsmetod
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  transcription_method TEXT CHECK (transcription_method IN (
    'manual',       -- Manuellt transkriberad
    'ocr',          -- Standard OCR
    'ai_assisted'   -- Claude Vision eller liknande
  ));

-- Transkriptionsstatus
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  transcription_confidence FLOAT;

-- Kommentar till transkription
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  transcription_notes TEXT;

-- ================================================
-- PART 2: Extended party profiles
-- ================================================

-- Utöka parties-tabellen
ALTER TABLE parties ADD COLUMN IF NOT EXISTS
  slug TEXT UNIQUE;

ALTER TABLE parties ADD COLUMN IF NOT EXISTS
  ideology_tags TEXT[];

ALTER TABLE parties ADD COLUMN IF NOT EXISTS
  description TEXT;

ALTER TABLE parties ADD COLUMN IF NOT EXISTS
  poster_count INTEGER DEFAULT 0;

-- Uppdatera befintliga partier med slugs
UPDATE parties SET slug = 'socialdemokraterna' WHERE abbreviation = 'S';
UPDATE parties SET slug = 'moderaterna' WHERE abbreviation = 'M';
UPDATE parties SET slug = 'sverigedemokraterna' WHERE abbreviation = 'SD';
UPDATE parties SET slug = 'centerpartiet' WHERE abbreviation = 'C';
UPDATE parties SET slug = 'vansterpartiet' WHERE abbreviation = 'V';
UPDATE parties SET slug = 'kristdemokraterna' WHERE abbreviation = 'KD';
UPDATE parties SET slug = 'liberalerna' WHERE abbreviation = 'L';
UPDATE parties SET slug = 'miljopartiet' WHERE abbreviation = 'MP';
UPDATE parties SET slug = 'hogerpartiet' WHERE name = 'Högerpartiet';
UPDATE parties SET slug = 'bondeforbundet' WHERE name = 'Bondeförbundet';

-- Lägg till ideologi-taggar för historisk analys
UPDATE parties SET ideology_tags = ARRAY['socialdemokrati', 'arbetarrörelsen'] WHERE abbreviation = 'S';
UPDATE parties SET ideology_tags = ARRAY['konservatism', 'liberalism'] WHERE abbreviation = 'M';
UPDATE parties SET ideology_tags = ARRAY['nationalism', 'socialkonservatism'] WHERE abbreviation = 'SD';
UPDATE parties SET ideology_tags = ARRAY['agrarianism', 'liberalism', 'decentralism'] WHERE abbreviation = 'C';
UPDATE parties SET ideology_tags = ARRAY['socialism', 'kommunism'] WHERE abbreviation = 'V';
UPDATE parties SET ideology_tags = ARRAY['kristdemokrati', 'konservatism'] WHERE abbreviation = 'KD';
UPDATE parties SET ideology_tags = ARRAY['liberalism', 'socialliberalism'] WHERE abbreviation = 'L';
UPDATE parties SET ideology_tags = ARRAY['ekologism', 'grön politik'] WHERE abbreviation = 'MP';
UPDATE parties SET ideology_tags = ARRAY['konservatism', 'nationalism'] WHERE name = 'Högerpartiet';
UPDATE parties SET ideology_tags = ARRAY['agrarianism'] WHERE name = 'Bondeförbundet';

-- ================================================
-- PART 3: Word frequency cache
-- ================================================

CREATE TABLE IF NOT EXISTS word_frequencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,                           -- Originalord
  normalized_word TEXT NOT NULL,                -- Lowercase, stemmed
  count INTEGER NOT NULL DEFAULT 1,
  decade TEXT,                                  -- '1920s', '1930s' etc. (null = alla)
  party TEXT,                                   -- null = alla partier
  poster_ids UUID[],                            -- Vilka affischer ordet förekommer på
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(normalized_word, decade, party)
);

CREATE INDEX IF NOT EXISTS idx_word_freq_normalized ON word_frequencies(normalized_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_decade ON word_frequencies(decade);
CREATE INDEX IF NOT EXISTS idx_word_freq_party ON word_frequencies(party);
CREATE INDEX IF NOT EXISTS idx_word_freq_count ON word_frequencies(count DESC);

-- ================================================
-- PART 4: Visual analysis results
-- ================================================

CREATE TABLE IF NOT EXISTS visual_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID REFERENCES posters(id) ON DELETE CASCADE,

  -- Färganalys
  dominant_colors JSONB,                        -- [{hex: "#FF0000", percentage: 0.35}, ...]
  color_temperature FLOAT,                      -- -1 (kall) till 1 (varm)

  -- Kompositionsanalys
  text_area_ratio FLOAT,                        -- 0.0 till 1.0
  has_illustration BOOLEAN,
  has_photograph BOOLEAN,
  composition TEXT CHECK (composition IN (
    'central',      -- Centrerad komposition
    'asymmetric',   -- Asymmetrisk
    'diagonal',     -- Diagonal rörelse
    'grid',         -- Rutnätsbaserad
    'text_dominant' -- Mest text
  )),

  -- Kontrast och kvalitet
  contrast_level TEXT CHECK (contrast_level IN ('high', 'medium', 'low')),
  estimated_print_technique TEXT CHECK (estimated_print_technique IN (
    'lithography',  -- Litografi (vanligt tidigt)
    'letterpress',  -- Boktryck
    'offset',       -- Offset (modernt)
    'screen',       -- Screentryck
    'unknown'
  )),

  -- Metadata
  analysis_version TEXT DEFAULT '1.0',
  analyzed_at TIMESTAMPTZ DEFAULT now(),
  analysis_method TEXT CHECK (analysis_method IN (
    'manual',       -- Manuell bedömning
    'automated',    -- Automatiserad (Python/OpenCV)
    'ai_assisted'   -- AI-assisterad (Claude Vision)
  )),

  UNIQUE(poster_id)
);

CREATE INDEX IF NOT EXISTS idx_visual_poster ON visual_analysis(poster_id);
CREATE INDEX IF NOT EXISTS idx_visual_composition ON visual_analysis(composition);
CREATE INDEX IF NOT EXISTS idx_visual_colors ON visual_analysis USING GIN(dominant_colors);

-- ================================================
-- PART 5: Election context (valets tidsanda)
-- ================================================

CREATE TABLE IF NOT EXISTS election_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_year INTEGER UNIQUE NOT NULL,
  election_type TEXT DEFAULT 'riksdag',

  -- Kontext
  headline TEXT,                                -- Kort sammanfattning ("Första valet med allmän rösträtt")
  description TEXT,                             -- Längre beskrivning
  key_issues TEXT[],                            -- Huvudfrågor i valrörelsen

  -- Historisk kontext
  historical_events TEXT[],                     -- Viktiga händelser samma år
  international_context TEXT,                   -- Internationell kontext

  -- Aggregerad data (uppdateras via trigger/function)
  poster_count INTEGER DEFAULT 0,
  parties_represented TEXT[],
  dominant_themes TEXT[],
  dominant_rhetorical_devices TEXT[],

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_election_year ON election_contexts(election_year);

-- Seed med grundläggande valår från samlingen
INSERT INTO election_contexts (election_year, headline, key_issues) VALUES
  (1892, 'Tidigt politiskt engagemang', ARRAY['rösträttsfrågan', 'arbetarfrågan']),
  (1911, 'Före den allmänna rösträtten', ARRAY['rösträttsfrågan', 'försvarsfrågan']),
  (1914, 'Bondetåget och borggårdskrisen', ARRAY['försvarsfrågan', 'kungens roll']),
  (1917, 'Hungerupplopp och revolution i Europa', ARRAY['livsmedelsbrist', 'demokrati']),
  (1920, 'Första valet med allmän rösträtt för män', ARRAY['demokrati', 'sociala reformer']),
  (1921, 'Första valet med allmän rösträtt för alla', ARRAY['demokrati', 'jämställdhet', 'nykterhet']),
  (1924, 'Efterkrigstidens utmaningar', ARRAY['arbetslöshet', 'ekonomi']),
  (1928, 'Kosakval - försvarsfrågan dominerar', ARRAY['försvar', 'rustningar', 'Sovjet']),
  (1932, 'Depressionen och Kreugerkraschen', ARRAY['arbetslöshet', 'ekonomisk kris']),
  (1936, 'Per Albin och folkhemmet', ARRAY['försvar', 'välfärd', 'Abessinien']),
  (1940, 'Samlingsregering under kriget', ARRAY['neutralitet', 'försvar', 'beredskap']),
  (1944, 'Krigets slutskede', ARRAY['efterkrigstid', 'välfärd']),
  (1948, 'Efterkrigstid och kalla kriget', ARRAY['välfärd', 'utrikespolitik'])
ON CONFLICT (election_year) DO NOTHING;

-- ================================================
-- PART 6: Comparison sessions (för jämförelseverktyget)
-- ================================================

CREATE TABLE IF NOT EXISTS comparison_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type TEXT CHECK (session_type IN (
    'poster_vs_poster',   -- Två specifika affischer
    'party_vs_party',     -- Alla affischer från två partier
    'decade_vs_decade'    -- Alla affischer från två årtionden
  )),

  -- Jämförelseobjekt
  left_poster_id UUID REFERENCES posters(id) ON DELETE SET NULL,
  right_poster_id UUID REFERENCES posters(id) ON DELETE SET NULL,
  left_party TEXT,
  right_party TEXT,
  left_decade TEXT,
  right_decade TEXT,

  -- Sparad för delning
  share_slug TEXT UNIQUE,
  view_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comparison_share ON comparison_sessions(share_slug);

-- ================================================
-- PART 7: New indexes for analysis queries
-- ================================================

-- Index för attributed_party (parti-tidslinje)
CREATE INDEX IF NOT EXISTS idx_curation_attributed_party ON poster_curation(attributed_party);

-- Index för retoriska grepp
CREATE INDEX IF NOT EXISTS idx_curation_rhetorical ON poster_curation USING GIN(rhetorical_devices);

-- Index för detaljerade motiv
CREATE INDEX IF NOT EXISTS idx_curation_motifs_detailed ON poster_curation USING GIN(visual_motifs_detailed);

-- Index för ton
CREATE INDEX IF NOT EXISTS idx_curation_tone ON poster_curation(tone);

-- Fulltext-index för transkriberad text
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS transcription_fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('swedish', coalesce(transcribed_text, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS idx_curation_transcription_fts ON poster_curation USING GIN(transcription_fts);

-- ================================================
-- PART 8: RLS policies for new tables
-- ================================================

ALTER TABLE word_frequencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_sessions ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read word_frequencies" ON word_frequencies FOR SELECT USING (true);
CREATE POLICY "Public read visual_analysis" ON visual_analysis FOR SELECT USING (true);
CREATE POLICY "Public read election_contexts" ON election_contexts FOR SELECT USING (true);
CREATE POLICY "Public read comparison_sessions" ON comparison_sessions FOR SELECT USING (true);

-- Auth write
CREATE POLICY "Auth write word_frequencies" ON word_frequencies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write visual_analysis" ON visual_analysis FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write election_contexts" ON election_contexts FOR ALL USING (auth.role() = 'authenticated');

-- Anyone can create comparison sessions (for sharing)
CREATE POLICY "Anyone can create comparisons" ON comparison_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update comparisons" ON comparison_sessions FOR UPDATE USING (auth.role() = 'authenticated');

-- ================================================
-- PART 9: Helper functions
-- ================================================

-- Function: Update party poster count
CREATE OR REPLACE FUNCTION update_party_poster_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count for old party (if changed)
  IF TG_OP = 'UPDATE' AND OLD.attributed_party IS DISTINCT FROM NEW.attributed_party THEN
    UPDATE parties SET poster_count = (
      SELECT COUNT(*) FROM poster_curation WHERE attributed_party = OLD.attributed_party
    ) WHERE slug = OLD.attributed_party OR abbreviation = OLD.attributed_party;
  END IF;

  -- Update count for new party
  IF NEW.attributed_party IS NOT NULL THEN
    UPDATE parties SET poster_count = (
      SELECT COUNT(*) FROM poster_curation WHERE attributed_party = NEW.attributed_party
    ) WHERE slug = NEW.attributed_party OR abbreviation = NEW.attributed_party;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_party_count_on_curation
  AFTER INSERT OR UPDATE ON poster_curation
  FOR EACH ROW
  EXECUTE FUNCTION update_party_poster_count();

-- Function: Update election context aggregates
CREATE OR REPLACE FUNCTION update_election_context_aggregates()
RETURNS TRIGGER AS $$
DECLARE
  v_year INTEGER;
BEGIN
  v_year := COALESCE(NEW.election_year, (SELECT year FROM posters WHERE id = NEW.poster_id));

  IF v_year IS NOT NULL THEN
    UPDATE election_contexts SET
      poster_count = (
        SELECT COUNT(*)
        FROM poster_curation pc
        JOIN posters p ON pc.poster_id = p.id
        WHERE COALESCE(pc.election_year, p.year) = v_year
      ),
      parties_represented = (
        SELECT ARRAY_AGG(DISTINCT attributed_party)
        FROM poster_curation pc
        JOIN posters p ON pc.poster_id = p.id
        WHERE COALESCE(pc.election_year, p.year) = v_year
        AND attributed_party IS NOT NULL
      ),
      updated_at = now()
    WHERE election_year = v_year;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_election_aggregates_on_curation
  AFTER INSERT OR UPDATE ON poster_curation
  FOR EACH ROW
  EXECUTE FUNCTION update_election_context_aggregates();

-- ================================================
-- PART 10: Views for common queries
-- ================================================

-- View: Posters with full curation data (for timeline)
CREATE OR REPLACE VIEW posters_with_curation AS
SELECT
  p.*,
  pc.attributed_party,
  pc.election_year as curation_election_year,
  pc.rhetorical_devices,
  pc.visual_motifs_detailed,
  pc.tone,
  pc.transcribed_text,
  pc.themes,
  pc.context_text_short,
  pc.curation_status
FROM posters p
LEFT JOIN poster_curation pc ON p.id = pc.poster_id;

-- View: Party timeline data
CREATE OR REPLACE VIEW party_timeline AS
SELECT
  COALESCE(pc.attributed_party, pc.party) as party,
  COALESCE(pc.election_year, p.year) as year,
  COUNT(*) as poster_count,
  ARRAY_AGG(p.id) as poster_ids
FROM posters p
LEFT JOIN poster_curation pc ON p.id = pc.poster_id
WHERE COALESCE(pc.attributed_party, pc.party) IS NOT NULL
GROUP BY
  COALESCE(pc.attributed_party, pc.party),
  COALESCE(pc.election_year, p.year)
ORDER BY year, party;

-- View: Decade aggregates
CREATE OR REPLACE VIEW decade_aggregates AS
SELECT
  (FLOOR(COALESCE(pc.election_year, p.year) / 10) * 10)::TEXT || 's' as decade,
  COUNT(*) as poster_count,
  ARRAY_AGG(DISTINCT COALESCE(pc.attributed_party, pc.party)) FILTER (WHERE COALESCE(pc.attributed_party, pc.party) IS NOT NULL) as parties,
  ARRAY_AGG(DISTINCT unnested_theme) FILTER (WHERE unnested_theme IS NOT NULL) as themes
FROM posters p
LEFT JOIN poster_curation pc ON p.id = pc.poster_id
LEFT JOIN LATERAL unnest(pc.themes) as unnested_theme ON true
WHERE COALESCE(pc.election_year, p.year) IS NOT NULL
GROUP BY decade
ORDER BY decade;
