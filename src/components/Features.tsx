import { motion } from 'framer-motion';
import { Sparkles, Ruler, Layers, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fadeUp, staggerParent, viewportOnce } from '@/lib/motion';

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: 'Premium katoen',
    body: 'Zware kwaliteit canvas die zijn vorm houdt — gemaakt om jaren mee te gaan.',
  },
  {
    icon: Ruler,
    title: 'Perfecte pasvorm',
    body: 'Verstelbare metalen sluiting. One size, gemaakt voor elk hoofd.',
  },
  {
    icon: Layers,
    title: 'Beperkte oplage',
    body: 'Drop 01 is genummerd en gelimiteerd. Wanneer op = op.',
  },
  {
    icon: Truck,
    title: 'Verzonden binnen 24u',
    body: 'Vandaag besteld voor 22:00 — morgen in huis. Track & trace inbegrepen.',
  },
];

export function Features() {
  return (
    <section id="features" className="bg-bone py-24 sm:py-32">
      <div className="container-x">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-2xl"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Waarom Ludack
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.05]"
          >
            Detail boven trend.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-ash">
            Elk onderdeel is gekozen voor hoe het draagt op dag duizend — niet alleen dag één.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-bone p-7 transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_20px_60px_-15px_rgba(10,10,10,0.15)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-sand-soft text-ink transition-colors group-hover:bg-sand">
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{body}</p>
              <span
                aria-hidden="true"
                className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-sand transition-transform duration-500 group-hover:scale-x-100"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
