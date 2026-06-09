// supabase/functions/renoscout-funnel-stats/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "").trim();
    if (!jwt) return forbid();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // 1) Validate the token -> who is calling?
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return forbid();
    const userId = userData.user.id;

    // 2) Service-role role check (defense in depth; does not trust the client).
    const { data: roleRows, error: roleErr } = await admin
      .schema("shared_schema")
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("app_name", "renohub")
      .in("role", ["admin", "owner"]);
    if (roleErr) throw new Error(`role check: ${roleErr.message}`);
    if (!roleRows || roleRows.length === 0) return forbid();

    // 3) Aggregate.
    const { launch_date = null } = await req.json().catch(() => ({}));

    const { data: events, error: evErr } = await admin
      .schema("shared_schema")
      .from("renoscout_funnel_events")
      .select("event_type, source, created_at");
    if (evErr) throw new Error(`events: ${evErr.message}`);

    const byEvent: Record<string, number> = {};
    const bySource: Record<string, Record<string, number>> = {};
    const byDay: Record<string, number> = {};
    for (const e of events ?? []) {
      byEvent[e.event_type] = (byEvent[e.event_type] ?? 0) + 1;
      (bySource[e.source] ??= {});
      bySource[e.source][e.event_type] = (bySource[e.source][e.event_type] ?? 0) + 1;
      const day = String(e.created_at).slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + 1;
    }

    // Pre-launch cohort + signups from profiles (true conversions live here).
    let cohortCount = 0;
    let totalProfiles = 0;
    {
      const { count: total } = await admin
        .schema("shared_schema").from("profiles")
        .select("*", { count: "exact", head: true });
      totalProfiles = total ?? 0;

      if (launch_date) {
        const { count: cohort } = await admin
          .schema("shared_schema").from("profiles")
          .select("*", { count: "exact", head: true })
          .lt("created_at", launch_date);
        cohortCount = cohort ?? 0;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      byEvent,
      bySource,
      byDay,
      cohortCount,
      totalProfiles,
      launch_date,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const message = (err as Error)?.message ?? "Internal server error";
    console.error("renoscout-funnel-stats error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function forbid() {
  return new Response(JSON.stringify({ success: false, error: "forbidden" }), {
    status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
