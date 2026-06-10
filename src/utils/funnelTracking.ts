// src/utils/funnelTracking.ts

export type FunnelEvent =
  | 'promo_view'
  | 'promo_click'
  | 'demo_start'
  | 'demo_complete'
  | 'signup_view'
  | 'signup_complete';

export type FunnelSource =
  | 'calc_card'
  | 'calc_toast'
  | 'hub_appswitcher'
  | 'renoscout_page'
  | 'email'
  | 'calc_tools'
  | 'calc_section';

const SESSION_KEY = 'renoscout_session_id';

// Public project config (same values shipped in src/integrations/supabase/client.ts).
const SUPABASE_URL = 'https://kralcmyhjvoiywcpntkg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYWxjbXloanZvaXl3Y3BudGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzM3OTAsImV4cCI6MjA3MTQ0OTc5MH0.10JbU5SR2bwJyGorKifCVqCqQcnbBR4xup7NnYxz3AE';
// Neutral endpoint name (NOT "funnel"/"event") so ad/tracker blockers don't drop it.
const COLLECT_ENDPOINT = `${SUPABASE_URL}/functions/v1/rs-collect`;

/** Stable anonymous id for stitching a visitor's funnel steps together. */
export function getFunnelSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode / SSR) — use a throwaway id.
    return '00000000-0000-0000-0000-000000000000';
  }
}

/**
 * Fire-and-forget funnel event. Never throws, never blocks the UI.
 *
 * Uses a raw fetch (NOT supabase.functions.invoke) deliberately:
 *  - the neutral 'rs-collect' URL avoids ad/tracker blockers eating events;
 *  - it sidesteps the supabase-js Web Locks auth lock that can hang invoke,
 *    which matters because signup_complete fires right after sign-in when that
 *    lock is contended;
 *  - `keepalive` lets the request finish even when a click navigates away
 *    (e.g. promo_click immediately followed by a route change).
 *
 * `userId` is forwarded as a top-level column (not metadata) so a
 * `signup_complete` event can be tied to the resulting profile for
 * true-conversion attribution. Pass null/omit for anonymous events.
 */
export function track(
  eventType: FunnelEvent,
  source: FunnelSource,
  metadata: Record<string, unknown> = {},
  userId: string | null = null,
): void {
  try {
    const session_id = getFunnelSessionId();
    const body = JSON.stringify({ event_type: eventType, source, session_id, user_id: userId, metadata });
    void fetch(COLLECT_ENDPOINT, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow — analytics must never break the page */
    });
  } catch {
    /* never let tracking break the page */
  }
}
