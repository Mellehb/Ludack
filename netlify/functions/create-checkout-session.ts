import type { Handler, HandlerEvent } from '@netlify/functions';
import Stripe from 'stripe';

type Item = {
  priceId: string;
  productId: string;
  quantity: number;
};

type Body = {
  items: Item[];
};

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(500, {
      error: 'STRIPE_SECRET_KEY is niet gezet. Voeg toe in Netlify dashboard of lokaal .env.',
    });
  }

  let body: Body;
  try {
    body = JSON.parse(event.body ?? '{}') as Body;
  } catch {
    return json(400, { error: 'Body is geen geldig JSON.' });
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return json(400, { error: 'items array is verplicht.' });
  }

  const invalid = body.items.find(
    (i) =>
      typeof i.priceId !== 'string' ||
      !i.priceId.startsWith('price_') ||
      i.priceId === 'price_TBD',
  );
  if (invalid) {
    return json(400, {
      error: `Ongeldige of placeholder Stripe Price ID: ${invalid.priceId}. Vul echte priceIds in src/lib/products.ts.`,
    });
  }

  const stripe = new Stripe(secret, { apiVersion: '2025-02-24.acacia' });

  const origin =
    process.env.URL ??
    event.headers.origin ??
    event.headers.referer ??
    'http://localhost:8888';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'ideal', 'bancontact'],
      line_items: body.items.map((i) => ({
        price: i.priceId,
        quantity: i.quantity,
      })),
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: [
          'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI',
          'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
          'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
        ],
      },
      locale: 'nl',
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Clothing purchase',
        },
      },
      success_url: `${origin}/bedankt?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#combi-deal`,
      metadata: {
        productIds: body.items.map((i) => i.productId).join(','),
      },
    });

    return json(200, { url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Onbekende Stripe-fout';
    console.error('[create-checkout-session]', message);
    return json(500, { error: message });
  }
};
