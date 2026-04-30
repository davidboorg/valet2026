'use client';

import type { Poster } from '@/lib/types';
import { ToneSpectrum } from '@/components/tone-spectrum';

interface TonlageClientProps {
  posters: Poster[];
}

export function TonlageClient({ posters }: TonlageClientProps) {
  return <ToneSpectrum posters={posters} />;
}
