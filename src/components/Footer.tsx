import { Instagram, Mail } from 'lucide-react';
import { Logo } from './ui/Logo';

const shopLinks = [
  { label: 'Collecties', href: '#collecties' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Combi Deal', href: '#combi-deal' },
];

const careLinks = [
  { label: 'Verzending', href: '#about' },
  { label: 'Retour', href: '#about' },
  { label: 'Contact', href: 'mailto:info@ludack.com' },
  { label: 'FAQ', href: '#about' },
];

export function Footer() {
  return (
    <footer className="bg-ink pt-20 text-bone">
      <div className="container-x grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo invert height={28} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/55">
            Premium streetwear caps. Genummerd, gelimiteerd, gemaakt om gedragen te worden.
          </p>
        </div>

        <FooterColumn title="Shop" items={shopLinks} />
        <FooterColumn title="Klantenservice" items={careLinks} />

        <div>
          <h4 className="eyebrow text-bone/45">Connect</h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li>
              <a
                href="https://www.tiktok.com/@ludack_headwear"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 text-bone/75 transition-colors hover:text-bone"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-bone/15 transition-colors group-hover:border-sand group-hover:text-sand">
                  <TikTokIcon />
                </span>
                @ludack_headwear
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/ludack_headwear/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 text-bone/75 transition-colors hover:text-bone"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-bone/15 transition-colors group-hover:border-sand group-hover:text-sand">
                  <Instagram size={14} strokeWidth={1.6} />
                </span>
                Ludack_headwear
              </a>
            </li>
            <li>
              <a
                href="mailto:info@ludack.com"
                className="group inline-flex items-center gap-2.5 text-bone/75 transition-colors hover:text-bone"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-bone/15 transition-colors group-hover:border-sand group-hover:text-sand">
                  <Mail size={14} strokeWidth={1.6} />
                </span>
                info@ludack.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-xs text-bone/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Ludack Headwear. Alle rechten voorbehouden.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>KvK: 00000000</span>
            <a href="#about" className="hover:text-bone/70">Algemene voorwaarden</a>
            <a href="#about" className="hover:text-bone/70">Privacy</a>
            <a
              href="https://aiwebsolutions.nl"
              target="_blank"
              rel="noreferrer"
              className="text-bone/25 transition-colors hover:text-bone/60"
            >
              Built by AI Web Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="eyebrow text-bone/45">{title}</h4>
      <ul className="mt-4 flex flex-col gap-3 text-sm">
        {items.map((i) => (
          <li key={i.label}>
            <a href={i.href} className="text-bone/75 transition-colors hover:text-bone">
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.9a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}
