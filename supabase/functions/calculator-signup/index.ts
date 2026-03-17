import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib@1.17.1";
import { encodeBase64 } from "jsr:@std/encoding/base64";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BREVO_LIST_ID = 3;

// Mirror of client-side MATERIAL_NAMES — keep in sync with renovationCalculator.ts
const MATERIAL_NAMES: Record<string, string> = {
  floorPanels: "Panele podłogowe",
  underlayment: "Podkład pod panele",
  paint: "Farba",
  drywall: "Płyty GK ścienne",
  cwProfiles: "Profile CW",
  uwProfiles: "Profile UW",
  mineralWool: "Wełna mineralna",
  tnScrews: "Wkręty TN do GK",
  wallPlaster: "Gips szpachlowy ścienny",
  finishingPlaster: "Gładź szpachlowa",
  osb: "Płyta OSB",
  osbScrews: "Wkręty OSB",
  baseboards: "Listwy przypodłogowe",
  baseboardEnds: "Narożniki/zakończenia listew",
  cdProfiles: "Profile CD 60",
  udProfiles: "Profile UD 27",
  hangers: "Wieszaki ES",
  gypsum: "Płyty GK sufitowe",
  plaster: "Gips szpachlowy sufitowy",
  sockets: "Gniazdka",
  switches: "Włączniki",
  cable15: "Przewód YDY 3x1.5",
  cable25: "Przewód YDY 3x2.5",
  junctionBox: "Puszki podtynkowe",
};

const MATERIAL_UNITS: Record<string, string> = {
  floorPanels: "m²",
  underlayment: "m²",
  paint: "l",
  drywall: "szt",
  cwProfiles: "szt",
  uwProfiles: "szt",
  mineralWool: "paczek",
  tnScrews: "opak",
  wallPlaster: "worków",
  finishingPlaster: "worków",
  osb: "szt",
  osbScrews: "opak",
  baseboards: "szt",
  baseboardEnds: "szt",
  cdProfiles: "szt",
  udProfiles: "szt",
  hangers: "szt",
  gypsum: "szt",
  plaster: "worków",
  sockets: "szt",
  switches: "szt",
  cable15: "m",
  cable25: "m",
  junctionBox: "szt",
};

interface RoomInputs {
  width: number;
  length: number;
  height: number;
  useOsbFloor: boolean;
  useSuspendedCeiling: boolean;
  socketsCount: number;
  switchesCount: number;
  pricingTier: "budget" | "mid_range" | "premium";
}

interface CalculationResult {
  totalCost: number;
  costPerSqm: number;
  floorArea: number;
  netWallArea: number;
  categories: { floor: number; walls: number; ceiling: number; electrical: number };
  materials: Record<string, number>;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("pl-PL");
}

// Mutable state object used throughout generatePdf to avoid closure reassignment issues
interface PdfState {
  page: ReturnType<PDFDocument["addPage"]>;
  y: number;
}

