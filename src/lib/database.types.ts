export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ================================================
// Enums for controlled vocabularies
// ================================================

export type RightsStatus = 'free' | 'restricted'
export type CurationStatus = 'draft' | 'review' | 'published'

export type Tone =
  | 'hoppfull'     // Positivt framtidsfokus
  | 'hotande'      // Varningar, faror
  | 'saklig'       // Neutral, informativ
  | 'nostalgisk'   // Tillbakablickande
  | 'upprorisk'    // Proteststämning
  | 'lugn'         // Trygghetsfokus

export type TranscriptionMethod = 'manual' | 'ocr' | 'ai_assisted'

export type Composition = 'central' | 'asymmetric' | 'diagonal' | 'grid' | 'text_dominant'
export type ContrastLevel = 'high' | 'medium' | 'low'
export type PrintTechnique = 'lithography' | 'letterpress' | 'offset' | 'screen' | 'unknown'
export type AnalysisMethod = 'manual' | 'automated' | 'ai_assisted'

export type ComparisonSessionType = 'poster_vs_poster' | 'party_vs_party' | 'decade_vs_decade'

// ================================================
// Rhetorical devices taxonomy
// ================================================

export type RhetoricalDevice =
  | 'framtidsloftet'      // "Vi ska bygga...", "För ett bättre..."
  | 'hotbilden'           // "Om dom vinner...", "Faran med..."
  | 'vi_och_dom'          // Tydlig indelning i ingrupp/utgrupp
  | 'nostalgin'           // "Förr var det bättre", tillbakablickande
  | 'trygghetsloftet'     // "För din trygghet", "Säkert Sverige"
  | 'folkligt_tilltal'    // "Du", "medborgare", direkt tilltal
  | 'auktoritativt'       // Institutionellt språk, formellt
  | 'fragan'              // Retorisk fråga som rubrik
  | 'uppmaningen'         // "Rösta på!", "Kräv!", imperativ
  | 'faktapastaaendet'    // Statistik, siffror som argument
  | 'kaensloargumentet'   // Appell till känslor, dramatik
  | 'humor_satir'         // Karikatyr, ironi

// ================================================
// Visual motifs taxonomy
// ================================================

export type VisualMotif =
  | 'flagga_foster'       // Svenska flaggan eller nationssymboler
  | 'arbetare'            // Arbetarikonografi, industri, hammare
  | 'familj'              // Familjebilder, barn, hemmet
  | 'natur_landskap'      // Svenskt landskap, jordbruk
  | 'hand_naven'          // Höjd näve, handslag
  | 'text_dominant'       // Nästan bara text, minimal illustration
  | 'illustration'        // Tecknad/ritad illustration
  | 'portratt'            // Avbildning av person/kandidat
  | 'karikatyr'           // Överdrivna tecknade figurer
  | 'abstrakt_symbol'     // Geometriska former, symboler
  | 'fotografi'           // Fotografisk bild
  | 'vapenemblem'         // Partisymboler, heraldik

// ================================================
// Color analysis types
// ================================================

export interface DominantColor {
  hex: string
  percentage: number
}

// ================================================
// Database interface
// ================================================

