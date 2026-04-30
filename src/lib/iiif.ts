import type { IIIFImageInfo } from './types';

/**
 * IIIF Image API helpers for KB's image service
 * Base URL: https://data.kb.se/iiif/3
 */

/**
 * Fetch IIIF Image info.json for an image service
 */
export async function getImageInfo(imageServiceId: string): Promise<IIIFImageInfo | null> {
  try {
    const response = await fetch(`${imageServiceId}/info.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    console.error('Failed to fetch IIIF info:', imageServiceId);
    return null;
  }
}

/**
 * Build IIIF Image URL with specified parameters
 *
 * @param imageServiceId - Base IIIF Image Service URL
 * @param options - Image request options
 * @returns Full IIIF Image URL
 *
 * @example
 * // Get 800px wide thumbnail
 * buildImageUrl(serviceId, { width: 800 })
 *
 * // Get specific region at full size
 * buildImageUrl(serviceId, { region: '0,0,512,512' })
 */
export function buildImageUrl(
  imageServiceId: string,
  options: {
    region?: string;
    width?: number;
    height?: number;
    size?: 'max' | 'full' | string;
    rotation?: number;
    quality?: 'default' | 'color' | 'gray' | 'bitonal';
    format?: 'jpg' | 'png' | 'webp' | 'tif';
  } = {}
): string {
  const {
    region = 'full',
    width,
    height,
    size,
    rotation = 0,
    quality = 'default',
    format = 'jpg',
  } = options;

  // Determine size parameter
  let sizeParam: string;
  if (size) {
    sizeParam = size;
  } else if (width && height) {
    sizeParam = `${width},${height}`;
  } else if (width) {
    sizeParam = `${width},`;
  } else if (height) {
    sizeParam = `,${height}`;
  } else {
    sizeParam = 'max';
  }

  return `${imageServiceId}/${region}/${sizeParam}/${rotation}/${quality}.${format}`;
}

/**
 * Build thumbnail URL (200px wide)
 */
export function getThumbnailUrl(imageServiceId: string): string {
  return buildImageUrl(imageServiceId, { width: 200 });
}

/**
 * Build medium size URL (800px wide)
 */
export function getMediumUrl(imageServiceId: string): string {
  return buildImageUrl(imageServiceId, { width: 800 });
}

/**
 * Build large size URL (1600px wide)
 */
export function getLargeUrl(imageServiceId: string): string {
  return buildImageUrl(imageServiceId, { width: 1600 });
}

/**
 * Build max size URL (limited by server to 3150px)
 */
export function getMaxUrl(imageServiceId: string): string {
  return buildImageUrl(imageServiceId, { size: 'max' });
}

/**
 * Build WebP version of image
 */
export function getWebpUrl(imageServiceId: string, width: number = 800): string {
  return buildImageUrl(imageServiceId, { width, format: 'webp' });
}

/**
 * Create OpenSeadragon tile source configuration from IIIF Image Service
 */
export function createTileSource(imageServiceId: string): {
  '@context': string;
  '@id': string;
  protocol: string;
  profile: string;
} {
  return {
    '@context': 'http://iiif.io/api/image/3/context.json',
    '@id': imageServiceId,
    protocol: 'http://iiif.io/api/image',
    profile: 'level2',
  };
}

/**
 * Extract dark-ID from KB URL
 * @example
 * extractDarkId('https://data.kb.se/dark-28045330') // 'dark-28045330'
 * extractDarkId('https://digitalt.kb.se/dark-28045330/part/1/page/1') // 'dark-28045330'
 */
export function extractDarkId(url: string): string | null {
  const match = url.match(/dark-\d+/);
  return match ? match[0] : null;
}

/**
 * Build KB Digitalt URL for a poster
 */
export function buildKbDigitaltUrl(darkId: string): string {
  return `https://digitalt.kb.se/${darkId}/part/1/page/1`;
}

/**
 * Build data.kb.se URL for a poster
 */
export function buildDataKbUrl(darkId: string): string {
  return `https://data.kb.se/${darkId}`;
}
