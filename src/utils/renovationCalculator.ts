export type PricingTier = 'budget' | 'mid_range' | 'premium';

export interface RoomInputs {
  width: number;
  length: number;
  height: number;
  useOsbFloor: boolean;
  useSuspendedCeiling: boolean;
  socketsCount: number;
  switchesCount: number;
  pricingTier: PricingTier;
}

export interface MaterialPrices {
  floorPanels: number;
  underlayment: number;
  paint: number;
  drywall: number;
  cwProfiles: number;
  uwProfiles: number;
  mineralWool: number;
  tnScrews: number;
  wallPlaster: number;
  finishingPlaster: number;
  osb: number;
  osbScrews: number;
  baseboards: number;
  baseboardEnds: number;
  cdProfiles: number;
  udProfiles: number;
  hangers: number;
  gypsum: number;
  plaster: number;
  sockets: number;
  switches: number;
  cable15: number;
  cable25: number;
  junctionBox: number;
}

export interface CalculationResult {
  totalCost: number;
  costPerSqm: number;
  floorArea: number;
  netWallArea: number;
  categories: {
    floor: number;
    walls: number;
    ceiling: number;
    electrical: number;
  };
  materials: { [key: string]: number };
}

export const DEFAULT_PRICES: MaterialPrices = {
  floorPanels: 45,
  underlayment: 10,
  paint: 60,
  drywall: 40,
  cwProfiles: 15,
  uwProfiles: 12,
  mineralWool: 50,
  tnScrews: 20,
  wallPlaster: 30,
  finishingPlaster: 35,
  osb: 60,
  osbScrews: 15,
  baseboards: 25,
  baseboardEnds: 8,
  cdProfiles: 18,
  udProfiles: 15,
  hangers: 2,
  gypsum: 40,
  plaster: 30,
  sockets: 25,
  switches: 30,
  cable15: 5,
  cable25: 7,
  junctionBox: 5,
};

export const MATERIAL_NAMES: { [key: string]: string } = {
  floorPanels: 'Panele podłogowe',
  underlayment: 'Podkład pod panele',
  paint: 'Farba',
  drywall: 'Płyty GK ścienne',
  cwProfiles: 'Profile CW',
  uwProfiles: 'Profile UW',
  mineralWool: 'Wełna mineralna',
  tnScrews: 'Wkręty TN do GK',
  wallPlaster: 'Gips szpachlowy ścienny',
  finishingPlaster: 'Gładź szpachlowa',
  osb: 'Płyta OSB',
  osbScrews: 'Wkręty OSB',
  baseboards: 'Listwy przypodłogowe',
  baseboardEnds: 'Narożniki/zakończenia listew',
  cdProfiles: 'Profile CD 60',
  udProfiles: 'Profile UD 27',
  hangers: 'Wieszaki ES',
  gypsum: 'Płyty GK sufitowe',
  plaster: 'Gips szpachlowy sufitowy',
  sockets: 'Gniazdka',
  switches: 'Włączniki',
  cable15: 'Przewód YDY 3x1.5',
  cable25: 'Przewód YDY 3x2.5',
  junctionBox: 'Puszki podtynkowe',
};

export const MATERIAL_UNITS: { [key: string]: string } = {
  floorPanels: 'm²',
  underlayment: 'm²',
  paint: 'l',
  drywall: 'szt',
  cwProfiles: 'szt',
  uwProfiles: 'szt',
  mineralWool: 'paczek',
  tnScrews: 'opak',
  wallPlaster: 'worków',
  finishingPlaster: 'worków',
  osb: 'szt',
  osbScrews: 'opak',
  baseboards: 'szt',
  baseboardEnds: 'szt',
  cdProfiles: 'szt',
  udProfiles: 'szt',
  hangers: 'szt',
  gypsum: 'szt',
  plaster: 'worków',
  sockets: 'szt',
  switches: 'szt',
  cable15: 'm',
  cable25: 'm',
  junctionBox: 'szt',
};

export function calculateRenovation(
  inputs: RoomInputs,
  prices: MaterialPrices = DEFAULT_PRICES
): CalculationResult {
  const floorArea = inputs.width * inputs.length;
  const perimeter = 2 * (inputs.width + inputs.length);

  // Default: 1 door (0.9x2.0m), 1 window (1.5x1.2m)
  const doorArea = 0.9 * 2.0;
  const windowArea = 1.5 * 1.2;
  const netWallArea = perimeter * inputs.height - doorArea - windowArea;

  const materials: { [key: string]: number } = {};
  let floorCost = 0;
  let wallCost = 0;
  let ceilingCost = 0;
  let electricalCost = 0;

  const add = (
    key: string,
    amount: number,
    category: 'floor' | 'walls' | 'ceiling' | 'electrical'
  ) => {
    const qty = Math.ceil(amount);
    materials[key] = qty;
    const cost = qty * (prices[key as keyof MaterialPrices] || 0);
    if (category === 'floor') floorCost += cost;
    else if (category === 'walls') wallCost += cost;
    else if (category === 'ceiling') ceilingCost += cost;
    else electricalCost += cost;
  };

  // Floor
  add('floorPanels', floorArea * 1.1, 'floor');
  add('underlayment', floorArea * 1.1, 'floor');
  if (inputs.useOsbFloor) {
    add('osb', (floorArea * 1.1) / 3.125, 'floor');
    add('osbScrews', (floorArea * 1.1) / 10, 'floor');
    add('baseboards', (perimeter - 0.9) / 2.5, 'floor');
    add('baseboardEnds', 6, 'floor');
  }

  // Walls
  add('paint', netWallArea * 0.25, 'walls');
  add('drywall', (netWallArea / 3.12) * 1.1, 'walls');
  add('cwProfiles', (perimeter / 0.6) * 1.1, 'walls');
  add('uwProfiles', ((perimeter * 2) / 3) * 1.1, 'walls');
  add('mineralWool', netWallArea / 5, 'walls');
  add('tnScrews', netWallArea / 10, 'walls');
  add('wallPlaster', netWallArea / 30, 'walls');
  add('finishingPlaster', netWallArea / 25, 'walls');

  // Ceiling
  if (inputs.useSuspendedCeiling) {
    add('cdProfiles', (floorArea * 2.5) / 3, 'ceiling');
    add('udProfiles', (floorArea * 0.4) / 3, 'ceiling');
    add('hangers', floorArea * 2, 'ceiling');
    add('gypsum', floorArea / 2.4, 'ceiling');
    add('plaster', floorArea / 30, 'ceiling');
  }

  // Electrical
  const avgCableLength = Math.max(5, perimeter * 0.3);
  add('sockets', inputs.socketsCount, 'electrical');
  add('switches', inputs.switchesCount, 'electrical');
  add('cable15', inputs.switchesCount * avgCableLength, 'electrical');
  add('cable25', inputs.socketsCount * avgCableLength, 'electrical');
  add('junctionBox', inputs.socketsCount + inputs.switchesCount, 'electrical');

  const totalCost = floorCost + wallCost + ceilingCost + electricalCost;

  return {
    totalCost,
    costPerSqm: floorArea > 0 ? totalCost / floorArea : 0,
    floorArea,
    netWallArea,
    categories: {
      floor: floorCost,
      walls: wallCost,
      ceiling: ceilingCost,
      electrical: electricalCost,
    },
    materials,
  };
}
