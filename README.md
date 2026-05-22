# Ludack Headwear — Webshop

Premium streetwear caps. 1-page webshop met 360° viewer, Stripe Checkout via Netlify Functions, en een conversie-first combi-deal sectie.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** met brand-tokens (ink / bone / sand)
- **Framer Motion** voor scroll-reveals + 360° viewer mechanics
- **lucide-react** icons + Cormorant Garamond / Inter (Google Fonts)
- **Stripe Checkout** (hosted) via **Netlify Functions**

## Snel starten

```bash
# 1. Dependencies installeren (al gedaan na scaffold)
npm install

# 2. Logo aanleveren
cp pad/naar/logo.png public/logo.png

# 3. Dev server (alleen frontend)
npm run dev                # http://localhost:5173

# 4. Dev server inclusief Netlify Functions (Stripe-flow testen)
npm i -g netlify-cli
netlify dev                # http://localhost:8888
```

## Environment variabelen

Kopieer `.env.example` naar `.env` en vul Stripe keys in:

```bash
cp .env.example .env
```

Zie [`docs/STRIPE_INTEGRATION.md`](docs/STRIPE_INTEGRATION.md) voor de complete Stripe-integratie inclusief code-voorbeelden, lokaal testen en productie-checklist.

## Project structuur

```
src/
├── components/      # Sectie-componenten + UI primitives
│   ├── Navbar.tsx + MobileMenu.tsx
│   ├── Hero.tsx + CapViewer360.tsx
│   ├── Features.tsx / Lifestyle.tsx / AboutUs.tsx
│   ├── CombiDeal.tsx (hoofdconversie)
│   └── Footer.tsx
├── hooks/           # useScrollDirection, usePreload360
├── lib/             # products, stripe, motion
└── App.tsx          # sectie-compositie

netlify/functions/
├── create-checkout-session.ts   # maakt Stripe sessie
└── stripe-webhook.ts            # post-purchase events

public/
├── logo.png         # door eigenaar aan te leveren
├── 360-web/         # 144 frames voor 360° viewer (zwarte cap)
├── 360/             # originele PNG sequence (zwarte cap, hi-res)
└── bol afbeeldingen/   # productfoto's per variant
```

## Brand assets

- **Kleuren** (Tailwind tokens):
  `bg-ink #0A0A0A` · `bg-bone #FFFFFF` · `bg-sand #C9B79C` · `bg-sand-soft #EDE5D6` · `text-ash #6B6B6B`
- **Fonts**: Cormorant Garamond (display) + Inter (body)
- **360° viewer**: zwarte cap uit `/public/360-web/`. Kaki cap krijgt statische gallery tot een 360°-sequentie beschikbaar is.

## Productprijzen wijzigen

Open [`src/lib/products.ts`](src/lib/products.ts) en pas `amount`, `compareAt` en `priceId` aan. Bedragen zijn in centen (€34,95 = `3495`).

## Build & deploy

```bash
npm run build       # bouwt naar dist/
npm run preview     # preview de build lokaal

# Productie deploy
netlify deploy --prod
```

Op Netlify zet je dezelfde env-variabelen (live Stripe keys) onder *Site settings → Environment variables*.

## GitHub repo aanmaken (eerste keer)

Lokaal is `git init` al gedaan met een eerste commit. Maak nu zelf de repo op github.com (privé of public):

```bash
git remote add origin git@github.com:<jouw-user>/ludack.git
git branch -M main
git push -u origin main
```

Wanneer je de repo aan Netlify koppelt, deployt elke push naar `main` automatisch.

## Roadmap (volgende iteraties)

- 360°-sequentie voor kaki cap
- Echte Stripe Price IDs invullen (`src/lib/products.ts`)
- Mail-template post-purchase (in `stripe-webhook.ts`)
- Cookie-banner + privacy/AV pages
- 2e drop / collectie uitbreiding

---

Voor vragen of issues: info@ludack.com
