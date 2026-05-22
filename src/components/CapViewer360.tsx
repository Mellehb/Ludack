import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePreload360 } from '@/hooks/usePreload360';

type Variant = 'black' | 'kaki';

type Props = {
  variant: Variant;
  className?: string;
};

const TOTAL_FRAMES = 144;
const AUTO_ROTATE_MS = 70; // 70ms × 144 ≈ 10s per 360° (snappy maar premium)
const DRAG_PIXELS_PER_FRAME = 6;

const blackFrames = (): string[] =>
  Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    const n = String(i + 1).padStart(3, '0');
    return `/360-web/frame_${n}.jpg`;
  });

// Kaki: nog geen 360°-sequentie. Toon statische gallery met cross-fade.
const kakiGallery = [
  '/bol afbeeldingen/ludack-cap-kaki-voorkant.jpg',
  '/bol afbeeldingen/ludack-cap-kaki-zijkant.jpg',
  '/bol afbeeldingen/ludack-cap-kaki-achterkant.jpg',
  '/bol afbeeldingen/cap kaki binnenkant.jpg',
];

export function CapViewer360({ variant, className = '' }: Props) {
  if (variant === 'kaki') return <KakiGallery className={className} />;
  return <BlackRotator className={className} />;
}

/* ---------- Zwarte cap: 360° rotator ---------- */

function BlackRotator({ className }: { className?: string }) {
  const frames = useMemo(() => blackFrames(), []);
  const { ready, loaded, total } = usePreload360(frames);
  const [index, setIndex] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Auto-rotate
  useEffect(() => {
    if (!ready || isDragging || reducedMotion) return;

    const tick = (t: number) => {
      if (!lastTickRef.current) lastTickRef.current = t;
      if (t - lastTickRef.current >= AUTO_ROTATE_MS) {
        setIndex((i) => (i + 1) % TOTAL_FRAMES);
        lastTickRef.current = t;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
    };
  }, [ready, isDragging, reducedMotion]);

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
    const next = ((dragStartIndex.current - frameDelta) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
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
      aria-label="360 graden viewer — sleep om te draaien"
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

      {/* Hidden img preloader is handled by usePreload360. We render the current frame. */}
      <img
        src={frames[index]}
        alt={`Ludack cap zwart — frame ${index + 1}`}
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

/* ---------- Kaki: statische gallery met cross-fade ---------- */

function KakiGallery({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % kakiGallery.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-label="Ludack cap kaki — afbeeldingen">
      <AnimatePresence mode="sync">
        <motion.img
          key={kakiGallery[index]}
          src={kakiGallery[index]}
          alt={`Ludack cap kaki — view ${index + 1}`}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
      </AnimatePresence>

      <div className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {kakiGallery.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Bekijk afbeelding ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-ink' : 'w-1.5 bg-ink/30'
            }`}
          />
        ))}
      </div>
    </div>
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
