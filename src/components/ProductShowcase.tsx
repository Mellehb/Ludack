import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Gift, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products, formatPrice, type Product } from '@/lib/products';
import { fadeUp, staggerParent, viewportOnce } from '@/lib/motion';

const SHOWCASE_PRODUCTS = products.filter((p) => p.variant !== 'combi');

export function ProductShowcase() {
  return (
    <section id="collecties" className="bg-sand-soft py-24 sm:py-32">
      <div className="container-x">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            02 — Collection
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-medium leading-[1.02]"
          >
            Shop de <span className="italic text-sand">Cherub Caps</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-8"
        >
          {SHOWCASE_PRODUCTS.map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-10 text-center text-xs uppercase tracking-widest2 text-ash">
          Beperkte oplage — op = op.
        </p>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imageRef, { margin: '-25% 0px -25% 0px' });
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  // Mobile (no hover): auto-flip to the back ~1.2s after the card enters the viewport.
  useEffect(() => {
    if (!isTouch) return;
    if (isInView) {
      const t = setTimeout(() => setShowBack(true), 1200);
      return () => clearTimeout(t);
    }
    setShowBack(false);
  }, [isInView, isTouch]);

  const handleAdd = () => {
    addItem(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
    openCart();
  };

  const onPointerEnter = () => {
    if (!isTouch) setShowBack(true);
  };
  const onPointerLeave = () => {
    if (!isTouch) setShowBack(false);
  };

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-bone shadow-[0_1px_2px_rgba(10,10,10,0.04),0_24px_60px_-28px_rgba(10,10,10,0.18)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(10,10,10,0.05),0_46px_90px_-30px_rgba(10,10,10,0.26)]"
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
    >
      {/* Product image — one continuous bone surface with a soft studio halo */}
      <div
        ref={imageRef}
        className="relative aspect-[4/3] overflow-hidden bg-bone"
      >
        {/* Studio halo — barely there, lifts the cap off the bone surface */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_62%,rgba(237,229,214,0.55),transparent_68%)]"
        />

        <img
          src={product.images.front}
          alt={`${product.name} — ${product.tagline} voorkant`}
          className={`absolute inset-0 h-full w-full object-contain p-10 md:p-14 transition-all duration-700 ease-out [filter:drop-shadow(0_22px_22px_rgba(10,10,10,0.18))] ${
            showBack ? 'scale-100 opacity-0' : 'scale-100 opacity-100 group-hover:scale-[1.04]'
          }`}
        />
        <img
          src={product.images.back}
          alt={`${product.name} — ${product.tagline} achterkant`}
          aria-hidden={!showBack}
          className={`absolute inset-0 h-full w-full object-contain p-10 md:p-14 transition-all duration-700 ease-out [filter:drop-shadow(0_22px_22px_rgba(10,10,10,0.18))] ${
            showBack ? 'scale-[1.04] opacity-100' : 'scale-100 opacity-0'
          }`}
        />

        {/* Indicator dots — visible on touch only, hint at two sides */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden">
          <span
            className={`h-1 w-1 rounded-full transition-colors duration-300 ${
              showBack ? 'bg-ink/20' : 'bg-ink/55'
            }`}
          />
          <span
            className={`h-1 w-1 rounded-full transition-colors duration-300 ${
              showBack ? 'bg-ink/55' : 'bg-ink/20'
            }`}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-8 sm:p-9">
        {/* Refined drop / limited eyebrow */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest2">
          <span className="inline-flex items-center gap-2 text-ash">
            <span className="h-px w-6 bg-sand" aria-hidden="true" />
            Drop 01 — Genummerd
          </span>
          <span className="text-sand">Limited</span>
        </div>

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <div>
            <h3 className="font-display text-[1.85rem] leading-[1.05] tracking-tight">
              {product.name}
            </h3>
            <p className="mt-2 text-xs uppercase tracking-widest2 text-ash">
              {product.tagline}
            </p>
          </div>
          <p className="shrink-0 font-display text-[1.85rem] leading-[1.05] tabular-nums">
            {formatPrice(product.amount)}
          </p>
        </div>

        <p className="mt-5 flex-1 text-[13.5px] leading-[1.7] text-ash">
          {product.description}
        </p>

        {/* Color row — hairline divider */}
        <div className="mt-7 flex items-center gap-3 border-t border-ink/8 pt-5">
          <span className="text-[10px] uppercase tracking-widest2 text-ash">Kleur</span>
          <span className="text-xs font-medium uppercase tracking-widest2">{product.tagline}</span>
          <div className="ml-auto flex items-center gap-2">
            <span
              className={`h-5 w-5 rounded-full border border-ink/15 bg-ink ${
                product.variant === 'black' ? 'ring-[1.5px] ring-ink ring-offset-2 ring-offset-bone' : ''
              }`}
              aria-hidden="true"
            />
            <span
              className={`h-5 w-5 rounded-full border border-ink/15 bg-sand ${
                product.variant === 'kaki' ? 'ring-[1.5px] ring-ink ring-offset-2 ring-offset-bone' : ''
              }`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Subtiel cadeau-detail */}
        <p className="mt-4 flex items-center gap-1.5 text-[11px] text-ash">
          <Gift size={12} strokeWidth={1.8} className="text-sand" />
          Inclusief gratis cap-houder
        </p>

        {/* Quantity + CTA */}
        <div className="mt-5 flex items-stretch gap-3">
          <div className="inline-flex items-center rounded-full border border-ink/10">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Verminderen"
              disabled={qty <= 1}
              className="grid h-11 w-11 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-bone disabled:opacity-30"
            >
              <Minus size={14} strokeWidth={2} />
            </button>
            <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              aria-label="Verhogen"
              disabled={qty >= 10}
              className="grid h-11 w-11 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-bone disabled:opacity-30"
            >
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>
          <button type="button" onClick={handleAdd} className="btn-primary flex-1 !py-3.5">
            {added ? (
              <>
                <Check size={16} strokeWidth={2.2} /> Toegevoegd
              </>
            ) : (
              'Add to cart'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
