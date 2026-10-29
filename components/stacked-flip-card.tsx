'use client';

import { useEffect, useRef, useState } from 'react';

interface StackedFlipCardProps {
  currentDigit: string;
  nextDigit: string;
  shouldFlip: boolean;
  onFlipComplete?: () => void;
}

export function StackedFlipCard({
  currentDigit,
  nextDigit,
  shouldFlip,
  onFlipComplete,
}: StackedFlipCardProps) {
  const flapRef = useRef<HTMLDivElement>(null);
  const topStaticRef = useRef<HTMLDivElement>(null);
  const botStaticRef = useRef<HTMLDivElement>(null);
  const frontDigitRef = useRef<HTMLDivElement>(null);
  const backDigitRef = useRef<HTMLDivElement>(null);

  const busyRef = useRef(false);
  const pendingRef = useRef<{ current: string; next: string } | null>(null);
  const [displayDigit, setDisplayDigit] = useState(currentDigit);

  const runFlip = (from: string, to: string) => {
    const flap = flapRef.current;
    const topStatic = topStaticRef.current;
    const botStatic = botStaticRef.current;
    const frontDigit = frontDigitRef.current;
    const backDigit = backDigitRef.current;
    if (!flap || !topStatic || !botStatic || !frontDigit || !backDigit) return;

    busyRef.current = true;

    // Set initial state — both halves show "from", flap front shows "from", back shows "to"
    frontDigit.textContent = from;
    backDigit.textContent = to;
    topStatic.textContent = from;
    botStatic.textContent = from;

    // Snap flap to 0 with no transition
    flap.style.transition = 'none';
    flap.style.transform = 'rotateX(0deg)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Reveal next digit's top half under the flap before it starts moving
        topStatic.textContent = to;

        // Phase 1 — flap folds forward 0→90deg (front face folds away)
        flap.style.transition = 'transform 0.3s cubic-bezier(0.55, 0, 0.45, 1)';
        flap.style.transform = 'rotateX(90deg)';

        // Swap bottom static at the exact midpoint so it's never visible during transition
        const midTimer = setTimeout(() => {
          botStatic.textContent = to;

          // Phase 2 — back face unfolds 90→180deg (back face = bottom half of next digit)
          flap.style.transition = 'transform 0.3s cubic-bezier(0.55, 0, 0.45, 1)';
          flap.style.transform = 'rotateX(180deg)';

          const endTimer = setTimeout(() => {
            // Snap back invisibly
            flap.style.transition = 'none';
            flap.style.transform = 'rotateX(0deg)';

            // Sync flap faces for next cycle
            frontDigit.textContent = to;
            backDigit.textContent = to;

            setDisplayDigit(to);
            busyRef.current = false;
            onFlipComplete?.();

            // If a flip was queued while we were busy, run it now
            if (pendingRef.current) {
              const p = pendingRef.current;
              pendingRef.current = null;
              runFlip(p.current, p.next);
            }
          }, 300);

          return () => clearTimeout(endTimer);
        }, 300);

        return () => clearTimeout(midTimer);
      });
    });
  };

  useEffect(() => {
    if (!shouldFlip) return;
    if (currentDigit === nextDigit) return;

    if (busyRef.current) {
      // Queue the latest value; overwrite any already-queued one
      pendingRef.current = { current: currentDigit, next: nextDigit };
      return;
    }

    runFlip(currentDigit, nextDigit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFlip, currentDigit, nextDigit]);

  // Shared text positioning helpers
  const topHalfText = "absolute inset-x-0 top-0 h-[200%] flex items-center justify-center font-bold text-white text-lg md:text-3xl";
  const botHalfText = "absolute inset-x-0 h-[200%] flex items-center justify-center font-bold text-white text-lg md:text-3xl";

  return (
    // perspective must be on the PARENT of the element that transforms
    <div
      className="relative w-8 h-12 md:w-16 md:h-20"
      style={{ perspective: '300px', perspectiveOrigin: 'center center' }}
    >
      {/*   Top static half   */}
      <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-lg bg-gradient-to-br from-brand-600 to-brand-700">
        <div ref={topStaticRef} className={topHalfText}>
          {displayDigit}
        </div>
      </div>

      {/*  Bottom static half  */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden rounded-b-lg bg-gradient-to-br from-[#1d701f] to-[#245323]">
        <div
          ref={botStaticRef}
          className={botHalfText}
          style={{ top: '-100%' }}
        >
          {displayDigit}
        </div>
      </div>

      {/* ── Flap (top half, rotates forward along bottom edge) ──── */}
      {/*
        Wrap in a clip container so border-radius is preserved during the 3D
        rotation. The clip wrapper is NOT transformed; only the inner div rotates.
        overflow-hidden on the clip wrapper clips the rounded corners.
      */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-lg z-10"
        style={{ transformStyle: 'flat' }}   // clip wrapper — no 3d
      >
        <div
          ref={flapRef}
          className="absolute inset-0"
          style={{
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg)',
          }}
        >
          {/* Front face — top half of current digit */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#228b22] to-[#1d701f]"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div ref={frontDigitRef} className={topHalfText}>
              {displayDigit}
            </div>
          </div>

          {/* Back face — bottom half of NEXT digit */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#1d701f] to-[#245323]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <div
              ref={backDigitRef}
              className={botHalfText}
              style={{ top: '-100%' }}
            >
              {nextDigit}
            </div>
          </div>
        </div>
      </div>

      {/* Center crease */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-black/25 z-20 -translate-y-px pointer-events-none" />
    </div>
  );
}