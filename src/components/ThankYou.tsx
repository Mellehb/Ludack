import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Package, Truck } from 'lucide-react';
import { fadeUp, staggerParent } from '@/lib/motion';
import { Logo } from './ui/Logo';

export function ThankYou() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get('session_id'));
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-bone text-ink">
      {/* Minimal navbar */}
      <header className="px-5 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo height={32} />
          <a href="/#top" className="text-sm text-ink/60 transition-colors hover:text-ink">
            Terug naar shop
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-5 py-20 sm:px-8">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="w-full max-w-xl text-center"
        >
          {/* Checkmark badge */}
          <motion.div variants={fadeUp} className="mx-auto mb-8 flex justify-center">
            <div className="relative grid h-20 w-20 place-items-center rounded-full bg-sand">
              <div className="absolute inset-0 animate-ping rounded-full bg-sand/40" />
              <Check size={36} strokeWidth={2.5} className="relative text-ink" />
            </div>
          </motion.div>

          <motion.span variants={fadeUp} className="eyebrow">
            Bestelling bevestigd
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.02]"
          >
            Bedankt voor je <span className="italic text-sand">bestelling</span>.
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-md text-ink/65">
            We hebben je betaling ontvangen en gaan direct aan de slag met je caps.
            Je ontvangt binnen enkele minuten een bevestigingsmail met je ordergegevens.
          </motion.p>

          {/* Order reference */}
          {sessionId && (
            <motion.p variants={fadeUp} className="mt-6 text-sm text-ink/45">
              Orderreferentie:{' '}
              <code className="rounded-md bg-ink/5 px-2 py-0.5 font-mono text-xs text-ink/70">
                {sessionId.slice(0, 20)}…
              </code>
            </motion.p>
          )}

          {/* Info cards */}
          <motion.div
            variants={fadeUp}
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            <div className="rounded-2xl border border-ink/10 p-6 text-left">
              <Package size={20} className="text-sand" />
              <h3 className="mt-3 font-medium">Order verwerkt</h3>
              <p className="mt-1 text-sm text-ink/55">
                Je caps worden zorgvuldig ingepakt en verzonden.
              </p>
            </div>
            <div className="rounded-2xl border border-ink/10 p-6 text-left">
              <Truck size={20} className="text-sand" />
              <h3 className="mt-3 font-medium">Gratis verzending</h3>
              <p className="mt-1 text-sm text-ink/55">
                Levering binnen 1-3 werkdagen in Nederland & België.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-10">
            <a href="/#top" className="btn-primary group">
              Verder winkelen
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-ink py-8 text-bone">
        <div className="container-x flex flex-col items-center gap-4 text-center">
          <Logo invert height={28} />
          <p className="text-xs text-bone/40">
            © {new Date().getFullYear()} Ludack Headwear. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
}
