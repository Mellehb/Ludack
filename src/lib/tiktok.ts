import { getProduct, type Product } from './products';

/**
 * TikTok Pixel — event-laag.
 *
 * De basiscode staat in index.html en maakt `window.ttq` synchroon aan met een
 * queue, dus events die vóór het laden van events.js vuren gaan niet verloren.
 * Als de pixel geblokkeerd is (adblocker, tracking protection) bestaat `ttq`
 * niet en doen deze functies niets — tracking mag de winkel nooit stukmaken.
 */

export type TikTokEvent = 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'CompletePayment';

type Content = {
  content_id: string;
  content_type: 'product';
  content_name: string;
  price: number;
  quantity: number;
};

export type EventProperties = {
  contents: Content[];
  value: number;
  currency: 'EUR';
};

declare global {
  interface Window {
    ttq?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

const toEuros = (cents: number): number => Math.round(cents) / 100;

export type OrderLine = { productId: string; quantity: number };

function toContent(product: Product, quantity: number): Content {
  return {
    content_id: product.id,
    content_type: 'product',
    content_name: `${product.name} — ${product.tagline}`,
    price: toEuros(product.amount),
    quantity,
  };
}

/**
 * Bouwt de `contents` + `value` die TikTok nodig heeft om op omzet te kunnen
 * optimaliseren. Geeft null terug als er niets zinnigs te melden valt.
 */
export function buildProperties(lines: OrderLine[]): EventProperties | null {
  const contents: Content[] = [];
  let totalCents = 0;

  for (const line of lines) {
    const product = getProduct(line.productId);
    if (!product || line.quantity <= 0) continue;
    contents.push(toContent(product, line.quantity));
    totalCents += product.amount * line.quantity;
  }

  if (contents.length === 0) return null;
  return { contents, value: toEuros(totalCents), currency: 'EUR' };
}

export function trackTikTok(event: TikTokEvent, properties?: EventProperties): void {
  const ttq = window.ttq;
  if (typeof ttq?.track !== 'function') return;
  try {
    ttq.track(event, properties);
  } catch {
    /* analytics mag nooit een klik of checkout blokkeren */
  }
}

export function trackProductView(product: Product): void {
  trackTikTok('ViewContent', {
    contents: [toContent(product, 1)],
    value: toEuros(product.amount),
    currency: 'EUR',
  });
}

/**
 * Bestelling-snapshot rond de Stripe-redirect.
 *
 * De klant verlaat de site richting Stripe en komt terug op /bedankt — die
 * pagina draait buiten de CartProvider en kent de bestelling dus niet meer.
 * Daarom leggen we vlak voor de redirect de regels vast, en lezen we ze op de
 * bedankpagina eenmalig uit. Het verwijderen bij uitlezen zorgt dat een refresh
 * van /bedankt niet nóg een conversie meldt.
 */
const PENDING_ORDER_KEY = 'ludack:pending-order';

export function rememberPendingOrder(properties: EventProperties): void {
  try {
    window.localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(properties));
  } catch {
    /* storage vol / uitgeschakeld — dan missen we hooguit de orderwaarde */
  }
}

export function consumePendingOrder(): EventProperties | null {
  try {
    const raw = window.localStorage.getItem(PENDING_ORDER_KEY);
    window.localStorage.removeItem(PENDING_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EventProperties;
    if (!Array.isArray(parsed?.contents) || typeof parsed?.value !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}
