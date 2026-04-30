import type { Poster, PosterSource, RightsStatus } from './types';

/**
 * External poster sources configuration
 */
export const EXTERNAL_SOURCES: Record<PosterSource, {
  name: string;
  url: string;
  attribution: string;
  supportsIIIF: boolean;
}> = {
  kb: {
    name: 'Kungliga biblioteket',
    url: 'https://data.kb.se',
    attribution: 'Kungliga biblioteket',
    supportsIIIF: true,
  },
  affischerna: {
    name: 'Affischerna 1967-1979',
    url: 'https://affischerna.se',
    attribution: 'Affischerna 1967-1979',
    supportsIIIF: false,
  },
  arab: {
    name: 'Arbetarrörelsens arkiv och bibliotek',
    url: 'https://arbark.se',
    attribution: 'ARAB',
    supportsIIIF: false,
  },
  wikimedia: {
    name: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org',
    attribution: 'Wikimedia Commons',
    supportsIIIF: false,
  },
  sd_party: {
    name: 'Sverigedemokraterna (officiell)',
    url: 'https://sd.se',
    attribution: 'Sverigedemokraterna',
    supportsIIIF: false,
  },
  moderaterna_party: {
    name: 'Moderaterna (officiell)',
    url: 'https://moderaterna.se',
    attribution: 'Moderaterna',
    supportsIIIF: false,
  },
  media_archive: {
    name: 'Mediaarkiv',
    url: '',
    attribution: '',
    supportsIIIF: false,
  },
  external: {
    name: 'Extern källa',
    url: '',
    attribution: '',
    supportsIIIF: false,
  },
};

/**
 * Create a poster from an external source
 */
export function createExternalPoster(data: {
  id: string;
  title: string;
  year?: number;
  party?: string;
  creator?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  highResUrl?: string;
  source: PosterSource;
  sourceUrl?: string;
  sourceAttribution?: string;
  rightsStatus?: RightsStatus;
  rightsNote?: string;
  slogan?: string;
}): Poster {
  const sourceConfig = EXTERNAL_SOURCES[data.source];

  // Default to fair_use for media_archive sources
  const defaultRights: RightsStatus = data.source === 'media_archive' ? 'fair_use' : 'unknown';

  return {
    id: data.id,
    title: data.title,
    year: data.year,
    party: data.party,
    creator: data.creator,
    source: data.source,
    thumbnailUrl: data.thumbnailUrl || data.imageUrl,
    imageUrl: data.imageUrl,
    highResUrl: data.highResUrl,
    sourceUrl: data.sourceUrl || sourceConfig.url,
    sourceAttribution: data.sourceAttribution || sourceConfig.attribution,
    rightsStatus: data.rightsStatus || defaultRights,
    rightsNote: data.rightsNote,
    slogan: data.slogan,
  };
}

/**
 * Affischerna.se poster data
 * These are manually curated election posters from affischerna.se
 */
export const AFFISCHERNA_POSTERS: Poster[] = [
  // 1970 election
  createExternalPoster({
    id: 'aff-1970-s-001',
    title: 'Socialdemokraterna 1970',
    year: 1970,
    party: 'Socialdemokraterna',
    imageUrl: 'https://affischerna.se/wp-content/uploads/2015/04/DSC04516-400x565.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
  }),
  createExternalPoster({
    id: 'aff-1973-vpk-001',
    title: 'VPK 1973',
    year: 1973,
    party: 'Vänsterpartiet',
    imageUrl: 'https://affischerna.se/wp-content/uploads/2015/04/DSC04546-400x541.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
  }),
  createExternalPoster({
    id: 'aff-1976-c-001',
    title: 'Centerpartiet 1976',
    year: 1976,
    party: 'Centerpartiet',
    imageUrl: 'https://affischerna.se/wp-content/uploads/2015/02/DSC02700-400x565.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
  }),
  createExternalPoster({
    id: 'aff-1976-nej-001',
    title: 'Nej till kärnkraft 1976',
    year: 1976,
    imageUrl: 'https://affischerna.se/wp-content/uploads/1976/09/nej_till-copy-400x553-1.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
  }),
  createExternalPoster({
    id: 'aff-1979-s-001',
    title: 'Socialdemokraterna 1979',
    year: 1979,
    party: 'Socialdemokraterna',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1979/01/MG_5993.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
  }),
  createExternalPoster({
    id: 'aff-1979-m-001',
    title: 'Moderaterna 1979',
    year: 1979,
    party: 'Moderaterna',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1979/09/MG_6025.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
  }),
];