async function generatePdf(inputs: RoomInputs, result: CalculationResult): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const teal = rgb(0.078, 0.722, 0.651);
  const dark = rgb(0.08, 0.08, 0.08);
  const mid = rgb(0.35, 0.35, 0.35);
  const lightBg = rgb(0.95, 0.98, 0.97);
  const divider = rgb(0.88, 0.88, 0.88);

  const PAGE_W = 595;
  const PAGE_H = 842;
  const MARGIN = 50;
  const COL_W = PAGE_W - MARGIN * 2;

  // Use a mutable state object so nested helpers can both read and update page/y
  const state: PdfState = {
    page: pdfDoc.addPage([PAGE_W, PAGE_H]),
    y: PAGE_H - MARGIN,
  };

  function newPageIfNeeded(needed = 30) {
    if (state.y < MARGIN + needed) {
      state.page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      state.y = PAGE_H - MARGIN;
    }
  }

  function drawDivider() {
    state.page.drawLine({
      start: { x: MARGIN, y: state.y },
      end: { x: PAGE_W - MARGIN, y: state.y },
      thickness: 0.5,
      color: divider,
    });
    state.y -= 12;
  }

  // ── Header ──
  state.page.drawText("CalcReno", { x: MARGIN, y: state.y, font: boldFont, size: 22, color: teal });
  state.page.drawText("Kosztorys Remontu", {
    x: MARGIN + 120,
    y: state.y,
    font: boldFont,
    size: 16,
    color: dark,
  });
  state.y -= 18;
  const dateStr = new Date().toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  state.page.drawText(`Wygenerowano: ${dateStr}`, { x: MARGIN, y: state.y, font, size: 9, color: mid });
  state.y -= 20;
  drawDivider();

  // ── Room summary ──
  state.page.drawText("Parametry pomieszczenia", { x: MARGIN, y: state.y, font: boldFont, size: 12, color: dark });
  state.y -= 18;

  const tierLabel =
    inputs.pricingTier === "budget"
      ? "Budżetowy"
      : inputs.pricingTier === "mid_range"
      ? "Średni"
      : "Premium";

  const summaryRows: [string, string][] = [
    ["Wymiary (szer. × dł. × wys.)", `${inputs.width} m × ${inputs.length} m × ${inputs.height} m`],
    ["Powierzchnia podłogi", `${result.floorArea.toFixed(2)} m²`],
    ["Powierzchnia ścian netto", `${result.netWallArea.toFixed(2)} m²`],
    ["Poziom cenowy", tierLabel],
    ["Podłoga OSB", inputs.useOsbFloor ? "Tak" : "Nie"],
    ["Sufit podwieszany", inputs.useSuspendedCeiling ? "Tak" : "Nie"],
    ["Gniazdka / Włączniki", `${inputs.socketsCount} / ${inputs.switchesCount}`],
  ];

  for (const [label, value] of summaryRows) {
    newPageIfNeeded(18);
    state.page.drawText(label + ":", { x: MARGIN, y: state.y, font, size: 10, color: mid });
    state.page.drawText(value, { x: MARGIN + 200, y: state.y, font: boldFont, size: 10, color: dark });
    state.y -= 16;
  }

  state.y -= 10;
  drawDivider();

  // ── Total cost box ──
  const BOX_H = 52;
  state.page.drawRectangle({ x: MARGIN, y: state.y - BOX_H, width: COL_W, height: BOX_H, color: lightBg });
  state.page.drawText("Szacowany koszt materiałów", {
    x: MARGIN + 12,
    y: state.y - 16,
    font,
    size: 10,
    color: mid,
  });
  state.page.drawText(`${fmt(result.totalCost)} zł`, {
    x: MARGIN + 12,
    y: state.y - 38,
    font: boldFont,
    size: 22,
    color: teal,
  });
  state.page.drawText(`${fmt(result.costPerSqm)} zł/m²`, {
    x: MARGIN + 220,
    y: state.y - 38,
    font,
    size: 13,
    color: mid,
  });
  state.y -= BOX_H + 16;
  drawDivider();

  // ── Category breakdown ──
  state.page.drawText("Zestawienie kosztów według kategorii", {
    x: MARGIN,
    y: state.y,
    font: boldFont,
    size: 12,
    color: dark,
  });
  state.y -= 18;

  // Table header row
  state.page.drawRectangle({ x: MARGIN, y: state.y - 4, width: COL_W, height: 18, color: rgb(0.93, 0.93, 0.93) });
  state.page.drawText("Kategoria", { x: MARGIN + 8, y: state.y, font: boldFont, size: 9, color: mid });
  state.page.drawText("Koszt (zł)", { x: MARGIN + 300, y: state.y, font: boldFont, size: 9, color: mid });
  state.page.drawText("Udział (%)", { x: MARGIN + 420, y: state.y, font: boldFont, size: 9, color: mid });
  state.y -= 20;

  const catRows: [string, number][] = [
    ["Podłoga", result.categories.floor],
    ["Ściany", result.categories.walls],
    ["Sufit", result.categories.ceiling],
    ["Elektryka", result.categories.electrical],
  ];

  for (const [label, cost] of catRows) {
    newPageIfNeeded(18);
    const pct =
      result.totalCost > 0 ? ((cost / result.totalCost) * 100).toFixed(1) : "0.0";
    state.page.drawText(label, { x: MARGIN + 8, y: state.y, font, size: 10, color: dark });
    state.page.drawText(fmt(cost), { x: MARGIN + 300, y: state.y, font, size: 10, color: dark });
    state.page.drawText(`${pct}%`, { x: MARGIN + 420, y: state.y, font, size: 10, color: mid });
    state.y -= 3;
    state.page.drawLine({
      start: { x: MARGIN, y: state.y },
      end: { x: PAGE_W - MARGIN, y: state.y },
      thickness: 0.3,
      color: divider,
    });
    state.y -= 15;
  }

  state.y -= 8;
  drawDivider();

  // ── Materials list ──
  state.page.drawText("Lista materiałów", { x: MARGIN, y: state.y, font: boldFont, size: 12, color: dark });
  state.y -= 18;

  // Table header
  state.page.drawRectangle({ x: MARGIN, y: state.y - 4, width: COL_W, height: 18, color: rgb(0.93, 0.93, 0.93) });
  state.page.drawText("Materiał", { x: MARGIN + 8, y: state.y, font: boldFont, size: 9, color: mid });
  state.page.drawText("Ilość", { x: MARGIN + 360, y: state.y, font: boldFont, size: 9, color: mid });
  state.page.drawText("Jednostka", { x: MARGIN + 430, y: state.y, font: boldFont, size: 9, color: mid });
  state.y -= 20;

  for (const [key, qty] of Object.entries(result.materials)) {
    newPageIfNeeded(18);
    const name = MATERIAL_NAMES[key] ?? key;
    const unit = MATERIAL_UNITS[key] ?? "szt";
    state.page.drawText(name, { x: MARGIN + 8, y: state.y, font, size: 10, color: dark });
    state.page.drawText(String(qty), { x: MARGIN + 360, y: state.y, font, size: 10, color: dark });
    state.page.drawText(unit, { x: MARGIN + 430, y: state.y, font, size: 10, color: mid });
    state.y -= 3;
    state.page.drawLine({
      start: { x: MARGIN, y: state.y },
      end: { x: PAGE_W - MARGIN, y: state.y },
      thickness: 0.3,
      color: divider,
    });
    state.y -= 15;
  }

  // ── Footer on last page ──
  state.y -= 20;
  state.page.drawLine({
    start: { x: MARGIN, y: state.y },
    end: { x: PAGE_W - MARGIN, y: state.y },
    thickness: 0.5,
    color: divider,
  });
  state.y -= 14;
  state.page.drawText("CalcReno · renohub.org · Obliczenia oparte na cenach rynkowych 2026", {
    x: MARGIN,
    y: state.y,
    font,
    size: 8,
    color: mid,
  });

  const bytes = await pdfDoc.save();
  return bytes;
}

