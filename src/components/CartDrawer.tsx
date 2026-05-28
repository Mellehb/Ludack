import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getProduct } from '@/lib/products';
import { redirectToCheckout } from '@/lib/stripe';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { x: '100%', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, totalAmount, totalItems } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      setCheckingOut(true);
      const lineItems = items.map((i) => {
        const product = getProduct(i.productId);
        return {
          priceId: product?.priceId ?? 'price_TBD',
          productId: i.productId,
          quantity: i.quantity,
        };
      });
      await redirectToCheckout(lineItems);
    } catch (err) {
      console.error(err);
      alert('Er ging iets mis bij het starten van Stripe Checkout. Probeer het opnieuw.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-ink/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Winkelmand"
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[460px] flex-col bg-bone text-ink shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-bone">
                  <ShoppingBag size={16} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-display text-xl leading-none">Winkelmand</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest2 text-ash">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Sluit winkelmand"
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:bg-ink hover:text-bone"
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <EmptyState onClose={closeCart} />
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <ul className="flex flex-col gap-5">
                  {items.map((item) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <li key={item.productId} className="flex gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand-soft">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-medium">{product.name}</p>
                              <p className="text-xs uppercase tracking-widest2 text-ash">
                                {product.tagline}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              aria-label={`Verwijder ${product.name}`}
                              className="grid h-8 w-8 place-items-center rounded-full text-ash transition-colors hover:bg-ink/5 hover:text-ink"
                            >
                              <Trash2 size={14} strokeWidth={1.6} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center rounded-full border border-ink/10">
                              <button
                                type="button"
                                onClick={() => updateQty(item.productId, item.quantity - 1)}
                                aria-label="Verminderen"
                                className="grid h-8 w-8 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-bone"
                              >
                                <Minus size={12} strokeWidth={2} />
                              </button>
                              <span className="w-7 text-center text-sm tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.productId, item.quantity + 1)}
                                aria-label="Verhogen"
                                disabled={item.quantity >= 10}
                                className="grid h-8 w-8 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-bone disabled:opacity-30"
                              >
                                <Plus size={12} strokeWidth={2} />
                              </button>
                            </div>
                            <p className="font-display text-lg tabular-nums">
                              {formatPrice(product.amount * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-ink/8 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ash">Subtotaal</span>
                  <span className="font-display text-2xl tabular-nums">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ash">
                  Verzending gratis vanaf €50 — eventuele kosten in de checkout.
                </p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="btn-primary group mt-4 w-full !py-4"
                >
                  {checkingOut ? 'Bezig…' : 'Afrekenen via Stripe'}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>

                <p className="mt-3 text-center text-[11px] text-ash">
                  Beveiligd door Stripe · iDEAL · Bancontact · Card · Apple Pay
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-sand-soft text-ink">
        <ShoppingBag size={22} strokeWidth={1.4} />
      </span>
      <h3 className="mt-5 font-display text-2xl">Je winkelmand is leeg</h3>
      <p className="mt-2 max-w-xs text-sm text-ash">
        Voeg een cap toe en pak de combi-deal voor de beste prijs.
      </p>
      <button type="button" onClick={onClose} className="btn-secondary mt-6">
        Verder shoppen
      </button>
    </div>
  );
}