/**
 * Sverigedemokraterna — riksdagsval 1988-2022
 *
 * Källor: Wikipedia (slogans), sd.se (officiellt material för 2022),
 * Wikimedia Commons, Dagens Arbete, Dagens Opinion.
 *
 * Rättigheter: Affischerna är upphovsrättsskyddade (URL §1, gäller >70 år
 * efter formgivarens död). Vi lagrar metadata + thumbnail med länk till
 * primärkälla — användning sker inom ramen för URL §23 (citaträtten för
 * kritik och vetenskaplig framställning). Före publik lansering bör
 * juridisk granskning + helst tillstånd från SD-kansliet inhämtas.
 */
export const SD_POSTERS: Poster[] = [
  // 1988 - Grundningsår, ingen känd valaffisch
  // 1991 - Anders Klarström, ingen publikt arkiverad affisch
  // 1994, 1998 - Mikael Jansson, mycket sparsamt material
  createExternalPoster({
    id: 'sd-2002',
    title: 'Sverigedemokraterna 2002 — Trygghet och tradition',
    year: 2002,
    party: 'Sverigedemokraterna',
    imageUrl: '',
    source: 'sd_party',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
    sourceAttribution: 'Sverigedemokraterna (slogan via Wikipedia)',
    rightsStatus: 'unknown',
  }),
  createExternalPoster({
    id: 'sd-2010',
    title: 'Sverigedemokraterna 2010 — Invandringsbroms eller pensionsbroms?',
    year: 2010,
    party: 'Sverigedemokraterna',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Jimmesd.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Jimmesd.jpg/400px-Jimmesd.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jimmesd.jpg',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'restricted',
  }),
  createExternalPoster({
    id: 'sd-2014',
    title: 'Sverigedemokraterna 2014 — Förändring på riktigt!',
    year: 2014,
    party: 'Sverigedemokraterna',
    slogan: 'Förändring på riktigt!',
    imageUrl: 'https://da.se/app/uploads/2018/04/skruvat-sd.jpg',
    source: 'media_archive',
    sourceUrl: 'https://da.se/2018/04/val-uppat-vaggarna/',
    sourceAttribution: 'Dagens Arbete / TT Nyhetsbyrån',
    rightsStatus: 'fair_use',
    rightsNote: 'Visas enligt URL §23 för kritik och utbildning.',
  }),
  createExternalPoster({
    id: 'sd-2018',
    title: 'Sverigedemokraterna 2018 — SD2018',
    year: 2018,
    party: 'Sverigedemokraterna',
    imageUrl: '',
    source: 'sd_party',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
    sourceAttribution: 'Sverigedemokraterna (slogan via Wikipedia)',
    rightsStatus: 'unknown',
  }),
  createExternalPoster({
    id: 'sd-2022-manifest',
    title: 'Sverigedemokraterna 2022 — Sverige ska bli bra igen',
    year: 2022,
    party: 'Sverigedemokraterna',
    imageUrl: 'https://www.sd.se/wp-content/uploads/2022/08/610f6f9c-e93b-481d-a963-53a9c7077b85.jpg',
    source: 'sd_party',
    sourceUrl: 'https://www.sd.se/sverigedemokraternas-valmanifest-2022/',
    sourceAttribution: 'Sverigedemokraterna',
    rightsStatus: 'restricted',
  }),
];

/**
 * Moderaterna — riksdagsval 1988-2022
 */
