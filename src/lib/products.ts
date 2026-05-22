export type Product = {
  id: string;
  name: string;
  variant: 'black' | 'kaki' | 'combi';
  priceId: string;
  amount: number;
  compareAt?: number;
  image: string;
};

export const products: Product[] = [
  {
    id: 'cap-black',
    name: 'Ludack Cap — Zwart',
    variant: 'black',
    priceId: 'price_TBD',
    amount: 3495,
    image: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg',
  },
  {
    id: 'cap-kaki',
    name: 'Ludack Cap — Kaki',
    variant: 'kaki',
    priceId: 'price_TBD',
    amount: 3495,
    image: '/bol afbeeldingen/ludack-cap-kaki-voorkant.jpg',
  },
  {
    id: 'combi-deal',
    name: 'Combi Deal — 2 Caps (Zwart + Kaki)',
    variant: 'combi',
    priceId: 'price_TBD',
    amount: 5995,
    compareAt: 6990,
    image: '/bol afbeeldingen/ludack-cap-zwart-voorkant.jpg',
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
