import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Instagram, Mail, X } from 'lucide-react';

type Link = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: Link[];
};

const collections = [
  { label: 'Drop 01 — Limited', href: '#collecties' },
  { label: 'The Black Cap', href: '#hero' },
  { label: 'The Beige Cap', href: '#hero' },
];

const containerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, when: 'beforeChildren', staggerChildren: 0.05 },
  },
  exit: { x: '100%', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function MobileMenu({ open, onClose, links }: Props) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />

          <motion.aside
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[420px] flex-col bg-ink text-bone shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigatie"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Sluit menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 text-bone hover:bg-bone/10"
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-10 px-6 pb-10 pt-10">
              {/* Collecties — display font, prominent */}
              <motion.div variants={itemVariants}>
                <span className="eyebrow text-bone/40">Collecties</span>
                <ul className="mt-4 flex flex-col gap-3">
                  {collections.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        onClick={onClose}
                        className="block font-display text-4xl leading-tight tracking-tight text-bone transition-colors hover:text-sand"
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <div className="h-px w-full bg-bone/10" />

              {/* Sectie links — body font */}
              <motion.div variants={itemVariants}>
                <span className="eyebrow text-bone/40">Navigatie</span>
                <ul className="mt-4 flex flex-col gap-3 text-lg">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={onClose}
                        className="block text-bone/80 transition-colors hover:text-bone"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <div className="mt-auto">
                <motion.div variants={itemVariants} className="flex flex-col gap-4">
                  <a href="#combi-deal" onClick={onClose} className="btn-sand">
                    Shop de combi-deal
                  </a>
                  <div className="flex items-center gap-3 text-bone/70">
                    <a
                      href="https://www.tiktok.com/@ludack_headwear"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="TikTok"
                      className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 hover:bg-bone/10"
                    >
                      <TikTokIcon />
                    </a>
                    <a
                      href="https://www.instagram.com/ludack_headwear/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 hover:bg-bone/10"
                    >
                      <Instagram size={18} strokeWidth={1.6} />
                    </a>
                    <a
                      href="mailto:info@ludack.com"
                      aria-label="Mail"
                      className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 hover:bg-bone/10"
                    >
                      <Mail size={18} strokeWidth={1.6} />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.9a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}
