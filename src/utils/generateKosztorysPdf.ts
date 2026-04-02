import type { CalculationResult, RoomInputs } from './renovationCalculator';
import { MATERIAL_NAMES, MATERIAL_UNITS } from './renovationCalculator';

function fmt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}

export async function generateKosztorysPdf(
  inputs: RoomInputs,
  result: CalculationResult
): Promise<string> {
  // Load pdfmake first, THEN vfs_fonts — order matters.
  // vfs_fonts is an IIFE that always sets window.pdfMake.vfs (browser global),
  // so we must ensure window.pdfMake exists (set by pdfmake) before vfs_fonts runs.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfMakeModule = await import('pdfmake/build/pdfmake') as any;
  await import('pdfmake/build/vfs_fonts');

  // vfs_fonts sets window.pdfMake.vfs — use that as the authoritative source
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = typeof window !== 'undefined' ? (window as any) : null;
  const pdfMake = win?.pdfMake ?? pdfMakeModule.default ?? pdfMakeModule;

  const d = new Date();
  const dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;

  const tierLabel =
    inputs.pricingTier === 'budget'
      ? 'Bud\u017cetowy'
      : inputs.pricingTier === 'mid_range'
      ? '\u015aredni'
      : 'Premium';

  const TEAL = '#14B8A6';
  const DARK = '#141414';
  const MID = '#595959';
  const LIGHT_BG = '#F2FAF9';
  const DIVIDER = '#E0E0E0';
  const HEADER_BG = '#EDEDED';

  const line = {
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 0.5, lineColor: DIVIDER }],
    margin: [0, 0, 0, 8],
  };

  const gap = { text: ' ', margin: [0, 0, 0, 6] };

  const tableLayout = {
    hLineWidth: (i: number, node: { table: { body: unknown[] } }) =>
      i === 0 || i === node.table.body.length ? 0 : 0.3,
    vLineWidth: () => 0,
    hLineColor: () => DIVIDER,
    paddingLeft: () => 6,
    paddingRight: () => 6,
    paddingTop: () => 4,
    paddingBottom: () => 4,
  };

  const summaryRows: [string, string][] = [
    ['Wymiary (szer. \u00d7 d\u0142. \u00d7 wys.):', `${inputs.width}\u00a0m \u00d7 ${inputs.length}\u00a0m \u00d7 ${inputs.height}\u00a0m`],
    ['Powierzchnia pod\u0142ogi:', `${result.floorArea.toFixed(2)}\u00a0m\u00b2`],
    ['Powierzchnia \u015bcian netto:', `${result.netWallArea.toFixed(2)}\u00a0m\u00b2`],
    ['Poziom cenowy:', tierLabel],
    ['Pod\u0142oga OSB:', inputs.useOsbFloor ? 'Tak' : 'Nie'],
    ['Sufit podwieszany:', inputs.useSuspendedCeiling ? 'Tak' : 'Nie'],
    ['Gniazdka / W\u0142\u0105czniki:', `${inputs.socketsCount} / ${inputs.switchesCount}`],
  ];

  const catRows: [string, number][] = [
    ['Pod\u0142oga', result.categories.floor],
    ['\u015aciany', result.categories.walls],
    ['Sufit', result.categories.ceiling],
    ['Elektryka', result.categories.electrical],
  ];

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [50, 50, 50, 50],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: DARK },
    content: [
      // ── Header ──
      {
        columns: [
          { text: 'CalcReno', fontSize: 22, bold: true, color: TEAL, width: 'auto' },
          { text: 'Kosztorys Remontu', fontSize: 16, bold: true, color: DARK, margin: [10, 5, 0, 0] },
        ],
        margin: [0, 0, 0, 4],
      },
      { text: `Wygenerowano: ${dateStr}`, fontSize: 9, color: MID, margin: [0, 0, 0, 10] },
      line,

      // ── Room parameters ──
      { text: 'Parametry pomieszczenia', fontSize: 12, bold: true, color: DARK, margin: [0, 0, 0, 8] },
      {
        table: {
          widths: [200, '*'],
          body: summaryRows.map(([label, value]) => [
            { text: label, fontSize: 10, color: MID },
            { text: value, fontSize: 10, bold: true, color: DARK },
          ]),
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 10],
      },
      line,

      // ── Total cost box ──
      {
        table: {
          widths: ['*'],
          body: [[
            {
              stack: [
                { text: 'Szacowany koszt materia\u0142\u00f3w', fontSize: 10, color: MID, margin: [0, 0, 0, 6] },
                {
                  columns: [
                    { text: `${fmt(result.totalCost)}\u00a0z\u0142`, fontSize: 22, bold: true, color: TEAL, width: 'auto' },
                    { text: `${fmt(result.costPerSqm)}\u00a0z\u0142/m\u00b2`, fontSize: 13, color: MID, margin: [14, 6, 0, 0] },
                  ],
                },
              ],
              fillColor: LIGHT_BG,
              margin: [12, 12, 12, 12],
            },
          ]],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 10],
      },
      line,

      // ── Category breakdown ──
      { text: 'Zestawienie koszt\u00f3w wed\u0142ug kategorii', fontSize: 12, bold: true, color: DARK, margin: [0, 0, 0, 8] },
      {
        table: {
          widths: ['*', 110, 80],
          headerRows: 1,
          body: [
            [
              { text: 'Kategoria', fontSize: 9, bold: true, color: MID, fillColor: HEADER_BG },
              { text: 'Koszt (z\u0142)', fontSize: 9, bold: true, color: MID, fillColor: HEADER_BG, alignment: 'right' },
              { text: 'Udzia\u0142 (%)', fontSize: 9, bold: true, color: MID, fillColor: HEADER_BG, alignment: 'right' },
            ],
            ...catRows.map(([label, cost]) => {
              const pct = result.totalCost > 0 ? ((cost / result.totalCost) * 100).toFixed(1) : '0.0';
              return [
                { text: label, fontSize: 10, color: DARK },
                { text: fmt(cost), fontSize: 10, color: DARK, alignment: 'right' },
                { text: `${pct}%`, fontSize: 10, color: MID, alignment: 'right' },
              ];
            }),
          ],
        },
        layout: tableLayout,
        margin: [0, 0, 0, 10],
      },
      line,

      // ── Materials list ──
      { text: 'Lista materia\u0142\u00f3w', fontSize: 12, bold: true, color: DARK, margin: [0, 0, 0, 8] },
      {
        table: {
          widths: ['*', 70, 80],
          headerRows: 1,
          body: [
            [
              { text: 'Materia\u0142', fontSize: 9, bold: true, color: MID, fillColor: HEADER_BG },
              { text: 'Ilo\u015b\u0107', fontSize: 9, bold: true, color: MID, fillColor: HEADER_BG, alignment: 'right' },
              { text: 'Jednostka', fontSize: 9, bold: true, color: MID, fillColor: HEADER_BG, alignment: 'right' },
            ],
            ...Object.entries(result.materials).map(([key, qty]) => [
              { text: MATERIAL_NAMES[key] ?? key, fontSize: 10, color: DARK },
              { text: String(qty), fontSize: 10, color: DARK, alignment: 'right' },
              { text: MATERIAL_UNITS[key] ?? 'szt', fontSize: 10, color: MID, alignment: 'right' },
            ]),
          ],
        },
        layout: tableLayout,
        margin: [0, 0, 0, 20],
      },

      // ── Footer ──
      line,
      gap,
      {
        text: 'CalcReno \u00b7 renohub.org \u00b7 Obliczenia oparte na cenach rynkowych 2026',
        fontSize: 8,
        color: MID,
      },
    ],
  };

  return new Promise((resolve, reject) => {
    try {
      const pdf = pdfMake.createPdf(docDefinition);
      pdf.getBase64((base64: string) => resolve(base64));
    } catch (err) {
      reject(err);
    }
  });
}
