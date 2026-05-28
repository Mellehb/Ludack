import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Logo } from './ui/Logo';
import { MobileMenu } from './MobileMenu';

const NAV_LINKS = [
  { href: '#collecties', label: 'Collecties' },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'Brand' },
  { href: '#combi-deal', label: 'Combi Deal' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        {/* Desktop pill navbar — constant zwart, geen border */}
        <nav
          className="mx-auto hidden h-14 max-w-6xl items-center justify-between rounded-full bg-ink px-3 pl-6 text-bone shadow-[0_8px_30px_rgba(0,0,0,0.18)] lg:flex"
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
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <CartButton totalItems={totalItems} onClick={openCart} />
            <a href="#combi-deal" className="btn-sand !py-2 !px-5 !text-xs">
              Shop nu
            </a>
          </div>
        </nav>

        {/* Mobile bar — constant zwart, geen border */}
        <nav
          className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full bg-ink px-4 text-bone shadow-[0_8px_30px_rgba(0,0,0,0.18)] lg:hidden"
          aria-label="Mobiel menu"
        >
          <Logo invert height={24} />
          <div className="flex items-center gap-1">
            <CartButton totalItems={totalItems} onClick={openCart} />
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

function CartButton({ totalItems, onClick }: { totalItems: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Winkelmand — ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
      className="relative grid h-10 w-10 place-items-center rounded-full text-bone/85 transition-colors hover:text-bone"
    >
      <ShoppingBag size={18} strokeWidth={1.6} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-sand px-1 text-[10px] font-semibold tabular-nums text-ink"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
