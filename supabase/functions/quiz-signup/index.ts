import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BREVO_LIST_ID = 3;

interface QuizAnswers {
  room: string;
  size: string;
  standard: string;
  condition: string;
  timing: string;
}
interface CostRange { min: number; max: number; }

function fmt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

const ROOM_LABELS: Record<string, string> = {
  lazienka: "\u0141azienka", kuchnia: "Kuchnia", salon: "Salon",
  cale: "Ca\u0142e mieszkanie", inne: "Inne",
};
const SIZE_LABELS: Record<string, string> = {
  small: "do 10m\u00b2", medium: "10\u201320m\u00b2", large: "20\u201340m\u00b2", xlarge: "powy\u017cej 40m\u00b2",
};
const STANDARD_LABELS: Record<string, string> = {
  ekonomiczny: "Ekonomiczny", sredni: "\u015arednio", premium: "Premium",
};
const CONDITION_LABELS: Record<string, string> = {
  deweloperski: "Stan deweloperski", generalny: "Remont generalny",
  odswiezenie: "Od\u015bwie\u017cenie", niewiem: "Nie wiem",
};
const TIMING_LABELS: Record<string, string> = {
  month: "W ci\u0105gu miesi\u0105ca", half_year: "3\u20136 miesi\u0119cy",
  year_plus: "Za rok+", checking: "Tylko sprawdzam",
};

function buildEmailHtml(answers: QuizAnswers, costRange: CostRange): string {
  const answerRows = [
    ["Co remontujesz?", ROOM_LABELS[answers.room] ?? answers.room],
    ["Metra\u017c?", SIZE_LABELS[answers.size] ?? answers.size],
    ["Standard?", STANDARD_LABELS[answers.standard] ?? answers.standard],
    ["Stan obecny?", CONDITION_LABELS[answers.condition] ?? answers.condition],
    ["Kiedy planujesz?", TIMING_LABELS[answers.timing] ?? answers.timing],
  ].map(([q, a]) => `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#6B7280;border-bottom:1px solid #F1F5F9;">${q}</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#111827;text-align:right;border-bottom:1px solid #F1F5F9;">${a}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;" role="presentation">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#FFFFFF;border-radius:16px;overflow:hidden;" role="presentation">

        <tr>
          <td style="background:#0F766E;padding:28px 32px;">
            <p style="margin:0;font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">RenoHub</p>
            <p style="margin:5px 0 0;font-size:13px;color:rgba(255,255,255,0.72);">Tw\u00f3j kosztorys remontu jest gotowy</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px 8px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;">Szacowany koszt materia\u0142\u00f3w</p>
            <p style="margin:0;font-size:42px;font-weight:800;color:#0D9488;letter-spacing:-2px;line-height:1;">${fmt(costRange.min)}\u00a0\u2013\u00a0${fmt(costRange.max)}\u00a0z\u0142</p>
            <p style="margin:8px 0 0;font-size:12px;color:#9CA3AF;">Ceny materia\u0142\u00f3w wg stawek rynkowych 2026 \u00b7 bez robocizny</p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px 8px;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Twoje odpowiedzi</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #E2E8F0;" role="presentation">
              ${answerRows}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px 32px;text-align:center;">
            <a href="https://renohub.org/kalkulator-remontu" style="display:inline-block;background:#0D9488;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
              Oblicz szczeg\u00f3\u0142owy kosztorys \u2192
            </a>
          </td>
        </tr>

        <tr>
          <td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #F1F5F9;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;text-align:center;">
              <strong style="color:#6B7280;">RenoHub</strong> &nbsp;\u00b7&nbsp;
              <a href="https://renohub.org" style="color:#0D9488;text-decoration:none;">renohub.org</a>
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
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, answers, costRange } = await req.json() as {
      email: string; answers: QuizAnswers; costRange: CostRange;
    };

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ success: false, error: "valid email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const bgWork = async () => {
      try {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
          { auth: { persistSession: false } }
        );

        const { error: dbError } = await supabase
          .from("newsletter_subscribers")
          .insert({ email: cleanEmail, first_name: "", source: "quiz_remontowy" });
        if (dbError && !dbError.message.includes("duplicate key")) {
          console.error("DB error:", dbError.message);
        }

        const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
        const htmlContent = buildEmailHtml(answers, costRange);

        await Promise.all([
          fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              email: cleanEmail,
              listIds: [BREVO_LIST_ID],
              attributes: { SOURCE: "quiz_remontowy", ROOM_TYPE: answers.room },
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
      } catch (bgErr) {
        console.error("background work error:", bgErr instanceof Error ? bgErr.message : bgErr);
      }
    };

    // deno-lint-ignore no-explicit-any
    (EdgeRuntime as any).waitUntil(bgWork());

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
