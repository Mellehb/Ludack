# Stripe integratie — Ludack Headwear

Deze webshop gebruikt **Stripe Checkout** (hosted) gecombineerd met **Netlify Functions** als serverless backend. Geen eigen server, geen PCI-compliance werk, wél een professionele afrekenflow met iDEAL, Bancontact, Apple Pay en kaarten.

```
Frontend (React)
   │  POST /.netlify/functions/create-checkout-session
   ▼
Netlify Function ──► Stripe API ──► Stripe Checkout (hosted)
   ▲                                       │
   │   POST /.netlify/functions/stripe-webhook
   └────────── (na succesvolle betaling) ──┘
```

---

## 1. Stripe account voorbereiden

1. Maak een account op <https://dashboard.stripe.com/register>.
2. Bevestig je bedrijf (KvK, IBAN) — dit ontgrendelt **iDEAL** voor Nederlandse klanten.
3. Schakel onder **Settings → Payment methods** de juiste methodes in: Cards, iDEAL, Bancontact, Apple Pay, Google Pay.
4. Maak je producten aan onder **Products → Add product**:
   - Ludack Cap — Zwart → €34,95
   - Ludack Cap — Kaki → €34,95
   - Combi Deal — 2 Caps → €59,95 (eventueel met "Compare-at price" €69,90)
5. Kopieer voor elk product de **Price ID** (begint met `price_…`) — die heb je zo nodig.

## 2. Environment variabelen

Maak in de project root een `.env`-bestand (kopieer van `.env.example`):

```bash
# Server-only (Netlify Functions)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Browser (VITE_ prefix exposes naar bundle)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx

# Site URL (voor success/cancel redirects)
URL=http://localhost:8888
```

Voor productie zet je dezelfde variabelen op Netlify (Dashboard → Site settings → Environment variables) en wissel je test- voor live keys.

## 3. Price IDs invullen

Open [src/lib/products.ts](../src/lib/products.ts) en vervang `price_TBD` per product:

```ts
export const products: Product[] = [
  { id: 'cap-black', name: 'Ludack Cap — Zwart', variant: 'black',
    priceId: 'price_1QAbCdEFghIjKlMnOpQr',    // ← echte Stripe Price ID
    amount: 3495, image: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg' },
  // …
];
```

`amount` blijft puur voor weergave. Stripe rekent op basis van de `priceId` zelf.

## 4. De checkout-flow (code)

### Client — `src/lib/stripe.ts`

```ts
const CHECKOUT_ENDPOINT = '/.netlify/functions/create-checkout-session';

export async function redirectToCheckout(items: CheckoutItem[]) {
  const response = await fetch(CHECKOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error(await response.text());
  const { url } = await response.json();
  window.location.href = url;          // ← gebruiker naar Stripe Checkout
}
```

### Server — `netlify/functions/create-checkout-session.ts`

```ts
import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-09-30.acacia',
  });

  const { items } = JSON.parse(event.body ?? '{}');
  const origin = process.env.URL ?? event.headers.origin ?? 'http://localhost:8888';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'ideal', 'bancontact'],
    line_items: items.map((i: any) => ({ price: i.priceId, quantity: i.quantity })),
    allow_promotion_codes: true,
    shipping_address_collection: { allowed_countries: ['NL', 'BE', 'DE', 'FR', 'LU'] },
    locale: 'nl',
    success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${origin}/?checkout=cancel`,
    metadata: { productIds: items.map((i: any) => i.productId).join(',') },
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: session.url }),
  };
};
```

> De volledige (productie-klare) variant met error-handling en CORS staat in [`netlify/functions/create-checkout-session.ts`](../netlify/functions/create-checkout-session.ts).

## 5. Webhook — post-purchase events

`checkout.session.completed` wordt door Stripe naar je webhook gestuurd zodra een betaling slaagt. De handler in [`netlify/functions/stripe-webhook.ts`](../netlify/functions/stripe-webhook.ts) verifieert de signature en logt het event. Vul daar je eigen logica in (mail naar klant, order in Airtable/Notion, voorraad bijwerken, etc.):

```ts
case 'checkout.session.completed': {
  const session = stripeEvent.data.object as Stripe.Checkout.Session;
  // TODO: send confirmation mail, save order, decrement stock…
  break;
}
```

## 6. Lokaal testen

1. Installeer de Netlify CLI en Stripe CLI:
   ```bash
   npm i -g netlify-cli
   brew install stripe/stripe-cli/stripe   # of zie https://stripe.com/docs/stripe-cli
   stripe login
   ```
2. Start dev-server inclusief Functions:
   ```bash
   netlify dev
   ```
   Site draait op `http://localhost:8888`.
3. Open in een tweede terminal de webhook-tunnel:
   ```bash
   stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
   ```
   Kopieer het `whsec_…` secret dat Stripe toont naar je `.env` als `STRIPE_WEBHOOK_SECRET`.
4. Klik op de site op **Bestel combi-deal** → je belandt op de Stripe Checkout pagina.
5. Test-kaart: `4242 4242 4242 4242`, willekeurige toekomstige datum, willekeurige CVC.
6. In je terminal zie je het webhook-event binnenkomen.

## 7. Productie-checklist

- [ ] Live keys (`sk_live_…`, `pk_live_…`) in Netlify env vars
- [ ] Production webhook endpoint geregistreerd in Stripe Dashboard:
      `https://<jouw-site>.netlify.app/.netlify/functions/stripe-webhook`
      events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
- [ ] `whsec_…` van dat productie-endpoint als `STRIPE_WEBHOOK_SECRET` in Netlify env
- [ ] Stripe → Settings → Branding: logo + kleuren ingesteld (Checkout pagina gebruikt deze)
- [ ] Refund/retour-policy ingesteld in Stripe dashboard
- [ ] Op productie test je 1× met de live keys en een echte (kleine) order om te bevestigen dat de webhook draait en de e-mailflow werkt

## 8. Veelvoorkomende fouten

| Foutmelding | Oorzaak | Fix |
|---|---|---|
| `Invalid API key provided` | Verkeerde of lege `STRIPE_SECRET_KEY` | Check `.env` lokaal of Netlify env in productie |
| `No such price: price_TBD` | Placeholder priceId nog niet vervangen | Vul echte Price IDs in `src/lib/products.ts` |
| `Webhook signature verification failed` | `STRIPE_WEBHOOK_SECRET` mist of komt niet overeen | Kopieer opnieuw uit `stripe listen` of uit Stripe Dashboard → Webhook details |
| `Mixed content` op productie | `success_url` is HTTP, site is HTTPS | Netlify zet `URL` automatisch op HTTPS; check env override |
| iDEAL ontbreekt | Bedrijf nog niet geverifieerd in Stripe | Stripe Dashboard → Settings → Business details afronden |

---

**Volgende stap na deze integratie:** order-fulfillment (mailflow + adminlog). Houd webhook scope minimaal en log alles — Stripe events zijn idempotent dus je kunt altijd opnieuw afspelen via het dashboard.
