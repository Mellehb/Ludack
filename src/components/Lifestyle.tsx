import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VIDEOS = [
  '/demo 16-4_11 zwart.mp4',
  '/demo 16-4_14 kaki.mp4',
  '/demo 16-4_13.mp4',
];

export function Lifestyle() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="collecties" ref={ref} className="relative overflow-hidden bg-ink py-24 text-bone sm:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow text-bone/50">Lifestyle</span>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.05]">
              Made for the streets.<br />Built to last.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone/60">
            Gedragen door creators, ondernemers en iedereen die liever stilstaat dan opvalt.
          </p>
        </div>
      </div>

      <motion.div style={{ y }} className="relative mt-14 grid gap-3 px-4 sm:grid-cols-3 sm:gap-5 sm:px-8">
        {VIDEOS.map((src, i) => (
          <LifestyleTile key={src} src={src} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

function LifestyleTile({ src, index }: { src: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl bg-ink/40 ${
        index === 1 ? 'sm:aspect-[3/4]' : 'sm:aspect-[4/5]'
      } aspect-[4/5]`}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
    </motion.div>
  );
}
