import ExcelJS from 'exceljs';

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
    { name: 'Przewód YDY 3x1.5',        unit: 'm',   price: 4.5 },
    { name: 'Przewód YDY 3x2.5',        unit: 'm',   price: 6.5 },
    { name: 'Gniazdka',                 unit: 'szt', price: 25 },
    { name: 'Włączniki',               unit: 'szt', price: 20 },
    { name: 'Puszki podtynkowe',       unit: 'szt', price: 5 },
    { name: 'Rury instalacyjne (woda)', unit: 'm',   price: 15 },
    { name: 'Złączki',                 unit: 'szt', price: 8 },
  ],
};

// ARGB color palette
const CLR = {
  teal:       'FF0F766E',
  tealMid:    'FF0D9488',
  tealLight:  'FFE6FFFA',
  darkHeader: 'FF1F2937',
  rowAlt:     'FFF9FAFB',
  white:      'FFFFFFFF',
  bodyText:   'FF111827',
  mutedText:  'FF9CA3AF',
  hintText:   'FF6B7280',
  border:     'FFE2E8F0',
  totalBg:    'FFECFDF5',
  grandBg:    'FF0F766E',
};

type HAlign = 'left' | 'center' | 'right';

function fill(argb: string): ExcelJS.Fill {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function border(argb = CLR.border): Partial<ExcelJS.Borders> {
  const s: ExcelJS.Border = { style: 'thin', color: { argb } };
  return { top: s, left: s, bottom: s, right: s };
}

function styleCell(
  cell: ExcelJS.Cell,
  opts: {
    value?: ExcelJS.CellValue;
    bold?: boolean;
    size?: number;
    color?: string;
    bg?: string;
    align?: HAlign;
    numFmt?: string;
    italic?: boolean;
    borders?: boolean;
    borderColor?: string;
  }
) {
  if (opts.value !== undefined) cell.value = opts.value;
  cell.font = {
    name: 'Calibri',
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    size: opts.size ?? 10,
    color: { argb: opts.color ?? CLR.bodyText },
  };
  if (opts.bg) cell.fill = fill(opts.bg);
  cell.alignment = { vertical: 'middle', horizontal: opts.align ?? 'left', wrapText: false };
  if (opts.numFmt) cell.numFmt = opts.numFmt;
  if (opts.borders !== false) cell.border = border(opts.borderColor ?? CLR.border);
}

function addRoomSheet(wb: ExcelJS.Workbook, room: RoomKey) {
  const ws = wb.addWorksheet(ROOM_NAMES[room]);
  const materials = ROOM_MATERIALS[room];

  ws.columns = [
    { width: 34 },
    { width: 10 },
    { width: 13 },
    { width: 20 },
    { width: 17 },
  ];

  // Row 1 — title
  ws.mergeCells('A1:E1');
  styleCell(ws.getCell('A1'), {
    value: `${ROOM_NAMES[room]}  —  lista materiałów 2026`,
    bold: true, size: 13, color: CLR.white, bg: CLR.teal,
    borders: false,
  });
  ws.getRow(1).height = 30;

  // Row 2 — column headers
  const HEADERS = ['Materiał', 'Ilość', 'Jednostka', 'Cena jedn. (zł)', 'Razem (zł)'];
  const ALIGNS: HAlign[] = ['left', 'center', 'center', 'right', 'right'];
  const hRow = ws.getRow(2);
  hRow.height = 22;
  HEADERS.forEach((h, i) => {
    styleCell(hRow.getCell(i + 1), {
      value: h, bold: true, size: 10,
      color: CLR.white, bg: CLR.darkHeader, align: ALIGNS[i],
      borderColor: CLR.darkHeader,
    });
  });

  // Data rows
  materials.forEach((m, idx) => {
    const rn = idx + 3;
    const row = ws.getRow(rn);
    row.height = 20;
    const bg = idx % 2 === 0 ? CLR.white : CLR.rowAlt;

    styleCell(row.getCell(1), { value: m.name, bg });
    styleCell(row.getCell(2), { value: null, bg, align: 'center' }); // user fills qty
    styleCell(row.getCell(3), { value: m.unit, bg, align: 'center', color: CLR.hintText });
    styleCell(row.getCell(4), {
      value: m.price, bg, align: 'right',
      numFmt: '#,##0.00 "zł"',
    });
    styleCell(row.getCell(5), {
      value: { formula: `IF(B${rn}="","",B${rn}*D${rn})` } as ExcelJS.CellValue,
      bg, align: 'right', numFmt: '#,##0.00 "zł"',
    });
  });

  // Spacer row
  ws.getRow(materials.length + 3).height = 8;

  // Total row
  const tn = materials.length + 4;
  const totalRow = ws.getRow(tn);
  totalRow.height = 24;
  const lastDataRow = materials.length + 2;

  ws.mergeCells(`A${tn}:D${tn}`);
  styleCell(ws.getCell(`A${tn}`), {
    value: 'Suma materiałów', bold: true, size: 11,
    color: CLR.teal, bg: CLR.tealLight, borderColor: CLR.tealMid,
  });
  styleCell(ws.getCell(`E${tn}`), {
    value: { formula: `SUM(E3:E${lastDataRow})` } as ExcelJS.CellValue,
    bold: true, size: 11, color: CLR.teal, bg: CLR.tealLight,
    align: 'right', numFmt: '#,##0.00 "zł"', borderColor: CLR.tealMid,
  });

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 2, activeCell: 'B3' }];
}

