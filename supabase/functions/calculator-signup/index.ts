import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BREVO_LIST_ID = 3;
const BREVO_TEMPLATE_ID = 1;

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
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ success: false, error: "valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Save to Supabase newsletter_subscribers table
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

    const alreadySubscribed = !!dbError;

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cleanEmail,
        listIds: [BREVO_LIST_ID],
        attributes: { SOURCE: "calculator" },
        updateEnabled: true,
      }),
    });

    // 201 = new contact, 204 = existing contact updated — send welcome email only for new
    const isNew = contactRes.status === 201;
    const isAlreadyInList = contactRes.status === 204;

    if (!isNew && !isAlreadyInList) {
      const body = await contactRes.json();
      // Brevo 400 "Contact already exist in list" — treat as success, no email
      if (!(body?.code === "invalid_parameter" && body?.message?.includes("already"))) {
        console.error("Brevo error:", JSON.stringify(body));
        return new Response(
          JSON.stringify({ success: false, error: body?.message ?? "Brevo error" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Send welcome email for new contacts only (not already in DB)
    if (isNew && !alreadySubscribed) {
      const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: [{ email: cleanEmail }],
          templateId: BREVO_TEMPLATE_ID,
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
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err?.message ?? "Internal server error";
    console.error("calculator-signup error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