export const MODERATERNA_POSTERS: Poster[] = [
  createExternalPoster({
    id: 'm-1991',
    title: 'Moderaterna 1991 — Brottslingar ska sitta inne. Du ska våga vara ute.',
    year: 1991,
    party: 'Moderaterna',
    imageUrl: '',
    source: 'moderaterna_party',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
    sourceAttribution: 'Moderaterna (slogan via Wikipedia)',
    rightsStatus: 'unknown',
  }),
  createExternalPoster({
    id: 'm-2002',
    title: 'Moderaterna 2002 — Skattesänkning för fler',
    year: 2002,
    party: 'Moderaterna',
    imageUrl: '',
    source: 'moderaterna_party',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
    sourceAttribution: 'Moderaterna',
    rightsStatus: 'unknown',
  }),
  createExternalPoster({
    id: 'm-2006',
    title: 'Moderaterna 2006 — Sveriges nya arbetarparti',
    year: 2006,
    party: 'Moderaterna',
    imageUrl: '',
    source: 'moderaterna_party',
    sourceUrl: 'https://arbetet.se/2017/03/24/det-nya-arbetarpartiets-resa-tur-och-retur/',
    sourceAttribution: 'Nya Moderaterna',
    rightsStatus: 'unknown',
  }),
  createExternalPoster({
    id: 'm-2010',
    title: 'Moderaterna 2010 — Bara ett arbetarparti kan fixa jobben',
    year: 2010,
    party: 'Moderaterna',
    slogan: 'Bara ett arbetarparti kan fixa jobben',
    imageUrl: 'https://media.arto.se/app/uploads/sites/10/2017/03/2010_02.jpg',
    source: 'media_archive',
    sourceUrl: 'https://arbetet.se/2017/03/24/det-nya-arbetarpartiets-resa-tur-och-retur/',
    sourceAttribution: 'Arbetet',
    rightsStatus: 'fair_use',
    rightsNote: 'Visas enligt URL §23 för kritik och utbildning.',
  }),
  createExternalPoster({
    id: 'm-2014',
    title: 'Moderaterna 2014 — 250 000 nya jobb är bara början',
    year: 2014,
    party: 'Moderaterna',
    slogan: '250 000 nya jobb är bara början',
    imageUrl: 'https://media.arto.se/app/uploads/sites/10/2017/03/2014_13.jpg',
    source: 'media_archive',
    sourceUrl: 'https://arbetet.se/2017/03/24/det-nya-arbetarpartiets-resa-tur-och-retur/',
    sourceAttribution: 'Arbetet',
    rightsStatus: 'fair_use',
    rightsNote: 'Visas enligt URL §23 för kritik och utbildning.',
  }),
  createExternalPoster({
    id: 'm-2018',
    title: 'Moderaterna 2018 — Nu tar vi tag i Sverige',
    year: 2018,
    party: 'Moderaterna',
    imageUrl: '',
    source: 'moderaterna_party',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
    sourceAttribution: 'Moderaterna',
    rightsStatus: 'unknown',
  }),
  createExternalPoster({
    id: 'm-2022',
    title: 'Moderaterna 2022 — Nu får vi ordning på Sverige',
    year: 2022,
    party: 'Moderaterna',
    imageUrl: '',
    source: 'moderaterna_party',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
    sourceAttribution: 'Moderaterna',
    rightsStatus: 'unknown',
  }),
];

/**
 * Wikimedia Commons-affischer från Sveriges politiska historia
 * Allt material >70 år gammalt är public domain. Modernare material taggas
 * fair_use eller restricted med tydlig attribution.
 */
