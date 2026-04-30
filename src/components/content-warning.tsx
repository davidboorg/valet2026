'use client';

import { useState, useCallback } from 'react';

interface ContentWarningProps {
  warning: string;
  contextText?: string;
  onDismiss?: () => void;
  children: React.ReactNode;
}

/**
 * ContentWarning component
 *
 * Displays a warning overlay for sensitive historical content.
 * Used for posters that contain:
 * - Hateful propaganda
 * - Racist stereotypes
 * - Violence or threatening imagery
 * - Other content that requires historical context
 *
 * The overlay must be dismissed before viewing the content.
 */
export function ContentWarning({
  warning,
  contextText,
  onDismiss,
  children,
}: ContentWarningProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  if (dismissed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content behind */}
      <div className="blur-xl opacity-30 pointer-events-none" aria-hidden="true">
        {children}
      </div>

      {/* Warning overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="max-w-lg mx-auto p-8 text-center">
          {/* Warning icon */}
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-[var(--status-warning)]/10 mb-6">
            <svg
              className="w-6 h-6 text-[var(--status-warning)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Warning title */}
          <h3 className="font-[var(--font-playfair)] text-xl font-bold text-[var(--text-primary)] mb-2">
            Historiskt känsligt innehåll
          </h3>

          {/* Warning text */}
          <p className="text-[var(--text-secondary)] mb-4">{warning}</p>

          {/* Context text if provided */}
          {contextText && (
            <div className="p-4 bg-[var(--bg-secondary)] text-left mb-6">
              <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Historisk kontext
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{contextText}</p>
            </div>
          )}

          {/* Educational note */}
          <p className="text-xs text-[var(--text-secondary)] mb-6">
            Detta material visas i utbildnings- och forskningssyfte för att
            dokumentera historien.
          </p>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="px-6 py-3 bg-[var(--bg-dark)] text-[var(--text-inverse)] text-sm font-medium hover:bg-[var(--text-primary)] transition-colors"
          >
            Jag förstår, visa innehållet
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline content warning badge
 * Used to indicate that a poster has sensitive content
 */
export function ContentWarningBadge({ warning }: { warning: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--status-warning)]/10 text-[var(--status-warning)] text-xs rounded">
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01"
        />
      </svg>
      <span>{warning}</span>
    </div>
  );
}

/**
 * Content warning banner for exhibition/collection pages
 */
export function ContentWarningBanner({
  title = 'Denna samling innehåller känsligt material',
  description = 'Vissa affischer i denna samling kan innehålla hatpropaganda, stereotyper eller annat stötande material som speglar sin tids fördomar.',
}: {
  title?: string;
  description?: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="bg-[var(--status-warning)]/5 border-l-4 border-[var(--status-warning)] p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-[var(--status-warning)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h4>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Stäng"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