export interface Database {
  public: {
    Tables: {
      // ----------------------------------------
      // Core tables
      // ----------------------------------------
      posters: {
        Row: {
          id: string
          kb_digitalt_id: string
          regina_id: string | null
          libris_id: string | null
          title: string
          creator: string | null
          publisher: string | null
          year: number | null
          iiif_manifest_url: string
          iiif_image_base_url: string
          image_width: number | null
          image_height: number | null
          rights_status: RightsStatus
          kb_digitalt_url: string
          raw_metadata: Json | null
          synced_at: string
          created_at: string
        }
        Insert: {
          id?: string
          kb_digitalt_id: string
          regina_id?: string | null
          libris_id?: string | null
          title: string
          creator?: string | null
          publisher?: string | null
          year?: number | null
          iiif_manifest_url: string
          iiif_image_base_url: string
          image_width?: number | null
          image_height?: number | null
          rights_status: RightsStatus
          kb_digitalt_url: string
          raw_metadata?: Json | null
          synced_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          kb_digitalt_id?: string
          regina_id?: string | null
          libris_id?: string | null
          title?: string
          creator?: string | null
          publisher?: string | null
          year?: number | null
          iiif_manifest_url?: string
          iiif_image_base_url?: string
          image_width?: number | null
          image_height?: number | null
          rights_status?: RightsStatus
          kb_digitalt_url?: string
          raw_metadata?: Json | null
          synced_at?: string
          created_at?: string
        }
      }

      poster_curation: {
        Row: {
          id: string
          poster_id: string
          // Original fields
          party: string | null
          party_historical_names: string[] | null
          election_type: string | null
          election_year: number | null
          themes: string[] | null
          visual_motifs: string[] | null
          rhetorical_style: string | null
          context_text_short: string | null
          context_text_long: string | null
          sensitivity_flags: string[] | null
          content_warning: string | null
          requires_context: boolean
          provenance_note: string | null
          curation_status: CurationStatus
          curated_by: string | null
          curated_at: string | null
          created_at: string
          updated_at: string
          // New analysis fields (migration 002)
          attributed_party: string | null
          rhetorical_devices: RhetoricalDevice[] | null
          visual_motifs_detailed: VisualMotif[] | null
          target_audience: string | null
          tone: Tone | null
          transcribed_text: string | null
          transcription_method: TranscriptionMethod | null
          transcription_confidence: number | null
          transcription_notes: string | null
        }
        Insert: {
          id?: string
          poster_id: string
          party?: string | null
          party_historical_names?: string[] | null
          election_type?: string | null
          election_year?: number | null
          themes?: string[] | null
          visual_motifs?: string[] | null
          rhetorical_style?: string | null
          context_text_short?: string | null
          context_text_long?: string | null
          sensitivity_flags?: string[] | null
          content_warning?: string | null
          requires_context?: boolean
          provenance_note?: string | null
          curation_status?: CurationStatus
          curated_by?: string | null
          curated_at?: string | null
          created_at?: string
          updated_at?: string
          attributed_party?: string | null
          rhetorical_devices?: RhetoricalDevice[] | null
          visual_motifs_detailed?: VisualMotif[] | null
          target_audience?: string | null
          tone?: Tone | null
          transcribed_text?: string | null
          transcription_method?: TranscriptionMethod | null
          transcription_confidence?: number | null
          transcription_notes?: string | null
        }
        Update: {
          id?: string
          poster_id?: string
          party?: string | null
          party_historical_names?: string[] | null
          election_type?: string | null
          election_year?: number | null
          themes?: string[] | null
          visual_motifs?: string[] | null
          rhetorical_style?: string | null
          context_text_short?: string | null
          context_text_long?: string | null
          sensitivity_flags?: string[] | null
          content_warning?: string | null
          requires_context?: boolean
          provenance_note?: string | null
          curation_status?: CurationStatus
          curated_by?: string | null
          curated_at?: string | null
          created_at?: string
          updated_at?: string
          attributed_party?: string | null
          rhetorical_devices?: RhetoricalDevice[] | null
          visual_motifs_detailed?: VisualMotif[] | null
          target_audience?: string | null
          tone?: Tone | null
          transcribed_text?: string | null
          transcription_method?: TranscriptionMethod | null
          transcription_confidence?: number | null
          transcription_notes?: string | null
        }
      }

      parties: {
        Row: {
          id: string
          name: string
          abbreviation: string | null
          historical_names: string[] | null
          founded_year: number | null
          color: string | null
          active: boolean
          // New fields (migration 002)
          slug: string | null
          ideology_tags: string[] | null
          description: string | null
          poster_count: number
        }
        Insert: {
          id?: string
          name: string
          abbreviation?: string | null
          historical_names?: string[] | null
          founded_year?: number | null
          color?: string | null
          active?: boolean
          slug?: string | null
          ideology_tags?: string[] | null
          description?: string | null
          poster_count?: number
        }
        Update: {
          id?: string
          name?: string
          abbreviation?: string | null
          historical_names?: string[] | null
          founded_year?: number | null
          color?: string | null
          active?: boolean
          slug?: string | null
          ideology_tags?: string[] | null
          description?: string | null
          poster_count?: number
        }
      }

      exhibitions: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          poster_ids: string[] | null
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          poster_ids?: string[] | null
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          poster_ids?: string[] | null
          published?: boolean
          created_at?: string
        }
      }

