import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { products, formatPrice, getProduct } from '@/lib/products';
import { buyProduct } from '@/lib/stripe';
import { fadeUp, scaleIn, staggerParent, viewportOnce } from '@/lib/motion';

export function CombiDeal() {
  const single = getProduct('cap-black')!;
  const combi = getProduct('combi-deal')!;
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (productId: string) => {
    const product = getProduct(productId);
    if (!product) return;
    try {
      setLoading(productId);
      await buyProduct(product, 1);
    } catch (err) {
      console.error(err);
      alert('Er ging iets mis bij het starten van Stripe Checkout. Probeer het opnieuw.');
    } finally {
      setLoading(null);
    }
  };

  const savings = (combi.compareAt ?? 0) - combi.amount;

  return (
    <section id="combi-deal" className="relative overflow-hidden bg-ink py-24 text-bone sm:py-32">
      {/* Achtergrond accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-sand/15 blur-[120px]"
      />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Productvisual */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative"
        >
          <div className="relative aspect-square">
            <img
              src="/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg"
              alt="Ludack zwarte cap"
              className="absolute left-0 top-1/2 w-[62%] -translate-y-1/2 rotate-[-6deg] rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            />
            <img
              src="/bol afbeeldingen/ludack-cap-kaki-voorkant.jpg"
              alt="Ludack beige cap"
              className="absolute right-0 top-1/2 w-[62%] -translate-y-1/2 rotate-[6deg] rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            />
            <span className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-sand px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest2 text-ink shadow-lg">
              Meest gekozen
            </span>
          </div>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative"
        >
          <motion.span variants={fadeUp} className="eyebrow text-sand">
            06 — Combi Deal
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.02]"
          >
            Twee caps, <span className="italic text-sand">één deal</span>.
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-5 max-w-lg text-bone/65">
            Pak ze allebei. Zwart voor elke dag, beige voor wanneer je iets wil zeggen — voor minder dan apart.
          </motion.p>

          {/* Pricing */}
          <motion.div variants={fadeUp} className="mt-8 space-y-4">
            {/* Anchor: single cap */}
            <div className="flex items-center justify-between rounded-2xl border border-bone/15 px-6 py-5">
              <div>
                <p className="font-medium">{single.name}</p>
                <p className="text-xs text-bone/55">1 cap — losse prijs</p>
              </div>
              <p className="font-display text-2xl">{formatPrice(single.amount)}</p>
            </div>

            {/* Combi: primary offer */}
            <div className="relative overflow-hidden rounded-2xl bg-sand p-6 text-ink shadow-[0_30px_80px_-30px_rgba(201,183,156,0.8)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{combi.name}</p>
                  <ul className="mt-2 flex flex-col gap-1 text-xs text-ink/70">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} strokeWidth={2.5} /> Beide kleuren inbegrepen
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} strokeWidth={2.5} /> Gratis cap-houders inbegrepen
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} strokeWidth={2.5} /> Gratis verzending
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} strokeWidth={2.5} /> 30 dagen retour
                    </li>
                  </ul>
                </div>
                <div className="text-right">
                  {combi.compareAt && (
                    <p className="text-xs text-ink/45 line-through">
                      {formatPrice(combi.compareAt)}
                    </p>
                  )}
                  <p className="font-display text-3xl font-semibold">{formatPrice(combi.amount)}</p>
                  {savings > 0 && (
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest2 text-ink">
                      Bespaar {formatPrice(savings)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleBuy('combi-deal')}
              disabled={loading === 'combi-deal'}
              className="btn-sand group w-full !py-4 text-base"
            >
              {loading === 'combi-deal' ? 'Bezig…' : 'Bestel combi-deal'}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => handleBuy('cap-black')}
              disabled={loading === 'cap-black'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-bone/20 px-7 py-3.5 text-sm text-bone/85 transition-colors hover:border-bone hover:text-bone disabled:opacity-50"
            >
              {loading === 'cap-black' ? 'Bezig…' : 'Of bestel één losse cap'}
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-bone/50"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} /> Beveiligd door Stripe
            </span>
            <span>iDEAL · Bancontact</span>
            <span>Visa · Mastercard</span>
            <span>Apple Pay</span>
          </motion.div>

          {/* Voorraad-hint voor scarcity */}
          <motion.p variants={fadeUp} className="mt-6 inline-flex items-center gap-2 text-xs text-bone/55">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-sand/60" />
              <span className="relative h-2 w-2 rounded-full bg-sand" />
            </span>
            Drop 01 — beperkte voorraad, op = op.
          </motion.p>

          {/* Voorraad waarschuwing wanneer prijs nog placeholder */}
          {single.priceId === 'price_TBD' && (
            <motion.p
              variants={fadeUp}
              className="mt-4 rounded-xl border border-bone/15 bg-ink/40 px-4 py-3 text-[11px] text-bone/55"
            >
              <strong className="text-bone/80">Dev-modus:</strong> Stripe Price IDs nog niet ingesteld.
              Voeg ze toe in <code className="text-sand">src/lib/products.ts</code>.
              Voor productie zie <code className="text-sand">docs/STRIPE_INTEGRATION.md</code>.
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Single cap meta-info */}
      <div className="container-x relative mt-16">
        <div className="grid gap-3 text-[11px] text-bone/45 sm:grid-cols-3 sm:gap-6">
          {products
            .filter((p) => p.variant !== 'combi')
            .map((p) => (
              <div key={p.id} className="flex items-center justify-between border-t border-bone/10 pt-4">
                <span>{p.name}</span>
                <span className="font-display text-base text-bone/70">{formatPrice(p.amount)}</span>
              </div>
            ))}
          <div className="flex items-center justify-between border-t border-bone/10 pt-4">
            <span>Verzending NL</span>
            <span className="font-display text-base text-bone/70">Gratis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
