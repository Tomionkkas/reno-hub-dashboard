import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BREVO_TEMPLATE_ID = 1;
const BREVO_LIST_ID = 3;

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
    const { firstName, email } = await req.json();

    if (!firstName || typeof firstName !== "string" || firstName.trim().length < 1) {
      return new Response(JSON.stringify({ success: false, error: "first_name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ success: false, error: "valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = firstName.trim();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: cleanEmail, first_name: cleanName });

    if (dbError && !dbError.message.includes("duplicate key")) {
      throw new Error(`DB error: ${dbError.message}`);
    }

    const alreadySubscribed = !!dbError;

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

    if (!alreadySubscribed) {
      const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          attributes: { FIRSTNAME: cleanName },
          listIds: [BREVO_LIST_ID],
          updateEnabled: true,
        }),
      });

      if (!contactRes.ok && contactRes.status !== 204) {
        const err = await contactRes.text();
        console.error("Brevo contact error:", err);
      }

      const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: [{ email: cleanEmail, name: cleanName }],
          templateId: BREVO_TEMPLATE_ID,
          params: { FIRSTNAME: cleanName },
        }),
      });

      if (!emailRes.ok) {
        const err = await emailRes.text();
        console.error("Brevo email error:", err);
      } else {
        await supabase
          .from("newsletter_subscribers")
          .update({ brevo_synced: true })
          .eq("email", cleanEmail);
      }
    }

    return new Response(
      JSON.stringify({ success: true, alreadySubscribed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const message = err?.message ?? "Internal server error";
    console.error("newsletter-signup error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