      // ----------------------------------------
      // Analysis tables (migration 002)
      // ----------------------------------------
      word_frequencies: {
        Row: {
          id: string
          word: string
          normalized_word: string
          count: number
          decade: string | null
          party: string | null
          poster_ids: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word: string
          normalized_word: string
          count?: number
          decade?: string | null
          party?: string | null
          poster_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          normalized_word?: string
          count?: number
          decade?: string | null
          party?: string | null
          poster_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }

      visual_analysis: {
        Row: {
          id: string
          poster_id: string
          dominant_colors: DominantColor[] | null
          color_temperature: number | null
          text_area_ratio: number | null
          has_illustration: boolean | null
          has_photograph: boolean | null
          composition: Composition | null
          contrast_level: ContrastLevel | null
          estimated_print_technique: PrintTechnique | null
          analysis_version: string
          analyzed_at: string
          analysis_method: AnalysisMethod | null
        }
        Insert: {
          id?: string
          poster_id: string
          dominant_colors?: DominantColor[] | null
          color_temperature?: number | null
          text_area_ratio?: number | null
          has_illustration?: boolean | null
          has_photograph?: boolean | null
          composition?: Composition | null
          contrast_level?: ContrastLevel | null
          estimated_print_technique?: PrintTechnique | null
          analysis_version?: string
          analyzed_at?: string
          analysis_method?: AnalysisMethod | null
        }
        Update: {
          id?: string
          poster_id?: string
          dominant_colors?: DominantColor[] | null
          color_temperature?: number | null
          text_area_ratio?: number | null
          has_illustration?: boolean | null
          has_photograph?: boolean | null
          composition?: Composition | null
          contrast_level?: ContrastLevel | null
          estimated_print_technique?: PrintTechnique | null
          analysis_version?: string
          analyzed_at?: string
          analysis_method?: AnalysisMethod | null
        }
      }

      election_contexts: {
        Row: {
          id: string
          election_year: number
          election_type: string
          headline: string | null
          description: string | null
          key_issues: string[] | null
          historical_events: string[] | null
          international_context: string | null
          poster_count: number
          parties_represented: string[] | null
          dominant_themes: string[] | null
          dominant_rhetorical_devices: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          election_year: number
          election_type?: string
          headline?: string | null
          description?: string | null
          key_issues?: string[] | null
          historical_events?: string[] | null
          international_context?: string | null
          poster_count?: number
          parties_represented?: string[] | null
          dominant_themes?: string[] | null
          dominant_rhetorical_devices?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          election_year?: number
          election_type?: string
          headline?: string | null
          description?: string | null
          key_issues?: string[] | null
          historical_events?: string[] | null
          international_context?: string | null
          poster_count?: number
          parties_represented?: string[] | null
          dominant_themes?: string[] | null
          dominant_rhetorical_devices?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }

      comparison_sessions: {
        Row: {
          id: string
          session_type: ComparisonSessionType | null
          left_poster_id: string | null
          right_poster_id: string | null
          left_party: string | null
          right_party: string | null
          left_decade: string | null
          right_decade: string | null
          share_slug: string | null
          view_count: number
          created_at: string
        }
        Insert: {
          id?: string
          session_type?: ComparisonSessionType | null
          left_poster_id?: string | null
          right_poster_id?: string | null
          left_party?: string | null
          right_party?: string | null
          left_decade?: string | null
          right_decade?: string | null
          share_slug?: string | null
          view_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_type?: ComparisonSessionType | null
          left_poster_id?: string | null
          right_poster_id?: string | null
          left_party?: string | null
          right_party?: string | null
          left_decade?: string | null
          right_decade?: string | null
          share_slug?: string | null
          view_count?: number
          created_at?: string
        }
      }

      sync_log: {
        Row: {
          id: string
          sync_type: string
          started_at: string
          completed_at: string | null
          status: 'running' | 'completed' | 'failed'
          items_processed: number
          items_created: number
          items_updated: number
          items_failed: number
          error_message: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          sync_type: string
          started_at?: string
          completed_at?: string | null
          status?: 'running' | 'completed' | 'failed'
          items_processed?: number
          items_created?: number
          items_updated?: number
          items_failed?: number
          error_message?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          sync_type?: string
          started_at?: string
          completed_at?: string | null
          status?: 'running' | 'completed' | 'failed'
          items_processed?: number
          items_created?: number
          items_updated?: number
          items_failed?: number
          error_message?: string | null
          metadata?: Json | null
        }
      }
    }

    Views: {
      posters_with_curation: {
        Row: {
          id: string
          kb_digitalt_id: string
          title: string
          year: number | null
          iiif_image_base_url: string
          rights_status: RightsStatus
          attributed_party: string | null
          curation_election_year: number | null
          rhetorical_devices: RhetoricalDevice[] | null
          visual_motifs_detailed: VisualMotif[] | null
          tone: Tone | null
          transcribed_text: string | null
          themes: string[] | null
          context_text_short: string | null
          curation_status: CurationStatus | null
        }
      }
      party_timeline: {
        Row: {
          party: string
          year: number
          poster_count: number
          poster_ids: string[]
        }
      }
      decade_aggregates: {
        Row: {
          decade: string
          poster_count: number
          parties: string[]
          themes: string[]
        }
      }
    }

    Functions: {
      [_ in never]: never
    }

    Enums: {
      [_ in never]: never
    }
  }
}

