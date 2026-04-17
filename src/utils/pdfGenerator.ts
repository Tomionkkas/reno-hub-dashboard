import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFontsNS from 'pdfmake/build/vfs_fonts';
import { ROOM_NAMES, type RoomKey } from './templateGenerator';

// Wire up the embedded Roboto font VFS — handle both CJS wrapper shapes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vfsData = (pdfFontsNS as any).pdfMake?.vfs ?? (pdfFontsNS as any).default?.pdfMake?.vfs;
pdfMake.vfs = vfsData;

interface Material { name: string; unit: string; price: number; }

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

function fmtPrice(n: number): string {
  return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
}

function cell(
  text: string,
  opts: {
    bold?: boolean;
    italics?: boolean;
    color?: string;
    fillColor?: string;
    fontSize?: number;
    alignment?: 'left' | 'center' | 'right';
    colSpan?: number;
    margin?: [number, number, number, number];
    border?: [boolean, boolean, boolean, boolean];
  } = {}
) {
  return {
    text,
    bold: opts.bold ?? false,
    italics: opts.italics ?? false,
    color: opts.color ?? '#111827',
    fillColor: opts.fillColor,
    fontSize: opts.fontSize ?? 8.5,
    alignment: opts.alignment ?? 'left',
    ...(opts.colSpan ? { colSpan: opts.colSpan } : {}),
    margin: opts.margin ?? [5, 3, 5, 3],
    border: opts.border ?? [false, false, false, false],
  };
}

function sectionHeader(title: string) {
  return {
    margin: [0, 12, 0, 0] as [number, number, number, number],
    table: {
      widths: ['*'],
      body: [[
        cell(title, {
          bold: true, fontSize: 9.5,
          color: 'white', fillColor: '#1F2937',
          margin: [8, 6, 8, 6],
        }),
      ]],
    },
    layout: 'noBorders',
  };
}

function tableLayout() {
  return {
    hLineWidth: (i: number, node: { table: { body: unknown[] } }) => {
      if (i === 0 || i === 1 || i === node.table.body.length) return 0;
      return 0.4;
    },
    vLineWidth: () => 0,
    hLineColor: () => '#E2E8F0',
    paddingTop: () => 0,
    paddingBottom: () => 0,
    paddingLeft: () => 0,
    paddingRight: () => 0,
  };
}

function headerRow(cols: string[], widths: unknown[]): unknown[] {
  return cols.map((text, i) => cell(text, {
    bold: true, color: 'white', fillColor: '#374151',
    fontSize: 8.5, margin: [5, 5, 5, 5],
    alignment: i === 0 ? 'left' : (i === cols.length - 1 || i === cols.length - 2) ? 'right' : 'center',
  }));
}