export const WIKIMEDIA_POSTERS: Poster[] = [
  // ====== 1900-1948: PUBLIC DOMAIN ======
  createExternalPoster({
    id: 'wm-1908-s-lindblad',
    title: 'A.C. Lindblad — andrakammarvalet 1908',
    year: 1908,
    party: 'Socialdemokraterna',
    slogan: 'Rättvisa åt arbetarne och småfolket',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/A.C.Lindblad-valaffisch.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/A.C.Lindblad-valaffisch.jpg/400px-A.C.Lindblad-valaffisch.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:A.C.Lindblad-valaffisch.jpg',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1912-rostratt',
    title: 'Rösträttsmöte april 1912',
    year: 1912,
    slogan: 'Kvinnlig rösträtt',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Affisch_om_r%C3%B6str%C3%A4ttsm%C3%B6te_april_1912.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Affisch_om_r%C3%B6str%C3%A4ttsm%C3%B6te_april_1912.jpg/400px-Affisch_om_r%C3%B6str%C3%A4ttsm%C3%B6te_april_1912.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Affisch_om_rösträttsmöte_april_1912.jpg',
    sourceAttribution: 'Wikimedia Commons / Nordiska museet',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1914-h-forsvaret',
    title: 'Försvaret främst — Högerpartiet 1914',
    year: 1914,
    party: 'Högerpartiet',
    slogan: 'Försvaret främst',
    creator: 'Gunnar Widholm',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/F%C3%B6rsvaret_fr%C3%A4mst.JPG',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/F%C3%B6rsvaret_fr%C3%A4mst.JPG/400px-F%C3%B6rsvaret_fr%C3%A4mst.JPG',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:F%C3%B6rsvaret_fr%C3%A4mst.JPG',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1916-sac',
    title: '1 Maj 1916 — arbetarrörelsens möte',
    year: 1916,
    party: 'Socialdemokraterna',
    slogan: '1 Maj 1916',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/1_Maj_1916.png',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/1_Maj_1916.png/400px-1_Maj_1916.png',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1_Maj_1916.png',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1917-rostratt',
    title: 'Mötesaffisch för kvinnlig rösträtt 1917',
    year: 1917,
    slogan: 'Kvinnlig rösträtt',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/M%C3%B6tesaffisch_f%C3%B6r_kvinnlig_r%C3%B6str%C3%A4tt.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/M%C3%B6tesaffisch_f%C3%B6r_kvinnlig_r%C3%B6str%C3%A4tt.jpg/400px-M%C3%B6tesaffisch_f%C3%B6r_kvinnlig_r%C3%B6str%C3%A4tt.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mötesaffisch_för_kvinnlig_rösträtt.jpg',
    sourceAttribution: 'Wikimedia Commons / Marinmuseum Karlskrona',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1922-rusdryck',
    title: 'Avlöningsafton — Rösta ja! 1922',
    year: 1922,
    party: 'Folkomröstning',
    slogan: 'Rösta ja!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Avl%C3%B6ningsafton_-_R%C3%B6sta_ja%21_1922.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Avl%C3%B6ningsafton_-_R%C3%B6sta_ja%21_1922.jpg/400px-Avl%C3%B6ningsafton_-_R%C3%B6sta_ja%21_1922.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Avlöningsafton_-_Rösta_ja!_1922.jpg',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1928-h-dalaman',
    title: 'Dalamän, rädda fosterlandet — Kosackvalet 1928',
    year: 1928,
    party: 'Allmänna valmansförbundet',
    slogan: 'Dalamän, rädda fosterlandet',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg/400px-Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dalam%C3%A4n_r%C3%A4dda_fosterlandet_-_andrakammarvalet_1928.jpg',
    sourceAttribution: 'Wikimedia Commons / Kungliga biblioteket',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1928-h-svensk-samling',
    title: 'Välj högern för svensk samling 1928',
    year: 1928,
    party: 'Allmänna valmansförbundet',
    slogan: 'Välj högern för svensk samling',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Valaffisch-v%C3%A4lj_med_h%C3%B6gern_f%C3%B6r_svensk_samling-redigerad.jpeg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Valaffisch-v%C3%A4lj_med_h%C3%B6gern_f%C3%B6r_svensk_samling-redigerad.jpeg/400px-Valaffisch-v%C3%A4lj_med_h%C3%B6gern_f%C3%B6r_svensk_samling-redigerad.jpeg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Valaffisch-välj_med_högern_för_svensk_samling-redigerad.jpeg',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1930-bf-smor',
    title: 'Bondeförbundet 1930 — Smör eller margarin',
    year: 1930,
    party: 'Bondeförbundet',
    slogan: 'Smör eller margarin',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Bondef%C3%B6rbundets_valaffisch_1930.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bondef%C3%B6rbundets_valaffisch_1930.jpg/400px-Bondef%C3%B6rbundets_valaffisch_1930.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bondeförbundets_valaffisch_1930.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1930-h-tagar',
    title: 'Högern tågar ut i valkampen',
    year: 1930,
    party: 'Allmänna valmansförbundet',
    slogan: 'Högern tågar ut i valkampen',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/H%C3%B6gern_t%C3%A5gar_ut_i_valkampen.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/H%C3%B6gern_t%C3%A5gar_ut_i_valkampen.jpg/400px-H%C3%B6gern_t%C3%A5gar_ut_i_valkampen.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Högern_tågar_ut_i_valkampen.jpg',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1931-avf',
    title: 'Allmänna valmansförbundet — valaffisch 1931',
    year: 1931,
    party: 'Allmänna valmansförbundet',
    creator: 'Moje Åslund',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Valaffisch_f%C3%B6r_AVF_1931.png',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Valaffisch_f%C3%B6r_AVF_1931.png/400px-Valaffisch_f%C3%B6r_AVF_1931.png',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Valaffisch_för_AVF_1931.png',
    sourceAttribution: 'Wikimedia Commons / Moje Åslund',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1945-bf',
    title: 'Bondeförbundet 1945 — Rättvisa åt landsbygden',
    year: 1945,
    party: 'Bondeförbundet',
    slogan: 'Rättvisa åt landsbygden',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Landsbygden_-_R%C3%A4ttvisa_%C3%A5t_landsbygden_1945.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Landsbygden_-_R%C3%A4ttvisa_%C3%A5t_landsbygden_1945.jpg/400px-Landsbygden_-_R%C3%A4ttvisa_%C3%A5t_landsbygden_1945.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Landsbygden_-_Rättvisa_åt_landsbygden_1945.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'wm-1936-ballot-distribution',
    title: 'Valdistribution 1936 — fyra partier i bakgrunden (SAP-affisch)',
    year: 1936,
    party: 'Socialdemokraterna',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Ballot-distribution-swedish-election-1936.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Ballot-distribution-swedish-election-1936.jpg/400px-Ballot-distribution-swedish-election-1936.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ballot-distribution-swedish-election-1936.jpg',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
    rightsNote: 'Foto vid vallokal 1936 där Socialistiska partiets affisch syns i bakgrunden. Aktivister från Kommunistiska partiet, Nationalsocialistiska Arbetarpartiet syns dela ut röstsedlar.',
  }),
  createExternalPoster({
    id: 'wm-1922-engstrom-kraftor',
    title: 'Kräftor kräva dessa drycker — Albert Engström, folkomröstning 1922',
    year: 1922,
    party: 'Folkomröstning',
    slogan: 'Kräftor kräva dessa drycker',
    creator: 'Albert Engström',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Kr%C3%A4ftor_kr%C3%A4va_dessa_drycker.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Kr%C3%A4ftor_kr%C3%A4va_dessa_drycker.jpg/500px-Kr%C3%A4ftor_kr%C3%A4va_dessa_drycker.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kr%C3%A4ftor_kr%C3%A4va_dessa_drycker.jpg',
    sourceAttribution: 'Wikimedia Commons / Albert Engström',
    rightsStatus: 'free',
    rightsNote: 'Albert Engströms berömda affisch mot rusdrycksförbudet 1922. Bukowskis-källan. En av Sveriges mest kända politiska affischer någonsin.',
  }),
  createExternalPoster({
    id: 'wm-1948-s-vibyggerlandet',
    title: 'Vi bygger landet — Socialdemokraterna',
    year: 1948,
    party: 'Socialdemokraterna',
    slogan: 'Vi bygger landet',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Vi_bygger_landet.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Vi_bygger_landet.jpg/400px-Vi_bygger_landet.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vi_bygger_landet.jpg',
    sourceAttribution: 'Wikimedia Commons',
    rightsStatus: 'free',
  }),

  // ====== 1957-1979 ======
  createExternalPoster({
    id: 'wm-1957-c-linje2',
    title: 'Centerpartiet 1957 — Vi följer linje 2',
    year: 1957,
    party: 'Centerpartiet',
    slogan: 'Vi följer linje 2, vi väljer Centerpartiet',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Gamla_valaffischer_-_13774399845.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Gamla_valaffischer_-_13774399845.jpg/400px-Gamla_valaffischer_-_13774399845.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gamla_valaffischer_-_13774399845.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'free',
    rightsNote: 'Pensionsfolkomröstningen 1957.',
  }),
  createExternalPoster({
    id: 'wm-1970-c-ungdomligt',
    title: 'Centern 1970 — Ungdomligt tänkande',
    year: 1970,
    party: 'Centerpartiet',
    slogan: 'Ungdomligt tänkande',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg/400px-Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Centern_-_Ungdomligt_t%C3%A4nkande_1970.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'fair_use',
  }),

  // ====== 1988-2014 ======
  createExternalPoster({
    id: 'wm-1988-c-thurdin',
    title: 'Centerpartiet 1988 — Görel Thurdin',
    year: 1988,
    party: 'Centerpartiet',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Valaffisch_f%C3%B6r_Centerpartiet_med_G%C3%B6rel_Thurdin.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Valaffisch_f%C3%B6r_Centerpartiet_med_G%C3%B6rel_Thurdin.jpg/400px-Valaffisch_f%C3%B6r_Centerpartiet_med_G%C3%B6rel_Thurdin.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Valaffisch_för_Centerpartiet_med_Görel_Thurdin.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'fair_use',
  }),
  createExternalPoster({
    id: 'wm-1991-c-johansson',
    title: 'Centerpartiet 1991 — Centern älskar Sverige. Hela Sverige!',
    year: 1991,
    party: 'Centerpartiet',
    slogan: 'Centern älskar Sverige. Hela Sverige!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Olof_Johansson_-_gamla_valaffischer.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Olof_Johansson_-_gamla_valaffischer.jpg/400px-Olof_Johansson_-_gamla_valaffischer.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Olof_Johansson_-_gamla_valaffischer.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'fair_use',
  }),
  createExternalPoster({
    id: 'wm-1998-c-daleus',
    title: 'Centerpartiet 1998 — Det här är Lennart',
    year: 1998,
    party: 'Centerpartiet',
    slogan: 'Det här är Lennart',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Centerpartiets_valaffisch_1998_med_Lennart_Dal%C3%A9us.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Centerpartiets_valaffisch_1998_med_Lennart_Dal%C3%A9us.jpg/400px-Centerpartiets_valaffisch_1998_med_Lennart_Dal%C3%A9us.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Centerpartiets_valaffisch_1998_med_Lennart_Daléus.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'fair_use',
  }),
  // Stockholmskällan — Högerns valaffischer Stockholm 1931, 1950
  createExternalPoster({
    id: 'sk-1931-h-stadshus',
    title: 'Högern 1931 — vita stjärnor med Stadshusets torn',
    year: 1931,
    party: 'Allmänna valmansförbundet',
    creator: 'Moje Åslund',
    imageUrl: 'https://stockholmskallan.stockholm.se/skblobs/98/98fcf64a-d558-42d8-ac6a-76bb76019e63.jpg',
    source: 'media_archive',
    sourceUrl: 'https://stockholmskallan.stockholm.se/post/24616',
    sourceAttribution: 'Stockholmskällan / Stockholms stad',
    rightsStatus: 'free',
  }),
  createExternalPoster({
    id: 'sk-1950-h-malmskillnad',
    title: 'Högerns valaffisch på Malmskillnadsbron 1950',
    year: 1950,
    party: 'Högerpartiet',
    imageUrl: 'https://stockholmskallan.stockholm.se/skblobs/6c/6cbce4ce-7a60-4791-8534-82dde84e43fb.JPG',
    source: 'media_archive',
    sourceUrl: 'https://stockholmskallan.stockholm.se/post/11708',
    sourceAttribution: 'Stockholmskällan / Stockholms stad',
    rightsStatus: 'free',
    rightsNote: 'Foto från Kungsgatan, Stockholm.',
  }),

  // Wikimedia — flera C-affischer 1970
  createExternalPoster({
    id: 'wm-1970-c-falldin',
    title: 'Centerpartiet 1970 — Thorbjörn Fälldin',
    year: 1970,
    party: 'Centerpartiet',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Thorbj%C3%B6rn_F%C3%A4lldin_1970.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Thorbj%C3%B6rn_F%C3%A4lldin_1970.jpg/400px-Thorbj%C3%B6rn_F%C3%A4lldin_1970.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Thorbj%C3%B6rn_F%C3%A4lldin_1970.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'fair_use',
    rightsNote: 'Fälldin var ännu inte partiledare 1970 men en framträdande gestalt.',
  }),
  createExternalPoster({
    id: 'wm-1970-c-hedlund',
    title: 'Centerpartiet 1970 — Gunnar Hedlund',
    year: 1970,
    party: 'Centerpartiet',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Gunnar_Hedlund_1970.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Gunnar_Hedlund_1970.jpg/400px-Gunnar_Hedlund_1970.jpg',
    source: 'wikimedia',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gunnar_Hedlund_1970.jpg',
    sourceAttribution: 'Wikimedia Commons / Centerpartiet',
    rightsStatus: 'fair_use',
    rightsNote: 'Hedlund var partiledare 1949-1971.',
  }),

];

