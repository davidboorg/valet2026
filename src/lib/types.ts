// KB API Types

export interface KBSearchResponse {
  '@id': string;
  '@context': string;
  total: number;
  hits: KBPoster[];
  aggs?: {
    datePublished?: {
      label: string;
      values: Array<{
        value: string;
        count: number;
        url: { '@id': string };
      }>;
    };
    genreForm?: {
      label: string;
      values: Array<{
        value: string;
        count: number;
      }>;
    };
  };
}

export interface KBPoster {
  '@id': string;
  '@type': string;
  title: string;
  datePublished?: string;
  thumbnail?: string;
  imageServiceId?: string;
  accessAllowed: boolean;
  identifiedBy?: Array<{
    '@type': string;
    value: string;
    typeNote?: string | null;
  }>;
  isPartOf?: {
    '@id': string;
    '@type': string;
    title: string;
    meta?: { controlNumber: string };
    genreForm?: Array<{
      '@type': string;
      prefLabel: { sv?: string; en?: string };
    }>;
  };
  genreForm?: Array<{
    '@type': string;
    prefLabel: { sv?: string; en?: string };
  }>;
  contribution?: Array<{
    '@type': string;
    agent?: Array<{
      '@id'?: string;
      displayName?: string;
      name?: string;
    }>;
    role?: Array<{
      '@id': string;
      '@type': string;
      prefLabelByLang?: { sv?: string; en?: string };
      code?: string;
    }>;
  }>;
  usageAndAccessPolicy?: Array<{
    '@id': string;
    value: string;
    prefLabelByLang?: { sv?: string; en?: string };
  }>;
}

// IIIF Types

export interface IIIFImageInfo {
  '@context': string;
  protocol: string;
  id: string;
  type: string;
  profile: string;
  width: number;
  height: number;
  maxWidth?: number;
  maxHeight?: number;
  sizes?: Array<{
    width: number;
    height: number;
  }>;
  tiles?: Array<{
    width: number;
    height?: number;
    scaleFactors: number[];
  }>;
  extraQualities?: string[];
  extraFormats?: string[];
  extraFeatures?: string[];
}

// Application Types

export type PosterSource =
  | 'kb'
  | 'affischerna'
  | 'arab'
  | 'wikimedia'
  | 'sd_party'
  | 'moderaterna_party'
  | 'media_archive'
  | 'external';

export type RightsStatus = 'free' | 'restricted' | 'fair_use' | 'unknown';

export interface Poster {
  id: string;
  title: string;
  creator?: string;
  year?: number;
  thumbnailUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  rightsStatus: RightsStatus;
  rightsNote?: string;        // Specific rights text
  collection?: string;
  genreForm?: string[];
  party?: string;
  slogan?: string;            // Main slogan if known

  // Source information
  source: PosterSource;
  sourceUrl?: string;         // Link to original source
  sourceAttribution?: string; // Credit text

  // KB-specific fields (optional for external sources)
  kbDigitaltId?: string;
  reginaId?: string;
  librisId?: string;
  iiifImageBaseUrl?: string;
  kbDigitaltUrl?: string;

  // External source fields
  imageUrl?: string;          // Direct image URL for non-IIIF sources
  highResUrl?: string;        // High-res version if available

  // Supabase Storage fields
  storagePublicUrl?: string;  // URL from Supabase Storage (prioritized)
  uploadStatus?: 'pending' | 'uploading' | 'uploaded' | 'failed' | 'missing_source' | 'skipped';

  // Analysis fields (from poster_curation)
  transcribedText?: string;
  themes?: string[];
  rhetoricalDevices?: string[];
  visualMotifs?: string[];
  tone?: 'hoppfull' | 'hotande' | 'saklig' | 'nostalgisk' | 'upprorisk' | 'lugn';
}

export interface SearchParams {
  q?: string;
  year?: string;
  party?: string;
  theme?: string;
  page?: string;
  limit?: string;
}

/**
 * Row type from Supabase v_election_posters view
 */
export interface VElectionPoster {
  id: string;
  title: string;
  creator?: string;
  year?: number;
  source: PosterSource;
  source_url?: string;
  source_attribution?: string;
  rights_status?: RightsStatus;
  rights_note?: string;
  slogan?: string;
  thumbnail_url?: string;
  image_url?: string;
  high_res_url?: string;
  iiif_image_base_url?: string;
  kb_digitalt_id?: string;
  // Supabase Storage fields
  storage_path?: string;
  storage_public_url?: string;
  upload_status?: 'pending' | 'uploading' | 'uploaded' | 'failed' | 'missing_source' | 'skipped';
  // Curation fields
  party?: string;
  election_year?: number;
  themes?: string[];
  context_text_short?: string;
  context_text_long?: string;
  sensitivity_flags?: string[];
  content_warning?: string;
}
