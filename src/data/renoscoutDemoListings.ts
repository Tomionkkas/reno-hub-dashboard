// src/data/renoscoutDemoListings.ts
import type { VerdictKind } from '@/components/renoscout/demoTheme';

export type DemoSource = 'otodom' | 'olx' | 'nieruchomosci-online';

export interface DemoListing {
  id: string;
  title: string;
  city: string;
  price: number;          // PLN
  sizeSqm: number;
  rooms: number;
  source: DemoSource;
  image: string;
  // Verdict / analysis (canned)
  verdict: VerdictKind;
  score: number;          // 0–10, one decimal
  confidence: number;     // 0–1
  lean: 'Pod wynajem' | 'Flip / odsprzedaż' | 'Oba warianty';
  vsMarketPct: number;    // negative = below market (good)
  grossYieldPct: number;
  compsCount: number;
  advantages: string[];
  risks: string[];
  reasoning: string;
}

export const DEMO_CITIES = ['Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Łódź', 'Warszawa'] as const;

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: 'd1',
    title: 'Kraków, Podgórze — 2 pok., do odświeżenia, blisko Ronda Matecznego',
    city: 'Kraków',
    price: 549000,
    sizeSqm: 48,
    rooms: 2,
    source: 'otodom',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70',
    verdict: 'buy',
    score: 8.4,
    confidence: 0.89,
    lean: 'Flip / odsprzedaż',
    vsMarketPct: -16,
    grossYieldPct: 6.3,
    compsCount: 142,
    advantages: ['16% poniżej mediany dzielnicy', 'Niski koszt odświeżenia (~40 tys.)', 'Wysoki popyt najmu w okolicy'],
    risks: ['Kamienica bez windy', 'Instalacja elektryczna do wymiany'],
    reasoning: 'Cena znacząco poniżej porównywalnych ofert w Podgórzu. Po lekkim remoncie realny margines na flip 12–15% lub stabilny najem.',
  },
  {
    id: 'd2',
    title: 'Wrocław, Krzyki — 3 pok., rozkładowe, parking w cenie',
    city: 'Wrocław',
    price: 729000,
    sizeSqm: 64,
    rooms: 3,
    source: 'otodom',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70',
    verdict: 'consider',
    score: 6.1,
    confidence: 0.74,
    lean: 'Pod wynajem',
    vsMarketPct: -4,
    grossYieldPct: 5.4,
    compsCount: 98,
    advantages: ['Rozkładowy metraż pod 2 pokoje na wynajem', 'Miejsce postojowe w cenie'],
    risks: ['Cena blisko mediany — wąski margines', 'Czynsz administracyjny powyżej średniej'],
    reasoning: 'Solidne mieszkanie, ale cena nie odbiega od rynku. Sensowne pod długoterminowy najem, słabe pod szybki flip.',
  },
  {
    id: 'd3',
    title: 'Gdańsk, Zaspa — kawalerka po remoncie, wysoki parter',
    city: 'Gdańsk',
    price: 389000,
    sizeSqm: 31,
    rooms: 1,
    source: 'olx',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=70',
    verdict: 'buy',
    score: 8.0,
    confidence: 0.85,
    lean: 'Pod wynajem',
    vsMarketPct: -11,
    grossYieldPct: 7.1,
    compsCount: 121,
    advantages: ['Najwyższa rentowność najmu w zestawieniu (7.1%)', 'Po remoncie — wejście bez nakładów', 'Blisko SKM'],
    risks: ['Mały metraż ogranicza grupę kupujących przy odsprzedaży'],
    reasoning: 'Gotowa do wynajęcia od pierwszego dnia. Wysoki yield i lokalizacja przy kolejce miejskiej czynią ją mocną pozycją pod najem.',
  },
  {
    id: 'd4',
    title: 'Poznań, Wilda — 2 pok., kamienica, do generalnego remontu',
    city: 'Poznań',
    price: 415000,
    sizeSqm: 52,
    rooms: 2,
    source: 'nieruchomosci-online',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=70',
    verdict: 'consider',
    score: 5.6,
    confidence: 0.68,
    lean: 'Flip / odsprzedaż',
    vsMarketPct: -19,
    grossYieldPct: 5.0,
    compsCount: 76,
    advantages: ['19% poniżej rynku', 'Duży potencjał wzrostu wartości po remoncie'],
    risks: ['Generalny remont — wysokie ryzyko kosztów (~120 tys.)', 'Stan instalacji nieznany z oferty'],
    reasoning: 'Najniższa cena względem rynku, ale wymaga generalnego remontu. Atrakcyjne dla doświadczonych flipperów, ryzykowne dla początkujących.',
  },
  {
    id: 'd5',
    title: 'Łódź, Śródmieście — 3 pok., loft po rewitalizacji',
    city: 'Łódź',
    price: 459000,
    sizeSqm: 71,
    rooms: 3,
    source: 'otodom',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=70',
    verdict: 'buy',
    score: 7.7,
    confidence: 0.81,
    lean: 'Oba warianty',
    vsMarketPct: -9,
    grossYieldPct: 6.0,
    compsCount: 64,
    advantages: ['Najniższa cena za m² w zestawieniu', 'Po rewitalizacji — niskie nakłady', 'Rosnący rynek Śródmieścia'],
    risks: ['Mniejszy rynek najmu niż w TOP5 miast'],
    reasoning: 'Bardzo dobra cena za metr w odnowionej kamienicy. Elastyczna — sprawdzi się i pod najem, i pod odsprzedaż.',
  },
  {
    id: 'd6',
    title: 'Warszawa, Praga-Płd — 2 pok., do odświeżenia, blisko metra',
    city: 'Warszawa',
    price: 689000,
    sizeSqm: 44,
    rooms: 2,
    source: 'olx',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=70',
    verdict: 'pass',
    score: 3.8,
    confidence: 0.77,
    lean: 'Flip / odsprzedaż',
    vsMarketPct: 6,
    grossYieldPct: 4.1,
    compsCount: 188,
    advantages: ['Świetna lokalizacja przy metrze'],
    risks: ['6% powyżej mediany — brak marginesu', 'Najniższy yield w zestawieniu (4.1%)', 'Cena nie zostawia miejsca na flip'],
    reasoning: 'Dobra lokalizacja nie kompensuje zawyżonej ceny. Przy tym poziomie ani flip, ani najem nie dają satysfakcjonującego zwrotu.',
  },
];

/** Polish-correct pluralisation for room counts. */
export function roomsLabel(n: number): string {
  if (n === 1) return '1 pokój';
  if (n >= 2 && n <= 4) return `${n} pokoje`;
  return `${n} pokoi`;
}

export function formatPln(value: number): string {
  return new Intl.NumberFormat('pl-PL').format(value) + ' zł';
}