/**
 * Affischerna.se — utöver befintliga AFFISCHERNA_POSTERS, 1973-1979
 * VPK och SKP-affischer. Direkta uploads/-URL:er extraherade från sidan.
 */
export const AFFISCHERNA_LEFT_POSTERS: Poster[] = [
  createExternalPoster({
    id: 'aff-1973-skp-imperialism',
    title: 'SKP 1973 — Imperialismens klo i Chile',
    year: 1973,
    party: 'SKP',
    slogan: 'Imperialismens klo i Chile',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1973/01/IMG_0357.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/progg_poster/imperialismens-klo-i-chile-2/',
    sourceAttribution: 'Affischerna 1967-1979',
    rightsStatus: 'fair_use',
    rightsNote: 'Postad ca 1973 i samband med USA:s ingripande i Chile.',
  }),
  createExternalPoster({
    id: 'aff-1973-skp-batre',
    title: 'SKP 1973 — Bättre är ofta sämre',
    year: 1973,
    party: 'SKP',
    slogan: 'Bättre är ofta sämre',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1973/09/IMG_0350.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/progg_poster/battre-ar-ofta-samre-2/',
    sourceAttribution: 'Affischerna 1967-1979',
    rightsStatus: 'fair_use',
  }),
  createExternalPoster({
    id: 'aff-1973-skp-arbete',
    title: 'SKP 1973 — Arbete, en mänsklig rättighet',
    year: 1973,
    party: 'SKP',
    slogan: 'Arbete, en mänsklig rättighet',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1973/09/IMG_0351.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/progg_poster/arbete-en-mansklig-rattighet-2/',
    sourceAttribution: 'Affischerna 1967-1979',
    rightsStatus: 'fair_use',
  }),
  createExternalPoster({
    id: 'aff-1979-vpk-egen-kraft',
    title: 'VPK 1979 — Egen kraft är bättre än atomkraft',
    year: 1979,
    party: 'VPK',
    slogan: 'Egen kraft är bättre än atomkraft',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1979/01/MG_5384.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/progg_poster/egen-kraft-ar-battre-an-atomkraft-2/',
    sourceAttribution: 'Affischerna 1967-1979',
    rightsStatus: 'fair_use',
    rightsNote: 'Kärnkraftsfolkomröstningen 1980. VPK var aktiv linje 3 (avveckla).',
  }),
  createExternalPoster({
    id: 'aff-1979-vpk-fred',
    title: 'VPK 1979 — De talar om fred',
    year: 1979,
    party: 'VPK',
    slogan: 'De talar om fred',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1979/01/IMG_0346-1.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/progg_poster/de-talar-om-fred/',
    sourceAttribution: 'Affischerna 1967-1979',
    rightsStatus: 'fair_use',
  }),
  createExternalPoster({
    id: 'aff-1979-vpk-bildmotiv',
    title: 'VPK 1979 — bildmotiv',
    year: 1979,
    party: 'VPK',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1979/01/MG_5993.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
    sourceAttribution: 'Affischerna 1967-1979',
    rightsStatus: 'fair_use',
  }),
  createExternalPoster({
    id: 'aff-1979-vpk-batre',
    title: 'VPK 1979 — Bättre, sämre',
    year: 1979,
    party: 'VPK',
    slogan: 'Bättre, sämre',
    imageUrl: 'https://affischerna.se/wp-content/uploads/1979/01/battresamre01.jpg',
    source: 'affischerna',
    sourceUrl: 'https://affischerna.se/postercategory/valaffischer/',
    sourceAttribution: 'Affischerna 1967-1979',
    rightsStatus: 'fair_use',
  }),
];

