import { useEffect, useMemo, useRef, useState } from 'react';
import { usePreload360 } from '@/hooks/usePreload360';

type Variant = 'black' | 'kaki';

type Props = {
  variant: Variant;
  className?: string;
};

const AUTO_ROTATE_MS = 120; // 120ms × 36 ≈ 4.3s per 360° (rustig, premium)
const DRAG_PIXELS_PER_FRAME = 6;

// /360-web/ bevat beide varianten in één map:
//   frames 001–036 = zwarte cap (volledige 360°)
//   frames 037–072 = kaki cap   (volledige 360°; 073–144 herhaalt dezelfde rotatie)
const framesInRange = (start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) => {
    const n = String(start + i).padStart(3, '0');
    return `/360-web/frame_${n}.jpg`;
  });

const FRAME_SETS: Record<Variant, string[]> = {
  black: framesInRange(1, 36),
  kaki: framesInRange(37, 72),
};

const VARIANT_LABEL: Record<Variant, string> = {
  black: 'zwart',
  kaki: 'beige',
};

export function CapViewer360({ variant, className = '' }: Props) {
  return <Rotator variant={variant} className={className} />;
}

function Rotator({ variant, className = '' }: Props) {
  const frames = useMemo(() => FRAME_SETS[variant], [variant]);
  const total = frames.length;
  const { ready, loaded } = usePreload360(frames);
  const [index, setIndex] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Terug naar het eerste frame zodra je van variant wisselt.
  useEffect(() => {
    setIndex(0);
  }, [variant]);

  // Auto-rotate
  useEffect(() => {
    if (!ready || isDragging || reducedMotion) return;

    const tick = (t: number) => {
      if (!lastTickRef.current) lastTickRef.current = t;
      if (t - lastTickRef.current >= AUTO_ROTATE_MS) {
        setIndex((i) => (i + 1) % total);
        lastTickRef.current = t;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
    };
  }, [ready, isDragging, reducedMotion, total]);

  // Pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartIndex.current = index;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    const frameDelta = Math.round(delta / DRAG_PIXELS_PER_FRAME);
    const next = ((dragStartIndex.current - frameDelta) % total + total) % total;
    setIndex(next);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab' }}
      aria-label={`360 graden viewer — Ludack cap ${VARIANT_LABEL[variant]}, sleep om te draaien`}
      role="img"
    >
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-sand-soft/40">
          <div className="flex flex-col items-center gap-3">
            <div className="h-px w-32 overflow-hidden bg-ink/10">
              <div
                className="h-full bg-ink transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="eyebrow text-ink/60">Laden {progress}%</span>
          </div>
        </div>
      )}

      <img
        src={frames[index]}
        alt={`Ludack cap ${VARIANT_LABEL[variant]} — frame ${index + 1}`}
        className={`block h-full w-full object-contain transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
        draggable={false}
      />

      {ready && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-widest2 text-bone backdrop-blur-md">
          <RotateIcon />
          Sleep om te draaien
        </div>
      )}
    </div>
  );
}

function RotateIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}

/* ---------- helper ---------- */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
