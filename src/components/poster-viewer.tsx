'use client';

import { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';

interface PosterViewerProps {
  imageServiceId: string;
  title: string;
  className?: string;
}

export function PosterViewer({ imageServiceId, title, className = '' }: PosterViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdRef = useRef<OpenSeadragon.Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!viewerRef.current || !imageServiceId) return;

    // Clean up previous viewer
    if (osdRef.current) {
      osdRef.current.destroy();
    }

    // Synkronisering med imperativ extern lib (OpenSeadragon) — detta är ett
    // av de få legitima fall där setState direkt i effect är OK enligt React-doc
    // (https://react.dev/reference/react/useEffect#fetching-data).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);

    try {
      osdRef.current = OpenSeadragon({
        element: viewerRef.current,
        tileSources: `${imageServiceId}/info.json`,
        prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
        // Accessibility
        gestureSettingsMouse: {
          scrollToZoom: true,
        },
        gestureSettingsTouch: {
          pinchToZoom: true,
        },
        // UI options
        showNavigator: true,
        navigatorPosition: 'BOTTOM_RIGHT',
        navigatorSizeRatio: 0.15,
        showFullPageControl: true,
        showHomeControl: true,
        showZoomControl: true,
        // Performance
        immediateRender: false,
        maxZoomPixelRatio: 2,
        minZoomImageRatio: 0.8,
        visibilityRatio: 0.5,
        constrainDuringPan: true,
        // Animation
        animationTime: 0.5,
        springStiffness: 10,
      });

      osdRef.current.addHandler('open', () => {
        setIsLoading(false);
      });

      osdRef.current.addHandler('open-failed', () => {
        setIsLoading(false);
        setError('Kunde inte ladda bilden');
      });
    } catch {
      setError('Fel vid initiering av bildvisaren');
      setIsLoading(false);
    }

    return () => {
      if (osdRef.current) {
        osdRef.current.destroy();
        osdRef.current = null;
      }
    };
  }, [imageServiceId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!osdRef.current) return;

      const viewport = osdRef.current.viewport;
      const zoomFactor = 1.2;
      const panFactor = 0.1;

      switch (e.key) {
        case '+':
        case '=':
          viewport.zoomBy(zoomFactor);
          break;
        case '-':
          viewport.zoomBy(1 / zoomFactor);
          break;
        case 'ArrowUp':
          viewport.panBy(new OpenSeadragon.Point(0, -panFactor));
          break;
        case 'ArrowDown':
          viewport.panBy(new OpenSeadragon.Point(0, panFactor));
          break;
        case 'ArrowLeft':
          viewport.panBy(new OpenSeadragon.Point(-panFactor, 0));
          break;
        case 'ArrowRight':
          viewport.panBy(new OpenSeadragon.Point(panFactor, 0));
          break;
        case 'Home':
        case '0':
          viewport.goHome();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Screen reader description */}
      <div className="sr-only" role="img" aria-label={title}>
        Affisch: {title}. Använd tangentbord för navigation: plus/minus för zoom, piltangenter för panorering, Home för återställning.
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100 rounded-full animate-spin" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Laddar bild...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 z-10">
          <div className="text-center p-4">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <a
              href={`https://digitalt.kb.se/${imageServiceId.split('/').find(s => s.startsWith('dark-'))}/part/1/page/1`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 underline"
            >
              Visa på KB Digitalt
            </a>
          </div>
        </div>
      )}

      {/* OpenSeadragon container */}
      <div
        ref={viewerRef}
        className="w-full h-full bg-neutral-100 dark:bg-neutral-900"
        style={{ minHeight: '400px' }}
        tabIndex={0}
        aria-label={`Zoombar bild av affischen: ${title}`}
      />

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-60 hover:opacity-100 transition-opacity">
        Scrolla för zoom · Dra för panorering · F för fullskärm
      </div>
    </div>
  );
}