function addSummarySheet(wb: ExcelJS.Workbook, selectedRooms: RoomKey[]) {
  const ws = wb.addWorksheet('Podsumowanie');

  ws.columns = [{ width: 38 }, { width: 30 }];

  // Row 1 — main title
  ws.mergeCells('A1:B1');
  styleCell(ws.getCell('A1'), {
    value: 'Szablon budżetu remontu 2026',
    bold: true, size: 15, color: CLR.white, bg: CLR.teal, borders: false,
  });
  ws.getRow(1).height = 34;

  // Row 2 — subtitle
  ws.mergeCells('A2:B2');
  styleCell(ws.getCell('A2'), {
    value: 'Uzupełnij ilości w kartach pomieszczeń, a następnie wróć tu po podsumowanie.',
    italic: true, size: 10, color: CLR.hintText, bg: CLR.rowAlt, borders: false,
  });
  ws.getRow(2).height = 20;

  // Row 3 — spacer
  ws.getRow(3).height = 10;

  // Row 4 — column headers
  const hRow = ws.getRow(4);
  hRow.height = 22;
  styleCell(hRow.getCell(1), {
    value: 'Pomieszczenie', bold: true, color: CLR.white,
    bg: CLR.darkHeader, borderColor: CLR.darkHeader,
  });
  styleCell(hRow.getCell(2), {
    value: 'Koszt materiałów (zł)', bold: true, color: CLR.white,
    bg: CLR.darkHeader, align: 'right', borderColor: CLR.darkHeader,
  });

  // Room rows
  selectedRooms.forEach((room, idx) => {
    const rn = idx + 5;
    const row = ws.getRow(rn);
    row.height = 22;
    const bg = idx % 2 === 0 ? CLR.white : CLR.rowAlt;
    styleCell(row.getCell(1), { value: ROOM_NAMES[room], bg });
    styleCell(row.getCell(2), {
      value: '← wpisz sumę z karty', italic: true,
      color: CLR.mutedText, bg, align: 'right',
    });
  });

  // Spacer
  const spacerRow = selectedRooms.length + 5;
  ws.getRow(spacerRow).height = 10;

  // Footer totals
  const footerStart = spacerRow + 1;
  const footerRows: [string, string, boolean, string?, string?][] = [
    ['Koszt materiałów razem', '← suma powyższych', true, CLR.tealLight, CLR.teal],
    ['Robocizna  (~20% od materiałów)', '← oblicz', false],
    ['Rezerwa budżetowa  (~10%)', '← oblicz', false],
  ];

  footerRows.forEach(([label, hint, bold, bg, textColor], i) => {
    const rn = footerStart + i;
    const row = ws.getRow(rn);
    row.height = 22;
    styleCell(row.getCell(1), {
      value: label, bold, bg: bg ?? CLR.white,
      color: textColor ?? CLR.bodyText,
    });
    styleCell(row.getCell(2), {
      value: hint, italic: true,
      color: CLR.mutedText, bg: bg ?? CLR.white, align: 'right',
    });
  });

  // Grand total row
  const grandRow = footerStart + footerRows.length;
  const grand = ws.getRow(grandRow);
  grand.height = 26;
  styleCell(ws.getCell(`A${grandRow}`), {
    value: 'CAŁKOWITY BUDŻET', bold: true, size: 12,
    color: CLR.white, bg: CLR.grandBg, borderColor: CLR.tealMid,
  });
  styleCell(ws.getCell(`B${grandRow}`), {
    value: '← suma trzech powyższych', italic: true,
    color: 'FFCCFBF1', bg: CLR.grandBg, align: 'right', borderColor: CLR.tealMid,
  });
}

export async function generateBudgetTemplate(selectedRooms: RoomKey[]): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'RenoHub';
  wb.created = new Date();

  addSummarySheet(wb, selectedRooms);
  for (const room of selectedRooms) {
    addRoomSheet(wb, room);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'szablon-budzetu-remontu-2026.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
