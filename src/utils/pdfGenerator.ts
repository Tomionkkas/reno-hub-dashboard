import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ROOM_NAMES, type RoomKey } from './templateGenerator';

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

// RGB color palette
const C = {
  teal:       [15, 118, 110] as [number, number, number],
  tealLight:  [204, 251, 241] as [number, number, number],
  darkHeader: [31, 41, 55] as [number, number, number],
  rowAlt:     [249, 250, 251] as [number, number, number],
  white:      [255, 255, 255] as [number, number, number],
  bodyText:   [17, 24, 39] as [number, number, number],
  mutedText:  [107, 114, 128] as [number, number, number],
  border:     [226, 232, 240] as [number, number, number],
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 14;
const FOOTER_H = 10;

function drawPageHeader(doc: jsPDF, title: string) {
  doc.setFillColor(...C.teal);
  doc.rect(0, 0, PAGE_W, HEADER_H, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text('RenoHub', MARGIN, 9.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(title, PAGE_W - MARGIN, 9.5, { align: 'right' });
}

function drawPageFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.mutedText);
  doc.text(`Strona ${pageNum} / ${totalPages}`, MARGIN, PAGE_H - 5);
  doc.text('renohub.org', PAGE_W - MARGIN, PAGE_H - 5, { align: 'right' });
}

function fmtPrice(n: number) {
  return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
}

export function generateBudgetPdf(selectedRooms: RoomKey[]): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const TITLE = 'Szablon budżetu remontu 2026';

  // ── Cover / title block ────────────────────────────────────────────────────
  drawPageHeader(doc, TITLE);

  let y = HEADER_H + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...C.darkHeader);
  doc.text(TITLE, MARGIN, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.mutedText);
  const dateStr = new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.text(`Wygenerowano: ${dateStr}  ·  renohub.org`, MARGIN, y);
  y += 5;

  // Rooms pill list
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.mutedText);
  doc.text('Wybrane pomieszczenia:', MARGIN, y + 4);
  y += 4;

  const pillX = MARGIN + 42;
  const pillNames = selectedRooms.map(r => ROOM_NAMES[r]).join('   ·   ');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.bodyText);
  doc.text(pillNames, pillX, y);
  y += 8;

  // Instruction box
  doc.setFillColor(...C.tealLight);
  doc.roundedRect(MARGIN, y, CONTENT_W, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.teal);
  doc.text(
    'Uzupełnij kolumny "Ilość" dla każdego materiału — ceny jednostkowe są już wpisane. Razem obliczy się automatycznie w wersji Excel.',
    MARGIN + 4, y + 4.5,
    { maxWidth: CONTENT_W - 8 }
  );
  y += 16;

  // ── Room sections ──────────────────────────────────────────────────────────
  selectedRooms.forEach((room, roomIdx) => {
    const materials = ROOM_MATERIALS[room];

    // Section header
    if (y > PAGE_H - FOOTER_H - 40) {
      doc.addPage();
      drawPageHeader(doc, TITLE);
      y = HEADER_H + 8;
    }

    doc.setFillColor(...C.darkHeader);
    doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.white);
    doc.text(ROOM_NAMES[room].toUpperCase(), MARGIN + 4, y + 5.5);
    y += 8;

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [[
        { content: 'Materiał', styles: { halign: 'left' } },
        { content: 'Ilość', styles: { halign: 'center' } },
        { content: 'Jednostka', styles: { halign: 'center' } },
        { content: 'Cena jedn.', styles: { halign: 'right' } },
        { content: 'Razem (zł)', styles: { halign: 'right' } },
      ]],
      body: [
        ...materials.map(m => [
          m.name,
          { content: '', styles: { halign: 'center' as const } },
          { content: m.unit, styles: { halign: 'center' as const, textColor: C.mutedText } },
          { content: fmtPrice(m.price), styles: { halign: 'right' as const } },
          { content: '', styles: { halign: 'right' as const } },
        ]),
        [
          { content: 'Suma materiałów', colSpan: 4, styles: { fontStyle: 'bold' as const, textColor: C.teal, fillColor: C.tealLight } },
          { content: '', styles: { fillColor: C.tealLight } },
        ],
      ],
      headStyles: {
        fillColor: C.darkHeader,
        textColor: C.white,
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: C.bodyText,
        cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 },
        lineColor: C.border,
        lineWidth: 0.2,
      },
      alternateRowStyles: { fillColor: C.rowAlt },
      columnStyles: {
        0: { cellWidth: 72 },
        1: { cellWidth: 18 },
        2: { cellWidth: 22 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
      },
      didDrawPage: (data) => {
        drawPageHeader(doc, TITLE);
        if (roomIdx > 0 || data.pageNumber > 1) {
          y = HEADER_H + 8;
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  });

  // ── Summary section ────────────────────────────────────────────────────────
  if (y > PAGE_H - FOOTER_H - 60) {
    doc.addPage();
    drawPageHeader(doc, TITLE);
    y = HEADER_H + 8;
  }

  doc.setFillColor(...C.darkHeader);
  doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.white);
  doc.text('PODSUMOWANIE BUDŻETU', MARGIN + 4, y + 5.5);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Pomieszczenie', { content: 'Koszt materiałów (zł)', styles: { halign: 'right' } }]],
    body: [
      ...selectedRooms.map(r => [
        ROOM_NAMES[r],
        { content: '', styles: { halign: 'right' as const } },
      ]),
      [
        { content: 'Koszt materiałów razem', styles: { fontStyle: 'bold' as const } },
        { content: '', styles: { halign: 'right' as const, fontStyle: 'bold' as const } },
      ],
      [
        { content: 'Robocizna  (~20% od materiałów)', styles: { textColor: C.mutedText } },
        { content: '', styles: { halign: 'right' as const } },
      ],
      [
        { content: 'Rezerwa budżetowa  (~10%)', styles: { textColor: C.mutedText } },
        { content: '', styles: { halign: 'right' as const } },
      ],
      [
        { content: 'CAŁKOWITY BUDŻET', styles: { fontStyle: 'bold' as const, textColor: C.white, fillColor: C.teal, fontSize: 10 } },
        { content: '', styles: { halign: 'right' as const, fillColor: C.teal } },
      ],
    ],
    headStyles: {
      fillColor: C.darkHeader,
      textColor: C.white,
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: C.bodyText,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      lineColor: C.border,
      lineWidth: 0.2,
    },
    alternateRowStyles: { fillColor: C.rowAlt },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 48 },
    },
  });

  // ── Page footers ───────────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages);
  }

  doc.save('szablon-budzetu-remontu-2026.pdf');
}
