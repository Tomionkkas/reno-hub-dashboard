import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BREVO_LIST_ID = 3;

const ROOM_NAMES: Record<string, string> = {
  lazienka:   "Łazienka",
  kuchnia:    "Kuchnia",
  salon:      "Salon",
  sypialnia:  "Sypialnia",
  korytarz:   "Korytarz",
  instalacje: "Instalacje",
};

function buildEmailHtml(selectedRooms: string[]): string {
  const roomList = selectedRooms
    .map(r => `<li style="padding:4px 0;color:#374151;font-size:14px;">${ROOM_NAMES[r] ?? r}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;" role="presentation">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#FFFFFF;border-radius:16px;overflow:hidden;" role="presentation">

        <tr>
          <td style="background:#0F766E;padding:28px 32px;">
            <p style="margin:0;font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">RenoHub</p>
            <p style="margin:5px 0 0;font-size:13px;color:rgba(255,255,255,0.72);">Tw\u00f3j szablon bud\u017cetu remontu</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px 20px;">
            <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#111827;">Szablon pobrany pomy\u015blnie</p>
            <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
              Plik <strong>szablon-budzetu-remontu-2026.xlsx</strong> powinien by\u0107 w Twoim folderze Pobrane.
              Je\u015bli nie — wr\u00f3\u0107 na stron\u0119 i pobierz ponownie.
            </p>
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Twoje pomieszczenia</p>
            <ul style="margin:0;padding:0 0 0 18px;">
              ${roomList}
            </ul>
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 32px;text-align:center;">
            <a href="https://renohub.org/kalkulator-remontu" style="display:inline-block;background:#0D9488;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
              Oblicz dok\u0142adny kosztorys \u2192
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
    const { email, selectedRooms } = await req.json() as { email: string; selectedRooms: string[] };

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
          .insert({ email: cleanEmail, first_name: "", source: "template_download" });
        if (dbError && !dbError.message.includes("duplicate key")) {
          console.error("DB error:", dbError.message);
        }

        const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
        const htmlContent = buildEmailHtml(selectedRooms ?? []);

        await Promise.all([
          fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              email: cleanEmail,
              listIds: [BREVO_LIST_ID],
              attributes: { SOURCE: "template_download" },
              updateEnabled: true,
            }),
          }),
          fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
              to: [{ email: cleanEmail }],
              sender: { name: "RenoHub", email: "noreply@renohub.org" },
              subject: "Tw\u00f3j szablon bud\u017cetu remontu \u2014 RenoHub",
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
