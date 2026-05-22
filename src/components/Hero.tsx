import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { CapViewer360 } from './CapViewer360';
import { fadeUp, staggerParent } from '@/lib/motion';

type Variant = 'black' | 'kaki';

export function Hero() {
  const [variant, setVariant] = useState<Variant>('black');

  return (
    <section id="hero" className="relative overflow-hidden bg-bone pt-28 sm:pt-32">
      {/* Subtiele beige glow achter de cap */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-15%] top-[10%] h-[700px] w-[700px] rounded-full bg-sand/40 blur-[120px]"
      />

      <div className="container-x relative grid items-center gap-12 pb-20 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Copy */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-xl"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Drop 01 — Limited
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-5 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-medium leading-[1.05] tracking-tight"
          >
            Pets die <em className="not-italic text-sand">jouw</em> verhaal vertellen.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-md text-base leading-relaxed text-ash">
            Premium katoen, zorgvuldig afgewerkt en bewust in beperkte oplage gemaakt.
            Made for the streets — built to last.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#combi-deal" className="btn-primary group">
              Shop de combi-deal
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#features" className="btn-secondary">
              Bekijk de petten
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.ul
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-ash"
          >
            <li className="flex items-center gap-2">
              <Truck size={14} className="text-ink" /> Gratis verzending NL
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw size={14} className="text-ink" /> 30 dagen retour
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-ink" /> Beveiligd afrekenen
            </li>
          </motion.ul>
        </motion.div>

        {/* 360 Viewer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-square w-full">
            <CapViewer360 variant={variant} className="absolute inset-0 h-full w-full" />
          </div>

          {/* Variant thumbnails */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <VariantThumb
              label="Zwart"
              imgSrc="/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg"
              active={variant === 'black'}
              onClick={() => setVariant('black')}
            />
            <VariantThumb
              label="Kaki"
              imgSrc="/bol afbeeldingen/ludack-cap-kaki-voorkant.jpg"
              active={variant === 'kaki'}
              onClick={() => setVariant('kaki')}
            />
          </div>
        </motion.div>
      </div>

      {/* Subtiele scroll-indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hidden justify-center pb-8 lg:flex"
      >
        <span className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-widest2 text-ash">
          Scroll
          <span className="h-12 w-px bg-gradient-to-b from-ink/40 to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}

function VariantThumb({
  label,
  imgSrc,
  active,
  onClick,
}: {
  label: string;
  imgSrc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex items-center gap-3 rounded-full border px-2 py-2 pr-5 text-sm transition-all duration-300 ${
        active
          ? 'border-ink bg-ink text-bone'
          : 'border-ink/15 bg-bone text-ink hover:border-ink/40'
      }`}
    >
      <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-sand-soft">
        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
      </span>
      {label}
    </button>
  );
}