function buildEmailHtml(result: CalculationResult): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:#134e4a;padding:28px 36px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#2dd4bf;letter-spacing:-0.5px;">CalcReno</p>
            <p style="margin:6px 0 0;font-size:14px;color:#94a3b8;">Twój kosztorys remontu jest gotowy</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 16px;font-size:15px;color:#cbd5e1;line-height:1.6;">
              W załączniku znajdziesz gotowy kosztorys materiałów budowlanych. Możesz go zapisać, wydrukować lub przesłać wykonawcy.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px;">
              <tr>
                <td>
                  <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Szacowany koszt materiałów</p>
                  <p style="margin:0;font-size:32px;font-weight:700;color:#2dd4bf;">${fmt(result.totalCost)} zł</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#64748b;">${fmt(result.costPerSqm)} zł/m² · ${result.floorArea.toFixed(2)} m²</p>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
              Obliczenia oparte na cenach rynkowych 2026. Kosztorys obejmuje wyłącznie materiały — robocizna nie jest uwzględniona.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px 28px;border-top:1px solid #1e293b;">
            <p style="margin:20px 0 0;font-size:11px;color:#334155;">
              CalcReno · <a href="https://renohub.org" style="color:#2dd4bf;text-decoration:none;">renohub.org</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, result, inputs } = await req.json() as {
      email: string;
      result: CalculationResult;
      inputs: RoomInputs;
    };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ success: false, error: "valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!result || !inputs) {
      return new Response(
        JSON.stringify({ success: false, error: "result and inputs required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate PDF
    const pdfBytes = await generatePdf(inputs, result);

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: cleanEmail, first_name: "", source: "calcreno_calculator" });

    if (dbError && !dbError.message.includes("duplicate key")) {
      throw new Error(`DB error: ${dbError.message}`);
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

    // Sync contact with Brevo list (upsert — always safe)
    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        listIds: [BREVO_LIST_ID],
        attributes: { SOURCE: "calculator" },
        updateEnabled: true,
      }),
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const body = await contactRes.json();
      const isAlreadyInList =
        body?.code === "invalid_parameter" && body?.message?.includes("already");
      if (!isAlreadyInList) {
        console.error("Brevo contact error:", JSON.stringify(body));
        // Non-fatal — still send the email
      }
    }

    // Send kosztorys email with PDF attachment — always, regardless of new/existing
    const pdfBase64 = encodeBase64(pdfBytes);

    const emailPayload = {
      to: [{ email: cleanEmail }],
      sender: { name: "CalcReno", email: "noreply@renohub.org" },
      subject: "Twój kosztorys remontu — CalcReno",
      htmlContent: buildEmailHtml(result),
      attachment: [
        {
          content: pdfBase64,
          name: "kosztorys-remontu-calcreno.pdf",
        },
      ],
    };

    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Brevo email error:", err);
      // Return success anyway — DB/contact sync worked; email failure shouldn't block UI
    } else {
      await supabase
        .from("newsletter_subscribers")
        .update({ brevo_synced: true })
        .eq("email", cleanEmail);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("calculator-signup error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
