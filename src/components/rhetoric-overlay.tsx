'use client';

import type { Poster } from '@/lib/types';

// Re-export the shared enrichment function for backward compatibility
export { enrichWithSampleRhetoric } from '@/lib/rhetoric-utils';

// Tone configurations with colors and labels
export const TONE_CONFIG: Record<string, { label: string; color: string }> = {
  hoppfull: { label: 'Hoppfull', color: '#3D7A5F' },
  hotande: { label: 'Hotande', color: '#B8860B' },
  saklig: { label: 'Saklig', color: '#6B7280' },
  nostalgisk: { label: 'Nostalgisk', color: '#7C6955' },
  upprorisk: { label: 'Upprorisk', color: '#E8112D' },
  lugn: { label: 'Lugn', color: '#52BDEC' },
};

// Common rhetorical devices with explanations
export const RHETORICAL_DEVICES: Record<string, { label: string; description: string }> = {
  alliteration: { label: 'Alliteration', description: 'Upprepning av begynnelseljud' },
  anafor: { label: 'Anafor', description: 'Upprepning i början av satser' },
  antites: { label: 'Antites', description: 'Kontrasterande påståenden' },
  hyperbol: { label: 'Hyperbol', description: 'Överdrift för effekt' },
  metafor: { label: 'Metafor', description: 'Bildlig jämförelse' },
  retorisk_fraga: { label: 'Retorisk fråga', description: 'Fråga utan förväntat svar' },
  upprepning: { label: 'Upprepning', description: 'Samma ord eller fras upprepas' },
  patos: { label: 'Patos', description: 'Appell till känslor' },
  etos: { label: 'Etos', description: 'Trovärdighetsargument' },
  logos: { label: 'Logos', description: 'Logisk argumentation' },
};

interface ToneBadgeProps {
  tone: string;
  size?: 'small' | 'medium';
}

// Small tone indicator badge for use on poster cards
export function ToneBadge({ tone, size = 'small' }: ToneBadgeProps) {
  const config = TONE_CONFIG[tone];
  if (!config) return null;

  const sizeClasses = size === 'small'
    ? 'px-2 py-1 text-xs'
    : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center font-medium text-white rounded-sm shadow-sm ${sizeClasses}`}
      style={{ backgroundColor: config.color }}
    >
      {config.label}
    </span>
  );
}

interface RhetoricOverlayProps {
  poster: Poster;
  visible: boolean;
}

// Full overlay - now only used on detail pages, not in grid
export function RhetoricOverlay({ poster, visible }: RhetoricOverlayProps) {
  if (!visible) return null;

  const tone = poster.tone;
  const devices = poster.rhetoricalDevices || [];
  const themes = poster.themes || [];

  const hasData = tone || devices.length > 0 || themes.length > 0;

  return (
    <div className="absolute inset-0 z-30 bg-[var(--bg-dark)]/90 backdrop-blur-sm flex flex-col justify-end p-3">
      {hasData ? (
        <div className="space-y-2">
          {tone && TONE_CONFIG[tone] && (
            <ToneBadge tone={tone} size="medium" />
          )}

          {devices.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {devices.slice(0, 3).map(device => (
                <span
                  key={device}
                  className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-sm"
                  title={RHETORICAL_DEVICES[device]?.description}
                >
                  {RHETORICAL_DEVICES[device]?.label || device}
                </span>
              ))}
            </div>
          )}

          {themes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {themes.slice(0, 2).map(theme => (
                <span
                  key={theme}
                  className="px-2 py-0.5 bg-[var(--accent)]/80 text-white text-xs rounded-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-white/60 text-xs">
            Ingen retorikanalys
          </p>
        </div>
      )}
    </div>
  );
}

interface RhetoricLegendProps {
  className?: string;
}

// Compact, inline legend
export function RhetoricLegend({ className = '' }: RhetoricLegendProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border)] ${className}`}>
      <span className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">
        Tonläge:
      </span>
      {Object.entries(TONE_CONFIG).map(([key, config]) => (
        <span
          key={key}
          className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-white rounded-sm"
          style={{ backgroundColor: config.color }}
        >
          {config.label}
        </span>
      ))}
    </div>
  );
}
