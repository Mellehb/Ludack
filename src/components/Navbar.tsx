import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Logo } from './ui/Logo';
import { MobileMenu } from './MobileMenu';

const NAV_LINKS = [
  { href: '#collecties', label: 'Collecties' },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'Brand' },
  { href: '#combi-deal', label: 'Combi Deal' },
];

export function Navbar() {
  const direction = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop transparency:
  // - top:  bg-ink/80 (helder/donker)
  // - up:   bg-ink/80 (helder zodra je terug omhoog scrollt)
  // - down: bg-ink/25 (transparanter wanneer je naar beneden scrollt)
  const desktopBg =
    direction === 'down'
      ? 'bg-ink/25 backdrop-blur-md'
      : 'bg-ink/80 backdrop-blur-xl';

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        {/* Desktop pill navbar */}
        <nav
          className={`mx-auto hidden h-14 max-w-6xl items-center justify-between rounded-full border border-bone/10 px-3 pl-6 text-bone shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-brand-out lg:flex ${desktopBg}`}
          aria-label="Hoofdmenu"
        >
          <Logo invert height={28} />

          <ul className="flex items-center gap-7 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative text-bone/85 transition-colors hover:text-bone"
                >
                  {link.label}
                  <span className="absolute inset-x-2 -bottom-1 h-px origin-left scale-x-0 bg-sand transition-transform duration-300 ease-brand-out group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Winkelmand"
              className="grid h-10 w-10 place-items-center rounded-full text-bone/85 transition-colors hover:text-bone"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
            </button>
            <a href="#combi-deal" className="btn-sand !py-2 !px-5 !text-xs">
              Shop nu
            </a>
          </div>
        </nav>

        {/* Mobile bar */}
        <nav
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-bone/10 px-4 text-bone backdrop-blur-xl transition-all duration-500 lg:hidden ${
            direction === 'down' ? 'bg-ink/35' : 'bg-ink/85'
          }`}
          aria-label="Mobiel menu"
        >
          <Logo invert height={24} />
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Winkelmand"
              className="grid h-10 w-10 place-items-center rounded-full text-bone/85 hover:text-bone"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-full text-bone/85 hover:text-bone"
            >
              <Menu size={20} strokeWidth={1.6} />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
    </>
  );
}
