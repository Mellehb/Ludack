import { motion } from 'framer-motion';
import { fadeUp, staggerParent, viewportOnce } from '@/lib/motion';

export function AboutUs() {
  return (
    <section id="about" className="bg-sand-soft py-24 sm:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5"
        >
          <img
            src="/bol afbeeldingen/cap-hangsysteem.jpg"
            alt="Ludack hangsysteem"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Over Ludack
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.05]"
          >
            Een merk geboren uit detail.
          </motion.h2>

          <motion.div variants={fadeUp} className="mt-6 space-y-4 text-base leading-relaxed text-ink/80">
            <p>
              Ludack begon met één obsessie: een pet die alles wat we eerder droegen overtreft.
              Geen logo's voor de show. Geen modetrucs. Alleen materiaal, pasvorm en afwerking die je voelt.
            </p>
            <p>
              Elke cap wordt in beperkte oplage gemaakt — omdat we liever traag groeien dan compromissen sluiten.
              Drop voor drop bouwen we aan iets dat blijft.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4">
            <div className="h-px w-12 bg-ink/30" />
            <span className="font-display text-lg italic">Het Ludack team</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
