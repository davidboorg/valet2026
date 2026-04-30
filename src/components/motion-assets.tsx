/**
 * Motion-assets för Valaffischen
 *
 * Tre rörliga element i dataland-stil — ren CSS-animation, ingen JS-runtime.
 * Använder bara svart-vit-paletten via currentColor + var(--bg-primary).
 *
 * 01 Plakat — affisch på käpp som driver lätt. Logotypens andas. För hero/intro.
 * 02 Arkiv — fyra sheets cyklar i z-ordning. För arkiv-/källmaterial-sektioner.
 * 03 Datapunkter — scanning-beam + pulserande prickar. För AI-analys-sektioner.
 */
import type { CSSProperties } from 'react';

interface AssetProps {
  className?: string;
  /** Visa nummer + label i hörnet (dataland-stil) */
  showLabel?: boolean;
  /** Custom label-text (default: "Plakat" / "Arkiv" / "Datapunkter") */
  label?: string;
  /** Nummer som syns i hörnet (default: "01" / "02" / "03") */
  index?: string;
}

/* ============================================================
 * 01 — PLAKAT
 * ============================================================ */
export function MotionPlakat({ className = '', showLabel = false, label = 'Plakat', index = '01' }: AssetProps) {
  return (
    <article
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: '1 / 1.18',
        background: `
          linear-gradient(rgba(9,9,9,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(9,9,9,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      } as CSSProperties}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid place-items-center">
        <div className="motion-placard" />
      </div>
      {showLabel && (
        <div className="absolute left-4 right-4 bottom-3 flex justify-between gap-4 meta text-[10px]">
          <span>{index}</span>
          <span>{label}</span>
        </div>
      )}
      <style>{`
        .motion-placard {
          width: 42%; height: 50%;
          background: currentColor;
          transform-origin: 50% 112%;
          animation: placardDrift 7.5s ease-in-out infinite;
          position: relative;
        }
        .motion-placard::before {
          content: ""; position: absolute;
          left: 50%; top: 100%;
          width: 4px; height: 38%;
          background: currentColor;
          transform: translateX(-50%);
        }
        .motion-placard::after {
          content: ""; position: absolute;
          right: 0; bottom: 0;
          width: 24%; aspect-ratio: 1;
          background: var(--bg-primary);
          clip-path: polygon(100% 0, 0 100%, 100% 100%);
          border-left: 1px solid currentColor;
          border-top: 1px solid currentColor;
          animation: foldPulse 3.5s ease-in-out infinite;
        }
        @keyframes placardDrift {
          0%, 100% { transform: rotate(-1deg) translateY(0); }
          50%      { transform: rotate(1.7deg) translateY(-10px); }
        }
        @keyframes foldPulse {
          0%, 100% { opacity: 1; transform: translate(0, 0); }
          50%      { opacity: .72; transform: translate(-2px, -2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-placard, .motion-placard::after { animation: none; }
        }
      `}</style>
    </article>
  );
}

/* ============================================================
 * 02 — ARKIV (Sheet stack)
 * ============================================================ */
export function MotionArkiv({ className = '', showLabel = false, label = 'Arkiv', index = '02' }: AssetProps) {
  return (
    <article
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: '1 / 1.18',
        background: `
          linear-gradient(rgba(9,9,9,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(9,9,9,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      } as CSSProperties}
      aria-hidden="true"
    >
      <div className="absolute inset-[20%] grid place-items-center">
        <div className="motion-sheet" />
        <div className="motion-sheet motion-sheet-2" />
        <div className="motion-sheet motion-sheet-3" />
        <div className="motion-sheet motion-sheet-4" />
      </div>
      {showLabel && (
        <div className="absolute left-4 right-4 bottom-3 flex justify-between gap-4 meta text-[10px]">
          <span>{index}</span>
          <span>{label}</span>
        </div>
      )}
      <style>{`
        .motion-sheet {
          position: absolute;
          width: 58%; height: 76%;
          border: 2px solid currentColor;
          background: var(--bg-primary);
          animation: sheetCycle 8s cubic-bezier(.76,0,.24,1) infinite;
        }
        .motion-sheet-2 { animation-delay: -2s; }
        .motion-sheet-3 { animation-delay: -4s; }
        .motion-sheet-4 { animation-delay: -6s; }
        .motion-sheet::before,
        .motion-sheet::after {
          content: ""; position: absolute;
          left: 12%; right: 12%; height: 2px;
          background: currentColor; opacity: .9;
        }
        .motion-sheet::before { top: 18%; }
        .motion-sheet::after  { top: 28%; width: 52%; right: auto; }
        @keyframes sheetCycle {
          0%   { transform: translate(0, 0) scale(1);     opacity: 1;   z-index: 4; }
          22%  { transform: translate(10px, -12px) scale(.96); opacity: .82; }
          50%  { transform: translate(-18px, 18px) scale(.9); opacity: .44; }
          78%  { transform: translate(0, 34px) scale(.84); opacity: 0; }
          100% { transform: translate(0, 0) scale(1);     opacity: 1;   z-index: 4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-sheet { animation: none; }
        }
      `}</style>
    </article>
  );
}

/* ============================================================
 * 03 — DATAPUNKTER (Scanning beam + pulserande prickar)
 * ============================================================ */
export function MotionDatapunkter({ className = '', showLabel = false, label = 'Datapunkter', index = '03' }: AssetProps) {
  return (
    <article
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: '1 / 1.18',
        background: `
          linear-gradient(rgba(9,9,9,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(9,9,9,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      } as CSSProperties}
      aria-hidden="true"
    >
      <div className="absolute inset-0">
        <div className="motion-scan-frame" />
        <div className="motion-beam" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`motion-dot motion-dot-${i + 1}`} />
        ))}
      </div>
      {showLabel && (
        <div className="absolute left-4 right-4 bottom-3 flex justify-between gap-4 meta text-[10px]">
          <span>{index}</span>
          <span>{label}</span>
        </div>
      )}
      <style>{`
        .motion-scan-frame {
          position: absolute; inset: 14%;
          border: 1px solid currentColor;
        }
        .motion-beam {
          position: absolute;
          left: 14%; right: 14%; top: 20%; height: 2px;
          background: currentColor;
          animation: scanBeam 5s ease-in-out infinite;
        }
        @keyframes scanBeam {
          0%, 100% { transform: translateY(0);    opacity: .2; }
          50%      { transform: translateY(60vh); opacity: 1; }
        }
        .motion-dot {
          position: absolute;
          width: 5px; height: 5px;
          background: currentColor; border-radius: 50%;
          opacity: .2;
          animation: dotSignal 4s ease-in-out infinite;
        }
        .motion-dot-1 { left: 25%; top: 32%; animation-delay: -.2s; }
        .motion-dot-2 { left: 62%; top: 28%; animation-delay: -.9s; }
        .motion-dot-3 { left: 47%; top: 48%; animation-delay: -1.4s; }
        .motion-dot-4 { left: 72%; top: 63%; animation-delay: -2.1s; }
        .motion-dot-5 { left: 31%; top: 70%; animation-delay: -2.8s; }
        .motion-dot-6 { left: 55%; top: 76%; animation-delay: -3.2s; }
        @keyframes dotSignal {
          0%, 100% { transform: scale(.6);  opacity: .16; }
          50%      { transform: scale(2.2); opacity: .85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-beam, .motion-dot { animation: none; }
        }
      `}</style>
    </article>
  );
}

/* ============================================================
 * Helper: alla tre asset-rad i en (för intro-/manifestsidor)
 * ============================================================ */
export function MotionAssetsRow({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 ${className}`}>
      <MotionPlakat showLabel />
      <MotionArkiv showLabel />
      <MotionDatapunkter showLabel />
    </div>
  );
}