/**
 * Miljöpartiet officiella Flickr-arkiv 2014
 */
export const MILJOPARTIET_POSTERS: Poster[] = [
  createExternalPoster({
    id: 'mp-2014-flickr',
    title: 'Miljöpartiet 2014 — Politiken måste bli varmare. Inte klimatet.',
    year: 2014,
    party: 'Miljöpartiet',
    slogan: 'Politiken måste bli varmare. Inte klimatet.',
    imageUrl: 'https://live.staticflickr.com/3843/14863536926_ff0c770354.jpg',
    source: 'media_archive',
    sourceUrl: 'https://www.flickr.com/photos/miljopartiet/sets/72157645948460750/',
    sourceAttribution: 'Miljöpartiet de gröna (officiell Flickr)',
    rightsStatus: 'free',
    rightsNote: 'Officiell partikampanj 2014, frisläppt på Flickr.',
  }),
];

/**
 * Liberalerna / Folkpartiet — riksdagsval 1948-2022
 *
 * FP = Folkpartiet (1934-2015), L = Liberalerna (2015-)
 * Bertil Ohlin var partiledare 1944-1967, rekordval 1952 (24,4%)
 */
export const LIBERALERNA_POSTERS: Poster[] = [
  createExternalPoster({
    id: 'fp-1948-ohlin',
    title: 'Folkpartiet 1948 — Bertil Ohlin för frihet och framsteg',
    year: 1948,
    party: 'Liberalerna',
    slogan: 'Frihet och framsteg',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1948',
    sourceAttribution: 'Folkpartiet',
    rightsStatus: 'unknown',
    rightsNote: 'Bertil Ohlins första val som partiledare. FP fick 22,8%.',
  }),
  createExternalPoster({
    id: 'fp-1976-ullsten',
    title: 'Folkpartiet 1976 — Per Ahlmark/Ola Ullsten',
    year: 1976,
    party: 'Liberalerna',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1976',
    sourceAttribution: 'Folkpartiet',
    rightsStatus: 'unknown',
    rightsNote: 'Borgerlig valseger efter 44 år av S-styre.',
  }),
  createExternalPoster({
    id: 'fp-1985-westerberg',
    title: 'Folkpartiet 1985 — Bengt Westerberg',
    year: 1985,
    party: 'Liberalerna',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1985',
    sourceAttribution: 'Folkpartiet',
    rightsStatus: 'unknown',
    rightsNote: 'Westerberg blev partiledare 1983. Resultat: 14,2%.',
  }),
  createExternalPoster({
    id: 'fp-1991',
    title: 'Folkpartiet 1991 — EU-ansökan',
    year: 1991,
    party: 'Liberalerna',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_1991',
    sourceAttribution: 'Folkpartiet',
    rightsStatus: 'unknown',
    rightsNote: 'Resultat: 9,1%. EU-frågan på agendan.',
  }),
  createExternalPoster({
    id: 'fp-2002',
    title: 'Folkpartiet 2002 — Språktester och skola',
    year: 2002,
    party: 'Liberalerna',
    slogan: 'Språktester',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2002',
    sourceAttribution: 'Folkpartiet',
    rightsStatus: 'unknown',
    rightsNote: 'Leijonborgs genombrott med språktestfrågan. Resultat: 13,4%.',
  }),
  createExternalPoster({
    id: 'fp-2010',
    title: 'Folkpartiet 2010 — Jan Björklund',
    year: 2010,
    party: 'Liberalerna',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2010',
    sourceAttribution: 'Folkpartiet',
    rightsStatus: 'unknown',
    rightsNote: 'Björklund partiledare. Alliansen vann igen.',
  }),
  createExternalPoster({
    id: 'l-2018',
    title: 'Liberalerna 2018 — Jan Björklund',
    year: 2018,
    party: 'Liberalerna',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2018',
    sourceAttribution: 'Liberalerna',
    rightsStatus: 'unknown',
    rightsNote: 'Resultat: 5,5%. Januariavtalet följde.',
  }),
  createExternalPoster({
    id: 'l-2022',
    title: 'Liberalerna 2022 — Johan Pehrson',
    year: 2022,
    party: 'Liberalerna',
    imageUrl: '',
    source: 'media_archive',
    sourceUrl: 'https://sv.wikipedia.org/wiki/Riksdagsvalet_i_Sverige_2022',
    sourceAttribution: 'Liberalerna',
    rightsStatus: 'unknown',
    rightsNote: 'Resultat: 4,6%. Pehrson tog över under valåret.',
  }),
];

