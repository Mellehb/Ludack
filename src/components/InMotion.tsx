import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { products, formatPrice, type Product } from '@/lib/products';
import { fadeUp, staggerParent, viewportOnce } from '@/lib/motion';

const TILES = products.filter((p) => p.variant !== 'combi');

export function InMotion() {
  return (
    <section id="in-motion" className="relative overflow-hidden bg-ink py-24 text-bone sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-sand/10 blur-[140px]"
      />

      <div className="container-x relative">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <motion.span variants={fadeUp} className="eyebrow text-bone/50">
              03 — In motion
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-medium leading-[1.02]"
            >
              Beide kleuren,<br />
              <span className="italic text-sand">vanuit elke hoek</span>
            </motion.h2>
          </div>
          <motion.a
            variants={fadeUp}
            href="#combi-deal"
            className="group inline-flex items-center gap-2 rounded-full border border-bone/20 px-6 py-3 text-xs font-medium uppercase tracking-widest2 text-bone transition-all duration-300 ease-brand-out hover:border-bone hover:bg-bone hover:text-ink"
          >
            Shop nu
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </motion.a>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6"
        >
          {TILES.map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <Tile product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Tile({ product }: { product: Product }) {
  const dotColor = product.variant === 'black' ? 'bg-bone' : 'bg-sand';

  return (
    <a
      href="#collecties"
      className="group block"
      aria-label={`Bekijk ${product.name} — ${product.tagline}`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotColor}`} aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-widest2 text-bone/60">
          {product.tagline}
        </span>
      </div>

      <div className="relative mt-3 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-bone via-bone to-sand-soft">
        <motion.img
          src={product.image}
          alt={`${product.name} — ${product.tagline}`}
          className="absolute inset-0 h-full w-full object-contain p-6"
          initial={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-transparent" />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="font-medium">
          Cherub Collection — <span className="text-bone/65">{product.tagline}</span>
        </p>
        <p className="font-display text-lg tabular-nums text-bone/90">
          {formatPrice(product.amount)}
        </p>
      </div>
    </a>
  );
}