// ================================================
// Convenience types
// ================================================

export type Poster = Database['public']['Tables']['posters']['Row']
export type PosterInsert = Database['public']['Tables']['posters']['Insert']
export type PosterUpdate = Database['public']['Tables']['posters']['Update']

export type PosterCuration = Database['public']['Tables']['poster_curation']['Row']
export type PosterCurationInsert = Database['public']['Tables']['poster_curation']['Insert']
export type PosterCurationUpdate = Database['public']['Tables']['poster_curation']['Update']

export type Party = Database['public']['Tables']['parties']['Row']
export type PartyInsert = Database['public']['Tables']['parties']['Insert']
export type PartyUpdate = Database['public']['Tables']['parties']['Update']

export type Exhibition = Database['public']['Tables']['exhibitions']['Row']
export type WordFrequency = Database['public']['Tables']['word_frequencies']['Row']
export type VisualAnalysis = Database['public']['Tables']['visual_analysis']['Row']
export type ElectionContext = Database['public']['Tables']['election_contexts']['Row']
export type ComparisonSession = Database['public']['Tables']['comparison_sessions']['Row']

// View types
export type PosterWithCuration = Database['public']['Views']['posters_with_curation']['Row']
export type PartyTimelineRow = Database['public']['Views']['party_timeline']['Row']
export type DecadeAggregate = Database['public']['Views']['decade_aggregates']['Row']

// ================================================
// Labels for UI (Swedish)
// ================================================

export const RHETORICAL_DEVICE_LABELS: Record<RhetoricalDevice, string> = {
  framtidsloftet: 'Framtidslöftet',
  hotbilden: 'Hotbilden',
  vi_och_dom: 'Vi och dom',
  nostalgin: 'Nostalgin',
  trygghetsloftet: 'Trygghetslöftet',
  folkligt_tilltal: 'Folkligt tilltal',
  auktoritativt: 'Auktoritativt',
  fragan: 'Frågan',
  uppmaningen: 'Uppmaningen',
  faktapastaaendet: 'Faktapåståendet',
  kaensloargumentet: 'Känsloargumentet',
  humor_satir: 'Humor/satir',
}

export const VISUAL_MOTIF_LABELS: Record<VisualMotif, string> = {
  flagga_foster: 'Flagga/fosterland',
  arbetare: 'Arbetare/industri',
  familj: 'Familj/barn',
  natur_landskap: 'Natur/landskap',
  hand_naven: 'Hand/näve',
  text_dominant: 'Textdominerad',
  illustration: 'Illustration',
  portratt: 'Porträtt',
  karikatyr: 'Karikatyr',
  abstrakt_symbol: 'Abstrakt symbol',
  fotografi: 'Fotografi',
  vapenemblem: 'Vapen/emblem',
}

export const TONE_LABELS: Record<Tone, string> = {
  hoppfull: 'Hoppfull',
  hotande: 'Hotande',
  saklig: 'Saklig',
  nostalgisk: 'Nostalgisk',
  upprorisk: 'Upprorisk',
  lugn: 'Lugn',
}

export const COMPOSITION_LABELS: Record<Composition, string> = {
  central: 'Centrerad',
  asymmetric: 'Asymmetrisk',
  diagonal: 'Diagonal',
  grid: 'Rutnät',
  text_dominant: 'Textdominerad',
}
