import * as XLSX from 'xlsx';

export type RoomKey = 'lazienka' | 'kuchnia' | 'salon' | 'sypialnia' | 'korytarz' | 'instalacje';

interface Material { name: string; unit: string; price: number; }

export const ROOM_NAMES: Record<RoomKey, string> = {
  lazienka:   'Łazienka',
  kuchnia:    'Kuchnia',
  salon:      'Salon',
  sypialnia:  'Sypialnia',
  korytarz:   'Korytarz',
  instalacje: 'Instalacje',
};

const ROOM_MATERIALS: Record<RoomKey, Material[]> = {
  lazienka: [
    { name: 'Płytki podłogowe',    unit: 'm²',    price: 80 },
    { name: 'Płytki ścienne',      unit: 'm²',    price: 70 },
    { name: 'Klej do płytek',      unit: 'worek', price: 35 },
    { name: 'Fuga',                unit: 'worek', price: 25 },
    { name: 'Hydroizolacja',       unit: 'l',     price: 45 },
    { name: 'Wanna / prysznic',    unit: 'szt',   price: 1200 },
    { name: 'Umywalka',            unit: 'szt',   price: 300 },
    { name: 'Toaleta',             unit: 'szt',   price: 500 },
    { name: 'Bateria umywalkowa',  unit: 'szt',   price: 250 },
    { name: 'Bateria prysznicowa', unit: 'szt',   price: 350 },
    { name: 'Gładź szpachlowa',    unit: 'worek', price: 28 },
    { name: 'Farba łazienkowa',    unit: 'l',     price: 35 },
  ],
  kuchnia: [
    { name: 'Płytki podłogowe',         unit: 'm²',    price: 70 },
    { name: 'Płytki ścienne (fartuch)', unit: 'm²',    price: 80 },
    { name: 'Klej do płytek',           unit: 'worek', price: 35 },
    { name: 'Fuga',                     unit: 'worek', price: 25 },
    { name: 'Gładź szpachlowa',         unit: 'worek', price: 28 },
    { name: 'Farba',                    unit: 'l',     price: 30 },
    { name: 'Panel podłogowy',          unit: 'm²',    price: 45 },
    { name: 'Podkład pod panele',       unit: 'm²',    price: 8 },
    { name: 'Listwy przypodłogowe',     unit: 'szt',   price: 18 },
  ],
  salon: [
    { name: 'Panel podłogowy',      unit: 'm²',    price: 45 },
    { name: 'Podkład pod panele',   unit: 'm²',    price: 8 },
    { name: 'Listwy przypodłogowe', unit: 'szt',   price: 18 },
    { name: 'Gładź szpachlowa',     unit: 'worek', price: 28 },
    { name: 'Farba',                unit: 'l',     price: 30 },
    { name: 'Płyty GK (zabudowa)',  unit: 'szt',   price: 32 },
  ],
  sypialnia: [
    { name: 'Panel podłogowy',      unit: 'm²',    price: 45 },
    { name: 'Podkład pod panele',   unit: 'm²',    price: 8 },
    { name: 'Listwy przypodłogowe', unit: 'szt',   price: 18 },
    { name: 'Gładź szpachlowa',     unit: 'worek', price: 28 },
    { name: 'Farba',                unit: 'l',     price: 30 },
  ],
  korytarz: [
    { name: 'Płytki podłogowe',     unit: 'm²',    price: 70 },
    { name: 'Klej do płytek',       unit: 'worek', price: 35 },
    { name: 'Fuga',                 unit: 'worek', price: 25 },
    { name: 'Gładź szpachlowa',     unit: 'worek', price: 28 },
    { name: 'Farba',                unit: 'l',     price: 30 },
    { name: 'Drzwi wewnętrzne',     unit: 'szt',   price: 500 },
  ],
  instalacje: [
    { name: 'Przewód YDY 3x1.5',          unit: 'm',   price: 4.5 },
    { name: 'Przewód YDY 3x2.5',          unit: 'm',   price: 6.5 },
    { name: 'Gniazdka',                   unit: 'szt', price: 25 },
    { name: 'Włączniki',                  unit: 'szt', price: 20 },
    { name: 'Puszki podtynkowe',          unit: 'szt', price: 5 },
    { name: 'Rury instalacyjne (woda)',   unit: 'm',   price: 15 },
    { name: 'Złączki',                    unit: 'szt', price: 8 },
  ],
};

function makeRoomSheet(room: RoomKey): XLSX.WorkSheet {
  const materials = ROOM_MATERIALS[room];
  const header = [['Materiał', 'Ilość', 'Jednostka', 'Cena jedn. (zł)', 'Razem (zł)']];
  const rows = materials.map((m, i) => [
    m.name, '', m.unit, m.price,
    { f: `IF(B${i + 2}="","",B${i + 2}*D${i + 2})` },
  ]);
  const sumRow = [['Suma materiałów', '', '', '', { f: `SUM(E2:E${materials.length + 1})` }]];
  const ws = XLSX.utils.aoa_to_sheet([...header, ...rows, [], ...sumRow]);
  ws['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 15 }];
  return ws;
}

function makeSummarySheet(selectedRooms: RoomKey[]): XLSX.WorkSheet {
  const titleRows: unknown[][] = [
    ['Szablon budżetu remontu 2026', ''],
    ['Uzupełnij ilości w kartach pomieszczeń, wróć tu po podsumowanie.', ''],
    [],
    ['Pomieszczenie', 'Koszt materiałów (zł)'],
  ];
  const roomRows = selectedRooms.map(r => [ROOM_NAMES[r], '← wpisz sumę z karty']);
  const footerRows: unknown[][] = [
    [],
    ['Koszt materiałów razem', '← suma powyższych'],
    ['Robocizna (~20% od materiałów)', '← oblicz'],
    ['Rezerwa budżetowa (~10%)', '← oblicz'],
    ['CAŁKOWITY BUDŻET', '← suma trzech powyższych'],
  ];
  const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...roomRows, ...footerRows]);
  ws['!cols'] = [{ wch: 35 }, { wch: 28 }];
  return ws;
}

export function generateBudgetTemplate(selectedRooms: RoomKey[]): void {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSummarySheet(selectedRooms), 'Podsumowanie');
  for (const room of selectedRooms) {
    XLSX.utils.book_append_sheet(wb, makeRoomSheet(room), ROOM_NAMES[room]);
  }
  XLSX.writeFile(wb, 'szablon-budzetu-remontu-2026.xlsx');
}
