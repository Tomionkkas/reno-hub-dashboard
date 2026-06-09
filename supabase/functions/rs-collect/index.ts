// supabase/functions/rs-collect/index.ts
// Neutral name (was renoscout-funnel-event) so ad/tracker blockers don't drop
// real visitors' events. Identical behaviour: anon-callable, inserts one event
// via the service role.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_EVENTS = new Set([
  "promo_view", "promo_click", "demo_start", "demo_complete", "signup_view", "signup_complete",
]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { event_type, source, session_id = null, user_id = null, metadata = {} } = await req.json();

    if (!event_type || !VALID_EVENTS.has(event_type) || !source || typeof source !== "string") {
      return new Response(JSON.stringify({ success: false, error: "event_type and source required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { error } = await supabase
      .schema("shared_schema")
      .from("renoscout_funnel_events")
      .insert({
        event_type,
        source,
        session_id: isUuid(session_id) ? session_id : null,
        user_id: isUuid(user_id) ? user_id : null,
        metadata: typeof metadata === "object" && metadata !== null ? metadata : {},
      });

    if (error) throw new Error(`DB error: ${error.message}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = (err as Error)?.message ?? "Internal server error";
    console.error("rs-collect error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function isUuid(v: unknown): v is string {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