/**
 * DigitaltMuseum — kompletterande material 1948-1976
 */
export const DIGITALTMUSEUM_POSTERS: Poster[] = [
  createExternalPoster({
    id: 'dm-1960-s-folkpartiet',
    title: 'Socialdemokraterna 1960 — Där folkpartiet får sig en känga',
    year: 1960,
    party: 'Socialdemokraterna',
    imageUrl: 'https://ems.dimu.org/image/0331xUEG5xC9',
    source: 'media_archive',
    sourceUrl: 'https://digitaltmuseum.se/021017974544/socialdemokratisk-valaffisch-1960-dar-folkpartiet-far-sig-en-kanga-esplanade',
    sourceAttribution: 'DigitaltMuseum / Sundsvalls museum',
    rightsStatus: 'fair_use',
  }),
  createExternalPoster({
    id: 'dm-1976-s-orebro',
    title: 'Socialdemokraterna 1976 — valaffischer 21 augusti',
    year: 1976,
    party: 'Socialdemokraterna',
    imageUrl: 'https://ems.dimu.org/image/032wYWAAA1bf',
    source: 'media_archive',
    sourceUrl: 'https://digitaltmuseum.se/021016185672/valaffischer-21-augusti-1976-socialdemokraterna',
    sourceAttribution: 'DigitaltMuseum / Örebro länsmuseum',
    rightsStatus: 'fair_use',
  }),
];

