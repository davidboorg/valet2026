-- Valaffischmuseet: Analysis Metadata
-- Migration 009: Adds reproducibility metadata for AI analysis
--
-- Purpose:
--   - Track which model was used for analysis
--   - Store prompt version for reproducibility
--   - Record analysis timestamp
--   - Enable re-running analysis with different models

-- ================================================
-- PART 1: Add analysis metadata columns
-- ================================================

-- Model used for analysis (e.g., 'claude-sonnet-4-20250514')
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  analysis_model TEXT;

-- Version of the analysis prompt (semver style: '1.0.0')
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  analysis_prompt_version TEXT;

-- Hash of the prompt used (for exact reproducibility)
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  analysis_prompt_hash TEXT;

-- When the analysis was performed
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  analyzed_at TIMESTAMPTZ;

-- Image URL used for analysis (to detect if source changed)
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  analysis_source_url TEXT;

-- Analysis status for tracking quality
ALTER TABLE poster_curation ADD COLUMN IF NOT EXISTS
  analysis_status TEXT CHECK (analysis_status IN (
    'pending',        -- Waiting for analysis
    'completed',      -- Successfully analyzed
    'failed',         -- Analysis failed
    'needs_review',   -- Flagged for manual review
    'verified'        -- Manually verified as correct
  )) DEFAULT 'pending';

-- ================================================
-- PART 2: Create view for analysis statistics
-- ================================================

CREATE OR REPLACE VIEW v_analysis_stats AS
SELECT
  analysis_model,
  analysis_prompt_version,
  analysis_status,
  COUNT(*) as count,
  MIN(analyzed_at) as first_analysis,
  MAX(analyzed_at) as last_analysis
FROM poster_curation
WHERE analysis_model IS NOT NULL
GROUP BY analysis_model, analysis_prompt_version, analysis_status
ORDER BY last_analysis DESC NULLS LAST;

-- ================================================
-- PART 3: Index for analysis queries
-- ================================================

CREATE INDEX IF NOT EXISTS idx_poster_curation_analysis_status
  ON poster_curation(analysis_status);

CREATE INDEX IF NOT EXISTS idx_poster_curation_analyzed_at
  ON poster_curation(analyzed_at);

-- ================================================
-- PART 4: Update existing records to mark as legacy
-- ================================================

-- Mark existing analyzed records as needing review (they lack metadata)
UPDATE poster_curation
SET
  analysis_status = 'needs_review',
  analysis_prompt_version = '0.9.0'  -- Pre-metadata version
WHERE
  transcription_method = 'ai_assisted'
  AND analysis_model IS NULL;
