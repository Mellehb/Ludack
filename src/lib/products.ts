export type Product = {
  id: string;
  name: string;
  tagline: string;
  variant: 'black' | 'kaki' | 'combi';
  priceId: string;
  amount: number;
  compareAt?: number;
  image: string;
  lifestyle?: string;
  images: {
    front: string;
    back: string;
  };
  description: string;
};

export const products: Product[] = [
  {
    id: 'cap-black',
    name: 'Ludack Cherub Cap',
    tagline: 'Zwart',
    variant: 'black',
    priceId: 'price_1ThAAS1lu45rSdUofhAdt9Q7',
    amount: 3995,
    image: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg',
    lifestyle: '/Ludack Street Black.jpg',
    images: {
      front: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg',
      back: '/bol afbeeldingen/ludack-cap-zwarti-achterkant.jpg',
    },
    description: 'Zwart premium canvas. Script embroidery voorkant, cherub back graphic, LX side logo.',
  },
  {
    id: 'cap-kaki',
    name: 'Ludack Cherub Cap',
    tagline: 'Beige',
    variant: 'kaki',
    priceId: 'price_1ThAAS1lu45rSdUoVwmFdL8n',
    amount: 3995,
    image: '/bol afbeeldingen/ludack-cap-kaki-voorkant.jpg',
    lifestyle: '/Ludack Street Kaki.jpg',
    images: {
      front: '/bol afbeeldingen/ludack-cap-kaki-voorkant.jpg',
      back: '/bol afbeeldingen/ludack-cap-kaki-achterkant.jpg',
    },
    description: 'Beige premium canvas. Script embroidery voorkant, cherub back graphic, LX side logo.',
  },
  {
    id: 'combi-deal',
    name: 'Cherub Combi Deal',
    tagline: '2 Caps — Zwart + Beige',
    variant: 'combi',
    priceId: 'price_1ThAAQ1lu45rSdUoS9YK5K9Q',
    amount: 7495,
    compareAt: 7990,
    image: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg',
    images: {
      front: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg',
      back: '/bol afbeeldingen/ludack-cap-kaki-voorkant.jpg',
    },
    description: 'Pak beide kleuren — zwart voor elke dag, beige voor wanneer je iets wil zeggen.',
  },
];

export const formatPrice = (cents: number): string =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(cents / 100);

export const getProduct = (id: string): Product | undefined =>
  products.find((p) => p.id === id);
