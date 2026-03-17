import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BREVO_LIST_ID = 3;

const MATERIAL_NAMES: Record<string, string> = {
  floorPanels: "Panele pod\u0142ogowe",
  underlayment: "Podk\u0142ad pod panele",
  paint: "Farba",
  drywall: "P\u0142yty GK \u015bcienne",
  cwProfiles: "Profile CW",
  uwProfiles: "Profile UW",
  mineralWool: "We\u0142na mineralna",
  tnScrews: "Wkr\u0119ty TN do GK",
  wallPlaster: "Gips szpachlowy \u015bcienny",
  finishingPlaster: "G\u0142ad\u017a szpachlowa",
  osb: "P\u0142yta OSB",
  osbScrews: "Wkr\u0119ty OSB",
  baseboards: "Listwy przypod\u0142ogowe",
  baseboardEnds: "Naro\u017cniki/zako\u0144czenia listew",
  cdProfiles: "Profile CD 60",
  udProfiles: "Profile UD 27",
  hangers: "Wieszaki ES",
  gypsum: "P\u0142yty GK sufitowe",
  plaster: "Gips szpachlowy sufitowy",
  sockets: "Gniazdka",
  switches: "W\u0142\u0105czniki",
  cable15: "Przew\u00f3d YDY 3x1.5",
  cable25: "Przew\u00f3d YDY 3x2.5",
  junctionBox: "Puszki podtynkowe",
};

