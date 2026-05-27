# ProductShowcase fine-tuning + Stripe live — Design

**Date:** 2026-05-27
**Scope:** `src/components/ProductShowcase.tsx`, `src/lib/products.ts`, `.env`

## Goals

1. ProductShowcase visueel aanscherpen (uitlijning, ademruimte, gelijke kaarthoogtes).
2. Hover-flip op cap-afbeelding: voorkant ↔ achterkant via crossfade.
3. Stripe Checkout productie-klaar maken (echte Price IDs + Secret Key).

## 1. Hover-flip

### Data
Voeg `images: { front, back }` toe **naast** het bestaande `image`-veld:

```ts
{
  ...
  image: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg', // blijft = front
  images: {
    front: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg',
    back:  '/bol afbeeldingen/ludack-cap-zwarti-achterkant.jpg',
  },
}
```

`image` blijft een geldige string-URL → `CombiDeal` en `CartDrawer` blijven onveranderd werken. `ProductShowcase` gebruikt het nieuwe `images`-veld voor de hover-flip.

Bestandsnamen blijven zoals ze in `public/bol afbeeldingen/` staan, incl. typo `ludack-cap-zwarti-achterkant.jpg`.

### Desktop
Twee gestapelde `<img>`s in een `relative` wrapper. Crossfade op `group-hover`:
- Voorkant: `opacity-100 group-hover:opacity-0`
- Achterkant: `opacity-0 group-hover:opacity-100`
- Beiden: `transition-opacity duration-500 ease-out`
- Subtiele zoom (`scale-100 → 1.03`) blijft op de actieve laag.

### Mobiel (geen hover)
Auto-flip bij in beeld komen:
- IntersectionObserver via Framer Motion `useInView` of een eigen hook.
- Bij entry: voorkant zichtbaar. Na `1200ms` crossfade naar achterkant.
- Twee subtiele indicator-dots (`● ○`) onderin de afbeelding, switch volgt de state.
- Uitsluitend op `md:hidden` breakpoint — desktop blijft hover-driven.

### Caption
Huidige "Cherub Back Graphic" caption verwijderen — overbodig zodra je de achterkant letterlijk ziet.

## 2. Uitlijning

- **Border-fix**: `border-ink/6` en `border-ink/8` zijn geen geldige Tailwind opacities → vervangen door `border-ink/10` / `border-ink/5`.
- **Productafbeelding**: `aspect-[4/3]` met `object-cover` → `object-contain` + `p-8 md:p-10` op de wrapper, cap zweeft op `bg-sand-soft`.
- **Sectiekop**: gecentreerd (`max-w-3xl mx-auto text-center`) ipv links uitgelijnd.
- **Body-padding**: `p-7` → `p-6 sm:p-8`. Consistente `mt-6` tussen blokken.
- **Titel + prijs**: `items-baseline` ipv `items-start`.
- **Beschrijving** in `flex-1`-blok zodat CTA's onderaan op gelijke hoogte uitlijnen ongeacht beschrijvingslengte.

## 3. Stripe live

### Code
- Echte `priceId`s invullen in `src/lib/products.ts` (placeholders `price_TBD` vervangen).

### Config (gebruiker)
- `.env` in project-root met `STRIPE_SECRET_KEY=sk_test_...` (test-key voor lokale dev, later live).
- `.env` staat al in `.gitignore` — niets verder te doen.
- Voor productie: zelfde key in Netlify Dashboard → Site settings → Environment variables.

### Test
- `netlify dev` op port 8888.
- Cap toevoegen → cart → "Afrekenen via Stripe" → echte Checkout-pagina.
- Test-kaart `4242 4242 4242 4242`, willekeurige datum/CVC.

### Webhook (later)
Buiten scope nu. `STRIPE_WEBHOOK_SECRET` + endpoint registreren in Stripe Dashboard pas zodra order-mails / fulfillment nodig zijn.

## Out of scope

- Variant-keuze in dezelfde kaart (kleur switchen) — kaarten blijven aparte producten.
- Bestellings­bevestiging via e-mail (vergt webhook + e-mail service).
- 360°-viewer integratie in ProductShowcase (blijft eigen sectie).