/**
 * Get all external posters
 */
export function getAllExternalPosters(): Poster[] {
  return [
    ...AFFISCHERNA_POSTERS,
    ...AFFISCHERNA_LEFT_POSTERS,
    ...SD_POSTERS,
    ...MODERATERNA_POSTERS,
    ...LIBERALERNA_POSTERS,
    ...WIKIMEDIA_POSTERS,
    ...DIGITALTMUSEUM_POSTERS,
    ...MILJOPARTIET_POSTERS,
  ].filter(p => p.thumbnailUrl || p.imageUrl);
  // Filtrerar bort poster utan bild så de inte syns i griden,
  // men de ligger kvar i datan för senare berikning.
}

/**
 * Get all external posters including those without images (for catalog/research views)
 */
export function getAllExternalPostersIncludingMissingImages(): Poster[] {
  return [
    ...AFFISCHERNA_POSTERS,
    ...AFFISCHERNA_LEFT_POSTERS,
    ...SD_POSTERS,
    ...MODERATERNA_POSTERS,
    ...LIBERALERNA_POSTERS,
    ...WIKIMEDIA_POSTERS,
    ...DIGITALTMUSEUM_POSTERS,
    ...MILJOPARTIET_POSTERS,
  ];
}

/**
 * Get external posters by source
 */
export function getExternalPostersBySource(source: PosterSource): Poster[] {
  return getAllExternalPosters().filter(p => p.source === source);
}

/**
 * Get external posters by year
 */
export function getExternalPostersByYear(year: number): Poster[] {
  return getAllExternalPosters().filter(p => p.year === year);
}
