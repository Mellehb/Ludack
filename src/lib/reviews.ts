export type Review = {
  name: string;
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  verified: boolean;
};

export const reviews: Review[] = [
  {
    name: 'Daan V.',
    city: 'Amsterdam',
    rating: 5,
    quote: 'Pasvorm is echt goed. Zit precies zoals het moet. Niet te strak, niet te los.',
    verified: true,
  },
  {
    name: 'Sofie R.',
    city: 'Rotterdam',
    rating: 5,
    quote: 'Die cherub achterkant maakt hem uniek. Overal krijg ik vragen waar ik hem vandaan heb.',
    verified: true,
  },
  {
    name: 'Milan K.',
    city: 'Utrecht',
    rating: 5,
    quote: 'Voelt premium, niet als standaard cap. Goed gedaan. Al mijn tweede besteld.',
    verified: true,
  },
];