export async function generateBudgetPdf(selectedRooms: RoomKey[]): Promise<void> {
  const dateStr = new Date().toLocaleDateString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any[] = [];

  // ── Title block ────────────────────────────────────────────────────────────
  content.push(
    { text: 'Szablon budżetu remontu 2026', fontSize: 20, bold: true, color: '#1F2937', margin: [0, 0, 0, 4] },
    { text: `Wygenerowano: ${dateStr}  ·  renohub.org`, fontSize: 8.5, color: '#9CA3AF', margin: [0, 0, 0, 4] },
    {
      columns: [
        { text: 'Wybrane pomieszczenia:', fontSize: 8.5, bold: true, color: '#6B7280', width: 'auto' },
        { text: selectedRooms.map(r => ROOM_NAMES[r]).join('   ·   '), fontSize: 8.5, color: '#374151', margin: [6, 0, 0, 0] },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      table: { widths: ['*'], body: [[
        { text: 'Uzupełnij kolumny "Ilość" dla każdego materiału — ceny jednostkowe są już wpisane.', fontSize: 8.5, italics: true, color: '#0F766E', fillColor: '#CCFBF1', border: [false, false, false, false], margin: [10, 6, 10, 6] },
      ]]},
      layout: 'noBorders',
      margin: [0, 0, 0, 4],
    },
  );

  // ── Room sections ──────────────────────────────────────────────────────────
  for (const room of selectedRooms) {
    const materials = ROOM_MATERIALS[room];
    const COL_WIDTHS = ['*', 28, 38, 52, 50];

    content.push(sectionHeader(ROOM_NAMES[room]));

    content.push({
      margin: [0, 0, 0, 4] as [number, number, number, number],
      table: {
        headerRows: 1,
        widths: COL_WIDTHS,
        body: [
          headerRow(['Materiał', 'Ilość', 'Jednostka', 'Cena jedn.', 'Razem (zł)'], COL_WIDTHS),
          ...materials.map((m, i) => {
            const bg = i % 2 === 0 ? 'white' : '#F9FAFB';
            return [
              cell(m.name,           { fillColor: bg }),
              cell('',               { fillColor: bg, alignment: 'center' }),
              cell(m.unit,           { fillColor: bg, alignment: 'center', color: '#9CA3AF' }),
              cell(fmtPrice(m.price),{ fillColor: bg, alignment: 'right' }),
              cell('',               { fillColor: bg, alignment: 'right' }),
            ];
          }),
          [
            cell('Suma materiałów', { bold: true, color: '#0F766E', fillColor: '#CCFBF1', fontSize: 9, colSpan: 4, margin: [5, 5, 5, 5] }),
            {}, {}, {},
            cell('', { fillColor: '#CCFBF1', margin: [5, 5, 5, 5] }),
          ],
        ],
      },
      layout: tableLayout(),
    });
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  content.push(sectionHeader('Podsumowanie budżetu'));

  content.push({
    margin: [0, 0, 0, 0] as [number, number, number, number],
    table: {
      headerRows: 1,
      widths: ['*', 100],
      body: [
        [
          cell('Pomieszczenie',       { bold: true, color: 'white', fillColor: '#374151', margin: [5, 5, 5, 5] }),
          cell('Koszt materiałów (zł)', { bold: true, color: 'white', fillColor: '#374151', alignment: 'right', margin: [5, 5, 5, 5] }),
        ],
        ...selectedRooms.map((r, i) => {
          const bg = i % 2 === 0 ? 'white' : '#F9FAFB';
          return [
            cell(ROOM_NAMES[r], { fillColor: bg }),
            cell('',            { fillColor: bg, alignment: 'right' }),
          ];
        }),
        [
          cell('Koszt materiałów razem', { bold: true, fillColor: 'white', border: [false, true, false, true] }),
          cell('',                       { fillColor: 'white', alignment: 'right', border: [false, true, false, true] }),
        ],
        [
          cell('Robocizna  (~20% od materiałów)', { italics: true, color: '#6B7280', fillColor: '#F9FAFB' }),
          cell('', { fillColor: '#F9FAFB', alignment: 'right' }),
        ],
        [
          cell('Rezerwa budżetowa  (~10%)', { italics: true, color: '#6B7280', fillColor: 'white' }),
          cell('', { fillColor: 'white', alignment: 'right' }),
        ],
        [
          cell('CAŁKOWITY BUDŻET', { bold: true, fontSize: 10, color: 'white', fillColor: '#0F766E', margin: [8, 7, 8, 7] }),
          cell('',                 { fillColor: '#0F766E', margin: [8, 7, 8, 7] }),
        ],
      ],
    },
    layout: tableLayout(),
  });

  // ── Document definition ───────────────────────────────────────────────────
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 32],

    // Teal bar drawn behind header on every page
    background: (_page: number, pageSize: { width: number }) => ({
      canvas: [{ type: 'rect', x: 0, y: 0, w: pageSize.width, h: 32, color: '#0F766E' }],
    }),

    header: () => ({
      margin: [40, 11, 40, 0],
      columns: [
        { text: 'RenoHub', fontSize: 11, bold: true, color: 'white' },
        { text: 'Szablon budżetu remontu 2026', fontSize: 8.5, color: 'rgba(255,255,255,0.8)', alignment: 'right' },
      ],
    }),

    footer: (currentPage: number, pageCount: number) => ({
      margin: [40, 6, 40, 0],
      columns: [
        { text: `Strona ${currentPage} / ${pageCount}`, fontSize: 8, color: '#9CA3AF' },
        { text: 'renohub.org', fontSize: 8, color: '#9CA3AF', alignment: 'right' },
      ],
    }),

    content,

    defaultStyle: {
      font: 'Roboto',
      fontSize: 8.5,
      color: '#111827',
    },
  };

  pdfMake.createPdf(docDefinition as Parameters<typeof pdfMake.createPdf>[0]).download('szablon-budzetu-remontu-2026.pdf');
}