const MATERIAL_UNITS: Record<string, string> = {
  floorPanels: "m\u00b2",
  underlayment: "m\u00b2",
  paint: "l",
  drywall: "szt",
  cwProfiles: "szt",
  uwProfiles: "szt",
  mineralWool: "paczek",
  tnScrews: "opak",
  wallPlaster: "work\u00f3w",
  finishingPlaster: "work\u00f3w",
  osb: "szt",
  osbScrews: "opak",
  baseboards: "szt",
  baseboardEnds: "szt",
  cdProfiles: "szt",
  udProfiles: "szt",
  hangers: "szt",
  gypsum: "szt",
  plaster: "work\u00f3w",
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
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

function buildEmailHtml(result: CalculationResult, inputs: RoomInputs): string {
  const tierLabel =
    inputs.pricingTier === "budget"
      ? "Bud\u017cetowy"
      : inputs.pricingTier === "mid_range"
      ? "\u015aredni"
      : "Premium";

  const catConfig: Array<{ label: string; cost: number; color: string }> = [
    { label: "Pod\u0142oga", cost: result.categories.floor, color: "#0D9488" },
    { label: "\u015aciany", cost: result.categories.walls, color: "#2563EB" },
    { label: "Sufit", cost: result.categories.ceiling, color: "#7C3AED" },
    { label: "Elektryka", cost: result.categories.electrical, color: "#D97706" },
  ];

  const catRowsHtml = catConfig
    .map(({ label, cost, color }) => {
      const pct = result.totalCost > 0 ? Math.round((cost / result.totalCost) * 100) : 0;
      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:80px;font-size:13px;font-weight:600;color:#374151;white-space:nowrap;">${label}</td>
              <td style="padding:0 10px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;border-radius:6px;overflow:hidden;">
                  <tr>
                    ${pct > 0 ? `<td width="${pct}%" style="background:${color};height:8px;border-radius:6px;font-size:1px;line-height:1;">&nbsp;</td>` : ''}
                    <td width="${100 - pct}%" style="font-size:1px;line-height:1;">&nbsp;</td>
                  </tr>
                </table>
              </td>
              <td style="white-space:nowrap;text-align:right;font-size:13px;font-weight:700;color:#111827;">${fmt(cost)}&nbsp;z\u0142</td>
              <td style="width:34px;text-align:right;font-size:12px;color:#9CA3AF;padding-left:6px;">${pct}%</td>
            </tr>
          </table>
        </td>
      </tr>`;
    })
    .join("");

  const materialRowsHtml = Object.entries(result.materials)
    .map(([key, qty], i) => {
      const name = MATERIAL_NAMES[key] ?? key;
      const unit = MATERIAL_UNITS[key] ?? "szt";
      const bg = i % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
      return `<tr style="background:${bg};">
        <td style="padding:9px 12px;font-size:12px;color:#374151;border-bottom:1px solid #F1F5F9;">${name}</td>
        <td style="padding:9px 12px;font-size:12px;font-weight:700;color:#111827;text-align:right;border-bottom:1px solid #F1F5F9;">${qty}</td>
        <td style="padding:9px 12px;font-size:12px;color:#6B7280;text-align:right;border-bottom:1px solid #F1F5F9;">${unit}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1E293B;-webkit-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;" role="presentation">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#FFFFFF;border-radius:16px;overflow:hidden;" role="presentation">

        <!-- Header -->
        <tr>
          <td style="background:#0F766E;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td>
                  <p style="margin:0;font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">RenoHub</p>
                  <p style="margin:5px 0 0;font-size:13px;color:rgba(255,255,255,0.72);">Tw\u00f3j kosztorys remontu jest gotowy</p>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <span style="display:inline-block;background:rgba(255,255,255,0.18);border-radius:20px;padding:5px 14px;font-size:12px;font-weight:600;color:#FFFFFF;">${tierLabel}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Room info strip -->
        <tr>
          <td style="background:#F0FDFA;padding:12px 32px;border-bottom:1px solid #CCFBF1;">
            <p style="margin:0;font-size:13px;color:#0F766E;">
              <strong>${inputs.width}&nbsp;m \u00d7 ${inputs.length}&nbsp;m \u00d7 ${inputs.height}&nbsp;m</strong>
              &nbsp;\u00b7&nbsp; pod\u0142oga: ${result.floorArea.toFixed(2)}&nbsp;m\u00b2
              &nbsp;\u00b7&nbsp; \u015bciany: ${result.netWallArea.toFixed(2)}&nbsp;m\u00b2
            </p>
          </td>
        </tr>

        <!-- Total cost hero -->
        <tr>
          <td style="padding:28px 32px 20px;">
            <p style="margin:0 0 6px;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;">Szacowany koszt materia\u0142\u00f3w</p>
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="vertical-align:baseline;">
                  <p style="margin:0;font-size:46px;font-weight:800;color:#0D9488;letter-spacing:-2px;line-height:1;">${fmt(result.totalCost)}&nbsp;z\u0142</p>
                </td>
                <td style="vertical-align:middle;padding-left:14px;">
                  <p style="margin:0;font-size:15px;color:#6B7280;font-weight:500;">${fmt(result.costPerSqm)}&nbsp;z\u0142/m\u00b2</p>
                </td>
              </tr>
            </table>
            <p style="margin:8px 0 0;font-size:12px;color:#9CA3AF;">Ceny materia\u0142\u00f3w wg stawek rynkowych 2026 &nbsp;\u00b7&nbsp; bez robocizny</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:#F1F5F9;font-size:1px;">&nbsp;</td></tr></table></td></tr>

        <!-- Category breakdown with progress bars -->
        <tr>
          <td style="padding:20px 32px 4px;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Zestawienie wed\u0142ug kategorii</p>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              ${catRowsHtml}
            </table>
          </td>
        </tr>

        <!-- Totals row -->
        <tr>
          <td style="padding:8px 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="width:80px;font-size:13px;font-weight:700;color:#111827;white-space:nowrap;">Razem</td>
                <td style="padding:0 10px;"></td>
                <td style="white-space:nowrap;text-align:right;font-size:14px;font-weight:800;color:#0D9488;">${fmt(result.totalCost)}&nbsp;z\u0142</td>
                <td style="width:34px;text-align:right;font-size:12px;color:#9CA3AF;padding-left:6px;">100%</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:#F1F5F9;font-size:1px;">&nbsp;</td></tr></table></td></tr>

        <!-- Materials list -->
        <tr>
          <td style="padding:20px 32px 12px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Lista materia\u0142\u00f3w</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #E2E8F0;" role="presentation">
              <tr style="background:#F8FAFC;">
                <th style="padding:9px 12px;font-size:11px;font-weight:700;color:#6B7280;text-align:left;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #E2E8F0;">Materia\u0142</th>
                <th style="padding:9px 12px;font-size:11px;font-weight:700;color:#6B7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #E2E8F0;">Ilo\u015b\u0107</th>
                <th style="padding:9px 12px;font-size:11px;font-weight:700;color:#6B7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #E2E8F0;">Jed.</th>
              </tr>
              ${materialRowsHtml}
            </table>
          </td>
        </tr>

        <!-- CTA button -->
        <tr>
          <td style="padding:0 32px 32px;text-align:center;">
            <a href="https://renohub.org/kalkulator-remontu" style="display:inline-block;background:#0D9488;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.2px;">Oblicz nowy kosztorys \u2192</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #F1F5F9;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;">
              <strong style="color:#6B7280;">RenoHub</strong> &nbsp;\u00b7&nbsp;
              <a href="https://renohub.org" style="color:#0D9488;text-decoration:none;">renohub.org</a>
              &nbsp;\u00b7&nbsp; Obliczenia oparte na cenach rynkowych 2026
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

    // Return immediately — do all side-effects in the background
    const bgWork = async () => {
      try {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
          { auth: { persistSession: false } }
        );

        const { error: dbError } = await supabase
          .from("newsletter_subscribers")
          .insert({ email: cleanEmail, first_name: "", source: "calcreno_calculator" });

        if (dbError && !dbError.message.includes("duplicate key")) {
          console.error("DB error:", dbError.message);
        }

        const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
        const htmlContent = buildEmailHtml(result, inputs);

        // Fire contact sync and email send in parallel
        const [contactRes, emailRes] = await Promise.all([
          fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              email: cleanEmail,
              listIds: [BREVO_LIST_ID],
              attributes: { SOURCE: "calculator" },
              updateEnabled: true,
            }),
          }),
          fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              to: [{ email: cleanEmail }],
              sender: { name: "RenoHub", email: "noreply@renohub.org" },
              subject: "Tw\u00f3j kosztorys remontu \u2014 RenoHub",
              htmlContent,
            }),
          }),
        ]);

        if (!contactRes.ok && contactRes.status !== 204) {
          const body = await contactRes.json();
          const isAlreadyInList =
            body?.code === "invalid_parameter" && body?.message?.includes("already");
          if (!isAlreadyInList) {
            console.error("Brevo contact error:", JSON.stringify(body));
          }
        }

        if (!emailRes.ok) {
          console.error("Brevo email error:", await emailRes.text());
        } else {
          await supabase
            .from("newsletter_subscribers")
            .update({ brevo_synced: true })
            .eq("email", cleanEmail);
        }
      } catch (bgErr) {
        console.error("background work error:", bgErr instanceof Error ? bgErr.message : bgErr);
      }
    };

    // deno-lint-ignore no-explicit-any
    (EdgeRuntime as any).waitUntil(bgWork());

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
