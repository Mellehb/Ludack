import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getProduct } from '@/lib/products';
import { buildProperties, trackTikTok } from '@/lib/tiktok';

export type CartItem = { productId: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalAmount: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'ludack:cart';
const MAX_QUANTITY = 10;

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    // Filter ongeldige items (oude productIds die niet meer bestaan)
    return parsed
      .filter((i) => i && typeof i.productId === 'string' && Number.isFinite(i.quantity))
      .filter((i) => Boolean(getProduct(i.productId)));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage());
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / disabled — ignore */
    }
  }, [items]);

  const addItem = useCallback((productId: string, quantity: number = 1) => {
    if (!getProduct(productId)) return;
    // Nooit meer melden dan de cart-limiet toelaat.
    const added = Math.min(quantity, MAX_QUANTITY);
    const properties = buildProperties([{ productId, quantity: added }]);
    if (properties) trackTikTok('AddToCart', properties);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) } : i,
        );
      }
      return [...prev, { productId, quantity: Math.min(quantity, MAX_QUANTITY) }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) } : i,
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const toggleCart = useCallback(() => setOpen((o) => !o), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const totalAmount = useMemo(
    () =>
      items.reduce((sum, i) => {
        const product = getProduct(i.productId);
        return sum + (product ? product.amount * i.quantity : 0);
      }, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    isOpen,
    totalItems,
    totalAmount,
    addItem,
    removeItem,
    updateQty,
    clear,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart moet binnen <CartProvider> worden gebruikt.');
  return ctx;
}
