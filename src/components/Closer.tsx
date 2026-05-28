import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerParent, viewportOnce } from '@/lib/motion';

export function Closer() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-bone sm:py-36">
      {/* Zachte sand glow op het midden — geeft de afsluiter een focal point */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand/10 blur-[140px]"
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container-x relative mx-auto max-w-3xl text-center"
      >
        <motion.span variants={fadeUp} className="eyebrow text-sand">
          Limited Drop
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="mt-6 font-display italic text-[clamp(2.6rem,6.5vw,5rem)] font-medium leading-[1.05]"
        >
          Limited drop.
          <br />
          Zodra hij weg is, is hij weg.
        </motion.h2>

        <motion.p variants={fadeUp} className="mt-6 text-sm text-bone/55">
          Beperkte oplage. Geen restock.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex justify-center">
          <a
            href="#collecties"
            className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 text-[11px] font-medium uppercase tracking-widest2 text-ink transition-all duration-300 ease-brand-out hover:bg-sand"
          >
            Shop de Cherub Collection
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
