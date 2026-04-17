export type RoomType = 'lazienka' | 'kuchnia' | 'salon' | 'cale' | 'inne';
export type SizeRange = 'small' | 'medium' | 'large' | 'xlarge';
export type Standard = 'ekonomiczny' | 'sredni' | 'premium';
export type Condition = 'deweloperski' | 'generalny' | 'odswiezenie' | 'niewiem';

export interface CostRange { min: number; max: number; }

const BASE_COST_PER_SQM: Record<Standard, CostRange> = {
  ekonomiczny: { min: 400, max: 600 },
  sredni:      { min: 700, max: 1000 },
  premium:     { min: 1200, max: 1800 },
};

const AVG_AREA: Record<SizeRange, number> = {
  small:  7,
  medium: 15,
  large:  30,
  xlarge: 55,
};

const ROOM_MULTIPLIER: Record<RoomType, number> = {
  lazienka: 2.5,
  kuchnia:  2.0,
  salon:    1.0,
  cale:     1.15,
  inne:     1.0,
};

const CONDITION_MULTIPLIER: Record<Condition, number> = {
  deweloperski: 1.2,
  generalny:    1.0,
  odswiezenie:  0.5,
  niewiem:      0.85,
};

export function getCostRange(
  room: RoomType,
  size: SizeRange,
  standard: Standard,
  condition: Condition
): CostRange {
  const base = BASE_COST_PER_SQM[standard];
  const area = AVG_AREA[size];
  const roomMult = ROOM_MULTIPLIER[room];
  const condMult = CONDITION_MULTIPLIER[condition];
  return {
    min: Math.round((base.min * area * roomMult * condMult) / 100) * 100,
    max: Math.round((base.max * area * roomMult * condMult) / 100) * 100,
  };
}

export const ROOM_LABELS: Record<RoomType, string> = {
  lazienka: 'Łazienki',
  kuchnia:  'Kuchni',
  salon:    'Salonu',
  cale:     'Całego mieszkania',
  inne:     'Pomieszczenia',
};

export const STANDARD_LABELS: Record<Standard, string> = {
  ekonomiczny: 'ekonomicznym',
  sredni:      'średnim',
  premium:     'premium',
};

export const SIZE_LABELS: Record<SizeRange, string> = {
  small:  'do 10m²',
  medium: '10–20m²',
  large:  '20–40m²',
  xlarge: 'powyżej 40m²',
};

export function getExplanation(room: RoomType, size: SizeRange, standard: Standard): string {
  return `Remont ${ROOM_LABELS[room]} w standardzie ${STANDARD_LABELS[standard]} dla metrażu ${SIZE_LABELS[size]} to typowy zakres dla polskich warunków 2026. Twoje odpowiedzi plasują Cię w środku tego przedziału.`;
}
