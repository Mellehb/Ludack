import type { Product } from './products';

export type CheckoutItem = {
  priceId: string;
  productId: string;
  quantity: number;
};

const CHECKOUT_ENDPOINT = '/.netlify/functions/create-checkout-session';

export async function redirectToCheckout(items: CheckoutItem[]): Promise<void> {
  // Guard: if Stripe Price IDs are still placeholders, surface a friendly message
  // so we never hit Stripe with garbage in development.
  if (items.some((i) => i.priceId === 'price_TBD' || !i.priceId)) {
    alert(
      'Stripe Price IDs zijn nog niet geconfigureerd.\n\n' +
        'Voeg de echte priceIds toe in src/lib/products.ts en zet je Stripe keys ' +
        'in een lokaal .env-bestand (kopieer van .env.example).',
    );
    return;
  }

  const response = await fetch(CHECKOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => 'Onbekende fout');
    throw new Error(`Checkout-sessie kon niet worden aangemaakt: ${message}`);
  }

  const { url } = (await response.json()) as { url: string };
  if (!url) throw new Error('Geen redirect-URL ontvangen van Stripe.');

  window.location.href = url;
}

export function buyProduct(product: Product, quantity = 1): Promise<void> {
  return redirectToCheckout([
    { priceId: product.priceId, productId: product.id, quantity },
  ]);
}
