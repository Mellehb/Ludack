import { motion } from 'framer-motion';
import { ArrowRight, Bike, Instagram, MapPin } from 'lucide-react';
import { fadeUp, scaleIn, staggerParent, viewportOnce } from '@/lib/motion';

const towns = [
  'Hilversum',
  'Laren',
  'Blaricum',
  'Bussum',
  'Naarden',
  'Huizen',
  'Eemnes',
  'Weesp',
];

// Town markers placed around the radius visual (percentages within the square).
const markers = [
  { label: 'Hilversum', x: 50, y: 64, hub: true },
  { label: 'Laren', x: 72, y: 40 },
  { label: 'Blaricum', x: 78, y: 58 },
  { label: 'Bussum', x: 34, y: 33 },
  { label: 'Naarden', x: 24, y: 50 },
  { label: 'Huizen', x: 60, y: 22 },
];

export function LocalGooi() {
  return (
    <section
      id="t-gooi"
      className="relative overflow-hidden bg-sand-soft py-24 text-ink sm:py-32"
    >
      {/* Warm radial accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-[480px] w-[480px] rounded-full bg-sand/30 blur-[120px]"
      />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Copy */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.span variants={fadeUp} className="eyebrow inline-flex items-center gap-2">
            <MapPin size={13} strokeWidth={2} className="text-sand" />
            Lokaal — 't Gooi
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.02]"
          >
            Woon je in 't Gooi?
            <br />
            <span className="italic text-sand">Wij komen langs.</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-5 max-w-md text-ink/65">
            Stuur ons een DM op Instagram of TikTok, kies je kleur, en wij bezorgen je
            cap <strong className="font-medium text-ink">gratis</strong> aan de deur —
            persoonlijk, vaak nog dezelfde week. Geen verzendkosten, geen wachten op de
            pakketdienst.
          </motion.p>

          {/* Free delivery highlight */}
          <motion.div
            variants={fadeUp}
            className="mt-7 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-bone/70 px-5 py-2.5 backdrop-blur"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-bone">
              <BikeIcon size={15} strokeWidth={1.7} />
            </span>
            <span className="text-sm font-medium">
              Gratis lokale bezorging
              <span className="text-ink/45"> · binnen 't Gooi</span>
            </span>
          </motion.div>

          {/* Town chips */}
          <motion.ul variants={fadeUp} className="mt-7 flex flex-wrap gap-2">
            {towns.map((town) => (
              <li
                key={town}
                className="rounded-full border border-ink/12 px-3.5 py-1.5 text-xs font-medium text-ink/70"
              >
                {town}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/ludack_headwear/"
              target="_blank"
              rel="noreferrer"
              className="btn-primary group"
            >
              <Instagram size={16} strokeWidth={1.7} />
              Bestel via Instagram DM
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://www.tiktok.com/@ludack_headwear"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary group"
            >
              <TikTokIcon />
              Of via TikTok
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-5 text-[11px] text-ink/45">
            Buiten 't Gooi? Geen probleem — bestel via de webshop, gratis verzending vanaf €50.
          </motion.p>
        </motion.div>

        {/* Delivery-radius visual */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-ink p-6 text-bone shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)]">
            {/* Soft glow behind the rings */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand/15 blur-[60px]"
            />

            {/* Concentric radius rings */}
            <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
              {[92, 66, 40].map((size, i) => (
                <span
                  key={size}
                  className="absolute rounded-full border border-sand/25"
                  style={{ width: `${size}%`, height: `${size}%`, opacity: 1 - i * 0.18 }}
                />
              ))}
            </div>

            {/* Town markers */}
            {markers.map((m) => (
              <div
                key={m.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                {m.hub ? (
                  <span className="relative grid place-items-center">
                    <span className="absolute h-10 w-10 animate-ping rounded-full bg-sand/40" />
                    <span className="relative grid h-8 w-8 place-items-center rounded-full bg-sand text-ink shadow-lg">
                      <MapPin size={15} strokeWidth={2} />
                    </span>
                    <span className="absolute top-9 whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest2 text-sand">
                      {m.label}
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-bone/70" />
                    <span className="whitespace-nowrap text-[10px] font-medium text-bone/55">
                      {m.label}
                    </span>
                  </span>
                )}
              </div>
            ))}

            {/* Floating free-delivery badge */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-bone/10 bg-bone/[0.06] px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sand text-ink">
                  <BikeIcon size={15} strokeWidth={1.7} />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-medium">Gratis bezorgd</p>
                  <p className="text-[10px] text-bone/45">Persoonlijk in 't Gooi</p>
                </div>
              </div>
              <p className="font-display text-2xl text-sand">€0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.9a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}
