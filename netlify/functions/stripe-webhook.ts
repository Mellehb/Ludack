import type { Handler, HandlerEvent } from '@netlify/functions';
import Stripe from 'stripe';

/**
 * Stripe webhook handler.
 *
 * Lokaal testen:
 *   stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
 *   stripe trigger checkout.session.completed
 *
 * Productie: registreer https://<site>.netlify.app/.netlify/functions/stripe-webhook
 * in het Stripe dashboard en selecteer minimaal de events:
 *   - checkout.session.completed
 *   - checkout.session.async_payment_succeeded
 *   - checkout.session.async_payment_failed
 */
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = event.headers['stripe-signature'];

  if (!secret || !webhookSecret) {
    return { statusCode: 500, body: 'Stripe env vars ontbreken.' };
  }
  if (!signature) {
    return { statusCode: 400, body: 'Geen stripe-signature header.' };
  }
  if (!event.body) {
    return { statusCode: 400, body: 'Lege body.' };
  }

  const stripe = new Stripe(secret, { apiVersion: '2025-02-24.acacia' });

  let stripeEvent: Stripe.Event;
  try {
    // Netlify levert event.body als string; gebruik direct voor signature-check.
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Signature-verificatie faalde';
    console.error('[stripe-webhook] signature error:', msg);
    return { statusCode: 400, body: `Webhook Error: ${msg}` };
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log('[stripe-webhook] checkout.session.completed', {
        id: session.id,
        amount_total: session.amount_total,
        customer_email: session.customer_details?.email,
        productIds: session.metadata?.productIds,
      });
      // TODO: fulfill order (mail klant, log naar admin, voorraad bijwerken, etc.)
      break;
    }
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.async_payment_failed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log(`[stripe-webhook] ${stripeEvent.type}`, { id: session.id });
      break;
    }
    default:
      // andere events negeren maar wel 200 terugsturen zodat Stripe niet retried
      console.log('[stripe-webhook] unhandled event', stripeEvent.type);
  }

  return { statusCode: 200, body: 'ok' };
};
